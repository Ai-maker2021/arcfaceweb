<template>
  <div class="title-bar">
    {{ title }}
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {};
  },
  props: ["title"]
};
</script>

<style lang="less" scoped>
.title-bar {
  width: 100%;
  height: 30px;
  line-height: 30px;
  border-bottom: 1px solid rgba(0, 122, 255, 0.24);
  color: #151515;
  font-weight: 700;
}
</style>
