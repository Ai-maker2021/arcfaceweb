<template>
<!-- 人员查看 -->
  <div class="lookover">
    <top-bar>
      <div class="top" slot="top-content">
        <span class="back iconfont iconziyuan11" @click="handleBack"></span>
        <span>{{ $t("lookover.manage") }}</span>
        <span class="next iconfont iconziyuan12"></span>
        <span>{{ $t("lookover.info") }}</span>
      </div>
    </top-bar>
    <div class="lookover-content">
      <div class="box">
        <div class="info">
          <div class="name">
            <div class="label">
              {{ $t("lookover.name") }}
            </div>
            <div class="value">
              {{ personInfo.personName }}
            </div>
          </div>
          <div class="id">
            <div class="label">
              {{ $t("lookover.ID") }}
            </div>
            <div class="value">
              {{ personInfo.personNumber }}
            </div>
          </div>
          <div class="permission">
            <div class="label">
              {{ $t("lookover.limit") }}
            </div>
            <div class="value">
              <ul>
                <li>
                  {{ $t("lookover.effectiveDate")
                  }}{{ startDate || $t("lookover.activeDateRange") }}~{{
                    endDate || $t("lookover.activeDateRange")
                  }}
                </li>
                <li>
                  {{ $t("lookover.repeatCycle") }}
                  <span v-if="dayArr.length === 7">{{
                    $t("lookover.everyday")
                  }}</span>
                  <span v-else v-for="(item, index) in dayArr" :key="item"
                    >{{ item
                    }}{{
                      index !== dayArr.length - 1 ? "&nbsp;&nbsp;" : ""
                    }}</span
                  >
                </li>
                <li v-for="item in timeAndDesc" :key="item.key">
                  {{ $t("lookover.timePeriod") }}{{ item.key }}:
                  {{ item.startTime }}{{ item.startTime && item.endTime && "~"
                  }}{{ item.endTime }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="photo">
          <img :src="imgPath" ref="imghead" alt="" />
        </div>
      </div>
      <div class="edit" @click="handleEdit">{{ $t("lookover.edit") }}</div>
    </div>
  </div>
</template>

<script>
import TopBar from "@/components/topBar/topBar";
import objectFitImages from "object-fit-images";
export default {
  name: "lookover",
  data() {
    return {
      id: this.$route.params.id,
      personInfo: {},
      imgPath: null,
      accessAuthority: {},
      timeAndDesc: [],
      startDate: "",
      endDate: "",
      workingDays: [],
      dayArr: [],
    };
  },
  components: {
    TopBar,
  },
  mounted() {
    // 根据id 获取人员信息
    this.$axios
      .patch("getPersonById", { id: parseInt(this.id) })
      .then((res) => {
        if (res.data.retCode === 0) {
          this.personInfo = res.data.info["personInfo"];
          let accessAuthority = res.data.info["accessAuthority"];
          const {
            endDate,
            startDate,
            timeAndDesc,
            workingDays,
          } = accessAuthority;
          const { imagePath } = this.personInfo.faceInfo[0];
          this.timeAndDesc = timeAndDesc;
          this.startDate = startDate;
          this.endDate = endDate;
          let workDayArr = workingDays.split(",");
          workDayArr.forEach((item, index) => {
            switch (item) {
              case "1":
                this.dayArr[index] = this.$t("lookover.monday");
                break;
              case "2":
                this.dayArr[index] = this.$t("lookover.two");
                break;
              case "3":
                this.dayArr[index] = this.$t("lookover.three");
                break;
              case "4":
                this.dayArr[index] = this.$t("lookover.four");
                break;
              case "5":
                this.dayArr[index] = this.$t("lookover.five");
                break;
              case "6":
                this.dayArr[index] = this.$t("lookover.six");
                break;
              case "7":
                this.dayArr[index] = this.$t("lookover.seven");
                break;
              default:
                this.dayArr = [];
                break;
            }
          });
          this.imgPath = imagePath;
        }
      });
  },
  // 兼容ie
  updated() {
    objectFitImages(this.$refs.imghead);
  },
  methods: {
    // 回到人员管理页面
    handleBack() {
      this.$router.go(-1);
    },
    // 编辑人员信息
    handleEdit() {
      this.$router.push("/member/register/" + this.id);
    },
  },
};
</script>

<style lang="less" scoped>
.lookover {
  color: #151515;
  .top {
    height: 47px;
    line-height: 47px;
    span {
      display: inline-block;
    }
    .back {
      margin-right: 8px;
      cursor: pointer;
    }
    .next {
      margin: 0 8px;
    }
  }
  .lookover-content {
    padding: 88px 0 0 80px;
    .box {
      position: relative;
      .info {
        width: 400px;
        display: inline-block;
        .name div,
        .id div,
        .permission div {
          display: inline-block;
        }
        .name,
        .id,
        .permission {
          display: flex;
          justify-content: space-between;
          width: 350px;
          min-height: 32px;
          line-height: 32px;
          margin-bottom: 24px;
        }
        .permission {
          li:nth-child(1) {
            width: 600px;
          }
        }

        .value {
          width: 240px;
          text-align: left;
          line-break: anywhere;
        }
      }
      .photo {
        position: absolute;
        top: 25px;
        width: 184px;
        height: 184px;
        display: inline-block;
        background-color: #fff;
        margin-left: 120px;
        border-radius: 2px;
        border: solid 1px #0099ff;
        transform: translateY(-25px);
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          font-family: "object-fit: contain;";
        }
      }
    }
    .edit {
      width: 80px;
      height: 32px;
      background-color: #007aff;
      border-radius: 2px;
      cursor: pointer;
      text-align: center;
      line-height: 32px;
      color: #fff;
      font-size: 14px;
      margin: 18px 0 0 110px;
    }
    .edit:hover {
      background-color: #006fe8;
    }
  }
}
</style>
