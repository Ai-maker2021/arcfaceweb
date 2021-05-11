<template>
<!-- 识别记录 -->
  <div class="recognize">
    <top-search @search="searchChange" @exportData="exportData" />
    <div class="content">
      <left-bar
        :recordImg="recordImg"
        :recognizeImg="recognizeImg"
        :recordLoading="recordLoading"
        :recordNoData="recordNoData"
        :recognizeLoading="recognizeLoading"
        :recognizeNoData="recognizeNoData"
      />
      <div class="list-content">
        <a-table
          :columns="columns"
          :data-source="recognizeList"
          :pagination="false"
          tableLayout="fixed"
          :customRow="rowClick"
          :row-key="rowKey"
          align="center"
          :rowClassName="
            (record, index) => {
              let className = 'light-row';
              if (index % 2 === 1) className = 'dark-row';
              if (index === clickedRow) className += ' clickedRow';
              return className;
            }
          "
        >
          <a slot="name" slot-scope="text">{{ text }}</a>
        </a-table>
      </div>
      <div class="pagination">
        <span class="total"
          >{{ $t("recognize.total") }} {{ total }}
          {{ $t("recognize.piece") }}</span
        >
        <a-pagination
          :current="searchData.page"
          :total="total"
          :pageSize="24"
          @change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import TopSearch from "./childComponents/topSearch";
import LeftBar from "./childComponents/leftBar";
export default {
  name: "recognize",
   components: {
    TopSearch,
    LeftBar
  },
  data() {
    return {
      searchData: {
        page: 1,
        pageCount: 24,
        date_interval: [],
        pass: null,
        search: "",
        temperatureState: 0
      },
      recognizeList: [],
      total: 0,
      recordImg: null,
      recognizeImg: null,
      recordLoading: false,
      recordNoData: true,
      recognizeLoading: false,
      recognizeNoData: true,
      firstRecord: {}
    };
  },
  computed: {
    columns: function() {
      return [
        {
          title: this.$t("recognize.index"),
          customRender: (text, record, index) =>
            `${index + 1 + (this.searchData.page - 1) * 24}`
        },
        {
          title: this.$t("recognize.IDLabel"),
          customRender: (text, record, index) =>
            record.pId === "-1"
              ? this.$t("recognize.unknown")
              : record.personNumber
        },
        {
          title: this.$t("recognize.nameLabel"),
          customRender: (text, record, index) =>
            record.personName === "-1"
              ? this.$t("recognize.unknown")
              : record.personName
        },
        {
          title: this.$t("recognize.createTime"),
          dataIndex: "createTime",
          key: "createTime"
        },
        {
          title: this.$t("recognize.allow"),
          customRender: (text, record, index) =>
            record.pass === "1"
              ? this.$t("recognize.go")
              : record.pass === "2"
              ? this.$t("recognize.forbid")
              : this.$t("recognize.noPermission")
        },
        {
          title: this.$t("recognize.recordTemp"),
          customRender: this.temperatureRender
        },

        {
          title: this.$t("recognize.warningTemperature"),
          dataIndex: "warningTemperature",
          key: "warningTemperature"
        }
      ];
    }
  },
  
  mounted() {
    this.getAllRecord();
  },
  methods: {
    // 	表格行 key 的取值，可以是字符串或一个函数
    rowKey(record, index) {
      return String(record.createTime + index);
    },
    // 处理渲染逻辑
    temperatureRender(text, record, index) {
      if (record.temperature >= record.warningTemperature) {
        return (
          <span class="temp">
            <span class="iconfont icongaowen"></span>
            {record.temperature}
          </span>
        );
      } else if (record.temperature === -1) {
        return "--";
      } else {
        return record.temperature;
      }
    },
    // 监听页码改变
    handlePageChange(page) {
      this.searchData.page = page;
      this.getAllRecord();
    },
    // 获取列表信息
    getAllRecord(data) {
      const _this = this;
      let searchData = this.searchData;
      if (data) {
        searchData.date_interval = data.searchTime;
        searchData.pass = data.allowVal;
        searchData.search = data.query;
        searchData.temperatureState = parseInt(data.temperatureState);
      }
      this.$axios.patch("getPaginatedRecordInfo", searchData).then(res => {
        if (res.data.retCode === 0) {
          _this.recognizeList = res.data.info;
          _this.total = res.data.total;
          this.firstRecord = _this.recognizeList[0];
          this.rowClick(this.firstRecord, 0).on.click();
        }
      });
    },
    // 点击单行
    rowClick(record, index) {
      return {
        on: {
          click: () => {
            this.clickedRow = index;
            this.recordNoData = true;
            this.recognizeImg = null;
            this.recordImg = null;
            this.recognizeNoData = false;
            this.recognizeLoading = true;
            this.recognizeImg = record && record.imagePath;
            if (this.recognizeImg) {
              this.recognizeLoading = false;
            } else {
              this.recognizeNoData = true;
            }
            if (record && record.pId !== "-1") {
              this.recordNoData = false;
              this.recordLoading = true;
              this.$axios
                .patch("getPersonById", { id: parseInt(record.pId) })
                .then(res => {
                  if (res.data.retCode === 0) {
                    this.recordLoading = false;
                    this.recordImg = res.data.info["personInfo"].faceInfo[0].imagePath || '';
                  } else {
                    this.recordNoData = true;
                  }
                });
            }
          }
        }
      };
    },
    // 监听搜索
    searchChange(data) {
      this.searchData.page = 1;
      this.getAllRecord(data);
    },
    // 导出数据
    exportData(data) {
      const _this = this;
      let searchData = this.searchData;
      if (data) {
        searchData.date_interval = data.searchTime;
        searchData.pass = data.allowVal;
        searchData.search = data.query;
        searchData.temperatureState = parseInt(data.temperatureState);
      }
      this.$axios.patch("exportToCSV", searchData).then(res => {
        if (res.data.retCode === 0) {
          window.open(res.data.info);
        }
      });
    }
  },
 
};
</script>

<style lang="less" scoped>
.recognize {
  height: 100%;
  .content {
    height: 100%;
    padding-top: 48px;
    position: relative;
    .list-content {
      padding: 0 24px 140px 310px;
      margin-top: 24px;
    }
    .pagination {
      padding-right: 40px;
      position: fixed;
      background: #fff;
      height: 63px;
      bottom: 0;
      left: 448px;
      width: calc(100% - 448px);
      padding-top: 16px;
      border-top: 1px solid rgba(0, 122, 255, 0.24);
      line-height: 63px;
      ul {
        float: right;
      }
      .total {
        position: absolute;
        top: 24px;
        left: 24px;
        height: 14px;
        line-height: 14px;
      }
    }
  }
  .temp {
    color: #ff2626;
  }
}
.en .recognize .pagination {
  padding-right: 40px;
  position: fixed;
  background: #fff;
  height: 63px;
  bottom: 0;
  left: 448px;
  margin-left: 80px;
  width: calc(100% - 520px);
  padding-top: 16px;
  border-top: 1px solid rgba(0, 122, 255, 0.24);
  line-height: 63px;
  ul {
    float: right;
  }
  .total {
    position: absolute;
    top: 24px;
    left: 24px;
    height: 14px;
    line-height: 14px;
  }
}
</style>
