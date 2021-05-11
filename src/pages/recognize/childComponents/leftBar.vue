<template>
<!-- 识别记录-左侧侧边栏 -->
  <div class="left-bar">
    <div class="record">
      <span class="title">{{ $t("recognize.recordPhoto") }}</span>
      <div class="record-img">
        <a-spin v-if="recordLoading" />
        <span v-if="recordNoData" class="no-photo">NO PHOTO</span>
        <img :src="recordImg" ref="imghead" alt="" v-if="recordImg" />
      </div>
    </div>
    <div class="recognize">
      <span class="title">{{ $t("recognize.recognizePhoto") }}</span>
      <div class="recognize-img">
        <img :src="recognizeImg" ref="imghead" alt="" v-if="recognizeImg" />
        <span v-if="recordNoData || recognizeNoData" class="no-photo"
          >NO PHOTO</span
        >
        <a-spin v-if="recognizeLoading && !recordNoData" />
      </div>
    </div>
  </div>
</template>

<script>
import objectFitImages from "object-fit-images";
export default {
  name: "leftBar",
  data() {
    return {};
  },
  props: [
    "recognizeImg",
    "recordImg",
    "recordLoading",
    "recordNoData",
    "recognizeLoading",
    "recognizeNoData"
  ],
  methods: {},
  mounted() {
    objectFitImages(this.$refs.imghead);
  }
};
</script>

<style lang="less" scoped>
.left-bar {
  position: fixed;
  width: 288px;
  height: 100%;
  background-color: #f8f8f8;
  padding: 23px 0 0 24px;
  .title {
    margin-bottom: 8px;
    display: inline-block;
    height: 14px;
    line-height: 14px;
  }
  > div {
    height: 30vh;
  }
  .record {
    margin-bottom: 24px;
    .record-img {
      width: 240px;
      // height: 240px;
      height: 100%;
      background-color: #ffffff;
      border-radius: 2px;
      text-align: center;
      line-height: 240px;
      color: #a5a5a5;
      font-size: 16px;
      position: relative;

      img {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        object-fit: contain;
        font-family: "object-fit: contain;";
      }
    }
  }
  .recognize {
    .recognize-img {
      width: 240px;
      // height: 240px;
      height: 100%;
      background-color: #ffffff;
      border-radius: 2px;
      text-align: center;
      line-height: 240px;
      color: #a5a5a5;
      font-size: 16px;
      position: relative;
      img {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        object-fit: contain;
        font-family: "object-fit: contain;";
      }
    }
    :global(.ant-spin-dot) {
      font-size: 25px !important;
    }
    :global(.ant-spin-dot-item) {
      width: 12px !important;
      height: 12px !important;
    }
  }
}
</style>
