<template>
<!-- 人员项 【子组件】 -->
  <div
    class="member-item"
    :class="{
      active: canSelect && checked,
    }"
    @click="selectItem"
  >
    <div class="img">
      <img :src="member.imagePath" ref="imghead" alt="" />
      <div class="border">
        <span class="iconfont iconduoxuan"></span>
      </div>
    </div>

    <p class="name">{{ member.name }}</p>
    <p class="id">{{ member.personNumber }}</p>
  </div>
</template>

<script>
import { mapState } from "vuex";
import objectFitImages from "object-fit-images";
export default {
  name: "",
  data() {
    return {};
  },
  props: ["canSelect", "member"],
  mounted() {
    objectFitImages(this.$refs.imghead);
  },
  methods: {
    selectItem() {
      let stateMembers = JSON.parse(JSON.stringify(this.stateMembers));
      for (let item of stateMembers) {
        if (item.pId === this.member.pId) {
          item.checked = !this.checked;
        }
      }
      this.$store.commit("setMembers", stateMembers);
      this.$emit("selectItem");
    },
  },
  computed: mapState({
    checked: function (state) {
      for (let item of state.members) {
        if (item.pId === this.member.pId) {
          return item.checked;
        }
      }
    },
    stateMembers: (state) => state.members,
  }),
};
</script>

<style lang="less" scoped>
.member-item {
  .img {
    width: 100%;
    border-radius: 4px;
    background-color: #f8f8f8;
    overflow: hidden;
    position: relative;
    padding: 50% 0;
    img {
      float: left;
      object-fit: contain;
      font-family: "object-fit: contain;";
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
    .border {
      width: 100%;
      height: 100%;
      visibility: hidden;
      position: absolute;
      border: 4px solid #007aff;
      border-radius: 4px;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      span {
        visibility: hidden;
        position: absolute;
        bottom: 10px;
        right: 4px;
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
    }
  }
  p {
    // margin-top: 8px;
    margin-bottom: 0;
    line-height: 1.5;
    color: #151515;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.member-item.active {
  outline: none;
  position: relative;
  color: #007aff;
  .img {
    outline: none;
    .border {
      visibility: visible;
      span {
        visibility: visible;
      }
    }
  }
  p {
    color: #007aff !important;
  }
}
.member-item:hover {
  position: relative !important;
  p {
    color: #007aff !important;
  }
  .border {
    visibility: visible !important;
  }
}
</style>
