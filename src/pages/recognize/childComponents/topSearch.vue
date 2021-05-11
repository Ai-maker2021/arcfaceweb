<template>
<!-- 识别记录-导航栏 -->
  <top-bar>
    <div class="top-content" slot="top-content">
      <div class="facetime">
        <span class="time">{{ $t("recognize.time") }}</span>
        <div class="date">
          <a-range-picker
            :allowClear="true"
            :placeholder="timePlaceholder"
            @change="handleTimeChange"
          />
        </div>
        <span class="iconfont iconziyuan3"></span>
      </div>
      <div class="allow">
        <span class="go">{{ $t("recognize.allow") }}</span>
        <a-select
          :allowClear="true"
          class="select"
          default-value=""
          style="width: 144px"
          @change="handleAllowChange"
          :suffixIcon="downIcon"
        >
          <a-select-option value="1">
            {{ $t("recognize.go") }}
          </a-select-option>
          <a-select-option value="3">
            {{ $t("recognize.noPermission") }}
          </a-select-option>
          <a-select-option value="2">
            {{ $t("recognize.forbid") }}
          </a-select-option>
        </a-select>
      </div>
      <div class="temperature">
        <span class="temp">{{ $t("recognize.temp") }}</span>
        <a-select
          :allowClear="true"
          class="select"
          style="width: 144px"
          @change="handleTemperatureChange"
          :suffixIcon="downIcon"
        >
          <a-select-option value="1">
            {{ $t("recognize.tempNormal") }}
          </a-select-option>
          <a-select-option value="2">
            {{ $t("recognize.tempAbnormal") }}
          </a-select-option>
        </a-select>
      </div>
      <div class="input">
        <a-input
          :placeholder="searchPlaceholder"
          v-model="searchData.query"
          @blur="search"
          @keyup.13="enterSearch"
          ref="inputSearch"
        />
        <span class="iconfont iconsousuo"></span>
        <span
          class="clear iconfont iconcuowu-yuan-tianchong"
          @click="clearInput"
        ></span>
      </div>

      <div class="refresh" @click="refresh">
        <span class="iconfont iconziyuan5"></span>
        <span>{{ $t("recognize.refresh") }}</span>
      </div>
      <div class="export" @click="exportData">
        <span class="iconfont icondaochu"></span>
        <span>{{ $t("recognize.export") }}</span>
      </div>
    </div>
  </top-bar>
</template>

<script>
import TopBar from "@/components/topBar/topBar";
export default {
  name: "topSearch",
  data() {
    return {
      current: "",
      downIcon: <span class="iconfont iconziyuan4"></span>,
      searchData: {
        searchTime: [],
        allowVal: null,
        query: "",
        temperatureState: 0,
      },
    };
  },
  computed: {
    timePlaceholder: function () {
      return [this.$t("recognize.startTime"), this.$t("recognize.endTime")];
    },
    searchPlaceholder: function () {
      return this.$t("recognize.searchPlaceholder");
    },
  },
  components: {
    TopBar,
  },
  methods: {
    // 获取当前样式
    getCurrentStyle(current, today) {
      const style = {};
      if (current.date() === 1) {
        style.border = "1px solid #1890ff";
        style.borderRadius = "50%";
      }
      return style;
    },
    // 监听时间改变
    handleTimeChange(moment, timeArr) {
      timeArr && timeArr.forEach(item => {
        if(item !== ""){
          this.searchData.searchTime = timeArr;
        }
        else{
          this.searchData.searchTime = [];
        }
      });
      this.search();
    },
    // 允许修改日期
    handleAllowChange(val) {
      this.searchData.allowVal = val;
      this.search();
    },
    // 监听温度修改
    handleTemperatureChange(val) {
      this.searchData.temperatureState = val || 0;
      this.search();
    },
    // 点击搜索
    search() {
      this.$emit("search", this.searchData);
    },
    // 回车搜索
    enterSearch() {
      this.search();
      this.$refs.inputSearch.blur();
    },
    // 重新获取数据
    refresh() {
      this.search();
    },
    exportData() {
      this.$emit("exportData", this.searchData);
    },
    // 清空搜索框
    clearInput() {
      this.searchData.query = "";
      this.search();
    },
  },
  mounted() {
    this.current = new Date();
  },
};
</script>

<style lang="less" scoped>
div {
  display: inline-block;
}
.top-content {
  width: 100%;
  .facetime {
    position: relative;
    width: 300px;
    margin-right: 24px;
    .time {
      margin-right: 16px;
    }
    .iconfont {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 80px;
    }
    .date {
      height: 32px;
      top: 0px;
      position: absolute;
    }
    :global(.ant-calendar-picker-input) {
      width: 232px;
      height: 32px;
      line-height: 16px;
      background-color: #f5f7fa;
      border-radius: 16px;
      color: #b1b1b1;
      border: none;
      padding-left: 32px !important;
    }
  }
  .allow,
  .temperature {
    width: 215px;
    margin-right: 24px;
    position: relative;
    .go,
    .temp {
      margin-right: 16px;
    }
    .iconfont {
      width: 16px;
      height: 16px;
      text-align: center;
      line-height: 16px;
      color: #151515;
      position: absolute;
      right: 108px;
    }
    :global(.ant-select-selection) {
      height: 32px;
      background-color: #f5f7fa;
      border-radius: 16px;
      color: #b1b1b1;
      border: none;
      padding-left: 15px !important;
    }
    :global(.select.ant-select.ant-select-enabled) {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .input:hover .clear {
    display: inline !important;
    font-size: 10px !important;
    color: rgba(0, 0, 0, 0.25);
    position: absolute;
    left: 443px;
    top: 0;
  }
  .input:hover .clear:hover {
    color: rgba(0, 0, 0, 0.45);
    transition: color 0.3s ease, opacity 0.15s ease;
  }
  .input {
    position: relative;
    .clear {
      display: none;
      cursor: pointer;
    }
    input {
      width: 160px;
      height: 32px;
      background-color: #f5f7fa;
      border-radius: 20px !important;
      border: none;
      padding-left: 40px !important;
      color: #b1b1b1;
    }
    input::-webkit-input-placeholder {
      color: #b1b1b1;
    }
    input::-moz-placeholder {
      /* Mozilla Firefox 19+ */
      color: #b1b1b1;
    }
    input:-moz-placeholder {
      /* Mozilla Firefox 4 to 18 */
      color: #b1b1b1;
    }
    input:-ms-input-placeholder {
      /* Internet Explorer 10-11 */
      color: #b1b1b1;
    }
    input:focus {
      outline: none;
    }
    .iconfont {
      left: 8px;
      font-size: 16px;
      position: absolute;
      top: 2px;
    }
    .iconfont.iconcuowu-yuan-tianchong {
      left: 142px;
    }
  }
  .export,
  .refresh {
    float: right;
    width: 80px;
    height: 32px;
    margin-top: 8px;
    line-height: 32px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;
    span {
      vertical-align: middle;
    }
  }
  .export {
    margin-right: 8px;
  }
  .refresh:hover,
  .export:hover {
    border: 1px solid #007aff;
    color: #007aff;
    line-height: 30px;
  }
}
input[type="text"] {
  color: #151515 !important;
}
.iconsousuo {
  position: absolute;
}
.en .iconfont.iconcuowu-yuan-tianchong {
  left: 220px !important;
}
.en .top-content .input input {
  width: 240px !important;
}
.en {
  .top-content .allow,
  .top-content .temperature {
    margin-right: 45px;
  }
}
</style>
