<template lang="pug">
.teacher-home
    topNav
    router-view
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
