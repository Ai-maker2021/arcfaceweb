<template>
  <div class="background">
    <div class="title">ArcFaceGo {{ $t("login.ArcFaceGo") }}</div>
    <slot name="form"></slot>
  </div>
</template>

<script>
export default {
  name: "background",
  data() {
    return {};
  },
};
</script>

<style lang="less" scoped>
.background {
  position: relative;
  height: 100%;
  width: 100%;
  background: url("../../../assets/images/login/bg.png") center center no-repeat;
  background-size: 100% 100%;
  .title {
    height: 28px;
    line-height: 28px;
    font-size: 28px;
    color: #ffffff;
    position: absolute;
    top: 20%;
    left: 50%;
    margin-bottom: 40px;
    transform: translateX(-50%);
    text-align: center;
  }
}
</style>
