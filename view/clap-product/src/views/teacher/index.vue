<template lang="pug">
.teacher-home
    topNav
    router-view.content
</template>
<script>
import topNav from "@/components/Teacher/common/topNav.vue";
export default {
  components: {
    topNav
  },
  data() {
    return {
      userInfo: {
        src: "",
        name: ""
      }
    };
  }
};
</script>
<style lang="stylus" scoped>
.teacher-home
  background #eef2f5
  .content
    padding-top 108px
    min-height 100vh
    min-width 1349px
    background #eef2f5
    -webkit-box-sizing border-box
    box-sizing border-box
    padding-bottom 100px
</style>
