<template lang="pug">
  .teacher-home
    .top-nav
      .nav-box.clear-fix
        .left-nav.clear-fix
          .left-item-top(@click="changePage(0)")
            img(src='../../../assets/image/basics/logo.png')
            span Clap决策演练沙盘对抗平台
          .left-item-top(v-for='(item, index) of leftNav',:class="{'nav-focus': pageIndex === index}"
            :key="index",@click="changePage(index)") {{item.name}}
        .right-nav
            .user(@click="showMenu")
                img(:src='userInfo.src')
                span {{userInfo.name}}
                .user-menu(v-show="isShowMenu")
                  .personal-center(@click="go('个人中心')") 个人中心
                  .logout(@click="go('注销')") 注销
</template>
<script>
// eslint-disable-next-line import/no-unresolved
import MyBus from "@/utils/bus";
export default {
  data() {
    return {
      hash: "",
      isShowMenu: false,
      pageIndex: 0,
      leftNav: [
        { name: "用户管理", path: "/teacher/userlist" },
        { name: "班级管理", path: "/teacher/classlist" },
        { name: "实验管理", path: "/teacher/casemanage" },
        { name: "自定义案例", path: "/teacher/customcase" }
      ],
      userInfo: {
        src: "",
        name: ""
      }
    };
  },
  watch: {
    $route(to) {
      switch (to.path) {
        case "/teacher/userlist":
          if (localStorage.role === "admin") {
            this.pageIndex = 0;
          }
          break;
        case "/teacher/classlist":
          if (localStorage.role === "admin") {
            this.pageIndex = 1;
            break;
          }
          this.pageIndex = 0;
          break;
        case "/teacher/casemanage":
          if (localStorage.role === "admin") {
            this.pageIndex = 2;
            break;
          }
          this.pageIndex = 1;
          break;
        case "/teacher/custom_case":
          if (localStorage.role === "admin") {
            this.pageIndex = 3;
            break;
          }
          this.pageIndex = 2;
          break;
        default:
          break;
      }
    }
  },
  methods: {
    showMenu() {
      this.isShowMenu = !this.isShowMenu;
    },
    go(path) {
      let pathStr = "";
      if (path === "注销") {
        pathStr = "/";
        window.localStorage.removeItem("token");
      } else if (path === "个人中心") {
        pathStr = "/personalcenter";
      }
      this.$router.push({
        path: pathStr
      });
    },
    changePage(index) {
      if (this.pageIndex === index) {
        return false;
      }
      this.pageIndex = index;
      this.$router.push({ path: this.leftNav[index].path });
    },
    getByCode() {
      this.$http
        .userInfo()
        .then(res => {
          if (res.data.success) {
            //
            this.userInfo.name = res.data.data.name;
            this.userInfo.src = res.data.data.headImagePath;
          } else {
            this.$Message.error(res.data.message);
          }
        })
        .catch(() => {
          this.$Message.error("服务器异常");
        });
    }
  },
  created() {
    // this.pageIndex = localStorage.role === "admin" ? 2 : 1
    // sessionStorage.setItem("pageIndex", this.pageIndex);
  },
  mounted() {
    MyBus.$on("msg", e => {
      this.userInfo.name = e.name;
      this.userInfo.src = e.headImagePath;
    });
    if (localStorage.role !== "admin") {
      this.leftNav.splice(0, 1);
      this.leftNav.pop();
    }
    this.getByCode();
    this.hash = this.$route.path;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < this.leftNav.length; i++) {
      if (this.leftNav[i].path === this.hash) {
        this.pageIndex = i;
        break;
      } else {
        this.pageIndex = -1;
      }
    }
  }
};
</script>

<style lang="stylus" scope>
@keyframes fade-in
  from
    height 0
  to
    height 128px
@keyframes fade-out
  from
    height 128px
  to
    height 0
.teacher-home
  .top-nav
    position fixed
    top 0
    left 0
    right 0
    background #212121
    height 60px
    z-index 100
    min-width 100vw
    .nav-box
      width 1128px
      height @height
      margin 0 auto
      .left-nav
        float left
        .left-item-top
          float left
          height @height
          line-height @height
          color #979797
          font-size 14px
          width 120px
          cursor pointer
          text-align center
          &:first-child
            line-height @height
            // width 200px
            width 210px
            font-size 14px
            color rgba(255, 255, 255, 0.75)
            margin-left -8%
            margin-right 50px
            img
              width 24px
              margin-right 14px
        .nav-focus
          color #fff
      .right-nav
        float right
        box-sizing border-box
        padding-right 69px
        font-size 14px
        height @height
        line-height @height
        color #fff
        .iconfont
          font-size 18px
          display inline-block
          margin-right 30px
          cursor pointer
          color #fff
        .user
          width 125px
          display inline-block
          position relative
          cursor pointer
          &:hover
            .user-menu
              display block
          img
            width 22px
            height 22px
            border-radius 50%
            vertical-align middle
            line-height 0
            margin-right 10px
          span
            text-align right
          .user-menu
            position absolute
            left -2px
            color #979797
            background #212121
            width 137px
            text-align center
            z-index 100
            display none
            div
              height 64px
              line-height @height
              &:hover
                color #fff
    .fade-out
      animation fade-out 1s forwards
    .fade-in
      animation fade-in 1s forwards
  .content
    margin 0 auto
    padding-top 108px
    width 100%
    min-height calc(100vh)
    min-width 1349px
    // width 1349px
    background #EEF2F5
    box-sizing border-box
    padding-bottom 100px
    .box
      width 1128px
      margin 0 auto
</style>
