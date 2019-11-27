/* * @Author: 孙福聪 * @Date: 2019-01-16 16:02:47 * @Last Modified by: 史和祥 *
@Last Modified time: 2019-04-10 13:42:56 */
<template lang="pug">
.login
    .overburden
    .login-from
      .form-title
        //- img.logo(src='../assets/loginpage/logo.png')
        span {{softConfig.softName}}
      .form-content
        p.title(@click="getuser") 登录
        Form.form(ref='loginForm' :model='loginForm' tatus-icon :rules='formRules')
          FormItem.formitem(prop='code')
            Input.input(v-model='loginForm.code' placeholder='请输入账号')
          FormItem(prop='password')
            Input(v-model='loginForm.password' placeholder='请输入密码' type="password" prop='password'
             @keyup.enter.native="submitForm('loginForm')")
          FormItem
            Checkbox(label='记住密码' v-model='isRemember')
              span 记住密码
            router-link(to='/forgetpassword').a 忘记密码
          FormItem
            Button(type='primary' @click="submitForm('loginForm')" style="margin:0 auto") 登录
        div.cas
          <a style="color:lightslategray;font-weight: bolder" href="casredirect.html" v-if="softConfig.useCas==1">使用CAS账号登录</a>
    .copyright {{softConfig.copyRightValue}}
</template>

<script>
import { Form, FormItem, Input, Button, Checkbox, Message } from "view-design";
export default {
  components: { Form, FormItem, Input, Button, Checkbox },
  data() {
    return {
      loginForm: {
        code: "",
        password: ""
      },
      formRules: {
        code: [
          { required: true, message: "请输入账号", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9_-]{1,12}$/,
            message: "账号只能为字母,下划线数字,长度不能超过12位",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9_-]{1,16}$/,
            message: "密码只能为字母,下划线数字,长度不能超过12位",
            trigger: "blur"
          }
        ]
      },
      softConfig: "",
      version: "",
      isRemember: false
    };
  },
  methods: {
    getuser() {
      this.$http.userList().then(res => {
        console.log(res);
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http.login(this.loginForm).then(res => {
            localStorage.token = res.data.data.token;
            localStorage.role = res.data.data.role;
            localStorage.code = res.data.data.code;
            Message.success("登陆成功");
            const path = {
              admin: "/teacher/userlist",
              teacher: "./teacher/classlist"
            };
            this.$router.push(path[res.data.data.role]);
          });
        }
      });
    }
  }
};
</script>
<style lang="stylus" scope>
.cas
     text-align right
     margin-top -5px
     margin-right -0px
     font-size 12px
.login
  position relative
  background url('../assets/image/login.webp')
  background-repeat no-repeat
  background-attachment fixed
  background-size cover
  height 100vh
  width 100%
  box-sizing border-box
  z-index 1
  overflow hidden
  .copyright
    color #fff
    font-size 16px
    z-index 3
    position absolute
    bottom 75px
    text-align center
    width 100%
    height 30px
    line-height 30px
  >.login-from
    position absolute
    z-index 4
    width 534px
    left 50%
    top 45%
    transform translate(-50%, -50%)
    >.form-title
      text-align center
      margin-bottom 36px
      & *
        display inline-block
        vertical-align middle
      >.logo
        width 44px
        height 33px
      >span
        font-size 30px
        color white
    >.form-content
      background #fff
      border-radius 12px
      margin auto
      height 364px
      width 380px
      padding 30px 30px 0px 30px
      >.title
        text-align center
        color #2A2E36
        font-size 20px
        // margin-top 28px
        margin-bottom 20px
      .ivu-input
        display inline-block
        width 320px
        height 40px
        font-size 14px
        color black
        background-color #F4F4F4
      .ivu-checkbox-wrapper
        font-size 14px
        color #808080
        float left
      .a
        font-size 14px
        position absolute
        right 0
        top -3px
        color #808080
        text-decoration none
      button
        display block
        width 320px
        height 40px
        font-size 16px
        margin-bottom 5px
        margin-left 0
      .segmenting-line
        height 0
        width 100%
        border-bottom 1px solid #CCCCCC
        margin-top 65px
      p
        text-align center
        color #808080
        font-size 14px
        margin-bottom 0
        margin-top 11px
</style>
