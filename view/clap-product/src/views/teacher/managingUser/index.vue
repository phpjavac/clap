<template lang="pug">
div.user-list
    Card
        Table(border,:columns="columns",:data="teacherList")
            template(slot-scope="{ row, index }" slot="delete")
                Button(type="error" size="small" @click="remove(row)") 删除
            template(slot-scope="{ row, index }" slot="edit")
                Button(type="primary" size="small" style="margin-right: 5px" @click="edit(row)") 编辑
        .buttom
            Button(type="primary",@click="fun_addteacher") 创建
            Page(:total="page.totalRecord",show-total,@on-change="changePage").page
    Modal(v-model="addTeacher",:title="addTeacherForm.title")
        Form(:label-width="80",ref="addTeacherForm",:model="addTeacherForm",:rules="ruleValidate")
            FormItem(label="账号",prop="code")
                Input(v-model="addTeacherForm.code",:disabled="addTeacherForm.title ==='编辑用户'")
            FormItem(label="姓名",prop="name")
                Input(v-model="addTeacherForm.name")
        div(slot="footer")
            Button(@click="cancelAddTeacher('addTeacherForm')") 取消
            Button(type="primary",@click="handleSubmit('addTeacherForm')",:loading="loading") 确定
</template>
<script>
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  FormItem,
  Input,
  Message,
  Page
} from "view-design";
export default {
  components: {
    Card,
    Table,
    Button,
    Modal,
    Form,
    FormItem,
    Input,
    Page
  },
  data() {
    return {
      loading: false,
      ruleValidate: {
        code: [
          {
            required: true,
            message: "请输入账号",
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur"
          }
        ]
      },
      teacherList: [],
      addTeacher: false,
      addTeacherForm: {
        title: "",
        code: "",
        name: ""
      },
      columns: [
        {
          title: "序号",
          type: "index"
        },
        {
          title: "登录账号",
          key: "code"
        },
        {
          title: "教师姓名",
          key: "name"
        },
        {
          title: "删除",
          slot: "delete"
        },
        {
          title: "编辑",
          slot: "edit"
        }
      ],
      page: {
        pageNo: 1,
        pageSize: 10,
        totalRecord: 0
      }
    };
  },
  methods: {
    remove(val) {
      this.$http.deluser(val.code).then(async res => {
        console.log(res);
        await this.query();
        Message.success("删除用户成功!");
      });
    },
    edit(val) {
      this.addTeacherForm = JSON.parse(JSON.stringify(val));
      this.addTeacherForm.title = "编辑用户";
      this.addTeacher = true;
    },
    changePage(val) {
      this.page.pageNo = val;
      this.query();
    },
    /** 重置添加教师表单 */
    ResetForm() {
      this.addTeacherForm = {
        title: "",
        code: "",
        name: ""
      };
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.addTeacherForm.title === "编辑用户") {
            this.loading = true;
            this.$http
              .putUser(this.addTeacherForm)
              .then(async () => {
                await this.query();
                Message.success("编辑用户成功!");
                this.addTeacher = false;
                this.ResetForm();
                this.loading = false;
              })
              .catch(() => {
                this.loading = false;
              });
          } else {
            this.loading = true;
            const data = this.addTeacherForm;
            data.role = "teacher";
            this.$http
              .register(data)
              .then(async res => {
                console.log(res);
                if (res.data.success) {
                  await this.query();
                  Message.success("添加教师成功!");
                  this.addTeacher = false;
                  this.ResetForm();
                  this.loading = false;
                }
              })
              .catch(() => {
                this.loading = false;
              });
          }
        } else {
          Message.error("请正确填写表单!");
        }
      });
    },
    cancelAddTeacher(name) {
      this.$refs[name].resetFields();
      this.addTeacher = false;
    },
    fun_addteacher() {
      this.addTeacherForm.title = "添加教师";
      this.addTeacher = true;
    },
    query() {
      return new Promise(next => {
        this.$http
          .getUserList("teacher", this.page.pageNo, this.page.pageSize)
          .then(res => {
            this.teacherList = res.data.data.list;
            this.page.totalRecord = res.data.data.totalRecord;
            next();
          });
      });
    }
  },
  created() {
    this.query();
  }
};
</script>
<style lang="stylus" scoped>
.user-list
  width 1128px
  margin 0 auto
  .buttom
    margin-top 40px
    .page
      float right
</style>
