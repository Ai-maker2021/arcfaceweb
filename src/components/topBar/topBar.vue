<template>
  <div class="topBar">
    <slot name="top-content"></slot>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {

    }
  }
 }
</script>

<style lang="less" scoped>
.en .topBar{
  width: calc(100% - 240px);
}
.topBar{
  width: calc(100% - 160px);
  position: fixed;
  z-index: 999;
  background-color: #fff;
  color: #151515;
  height: 47px;
  border-bottom: 1px solid rgba(0, 122, 255, 0.24);
  padding: 0 24px;
  line-height: 47px;
}
</style>
