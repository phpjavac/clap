<template lang="pug">
div.user-list
    Card
        Table(border,:columns="columns",:data="classList")
            template(slot-scope="{ row, index }" slot="detailed")
                Button(type="info" size="small" @click="remove(row)") 明细
            template(slot-scope="{ row, index }" slot="delete")
                Button(type="error" size="small" @click="remove(row)") 删除
            template(slot-scope="{ row, index }" slot="edit")
                Button(type="warning" size="small" style="margin-right: 5px" @click="edit(row)") 编辑
            template(slot-scope="{ row, index }" slot="import")
                Upload(action="./api/user/uploadUser",:headers="headers",:data="uploadData")
                    Button(type="primary" size="small" style="margin-right: 5px" @click="importStudent(row)") 导入
            template(slot-scope="{ row, index }" slot="export")
                Button(type="success" size="small" style="margin-right: 5px" @click="edit(row)") 导出
        .buttom
            Button(type="primary",@click="fun_addClass") 创建
            Page(:total="page.totalRecord",show-total,@on-change="changePage").page
    Modal(v-model="addClass",:title="addClassForm.title")
        Form(:label-width="80",ref="addClassForm",:model="addClassForm",:rules="ruleValidate")
            FormItem(label="班级名称",prop="className")
                Input(v-model="addClassForm.className")
            FormItem(label="任课老师",prop="teacherCode")
                Select(v-model="addClassForm.teacherCode",:disabled="!admin")
                    Option(v-for="item in teacherList",:value="item.code" :key="item.code") {{item.name}}
            FormItem(label="班级描述",prop="classDescribe")
                Input(v-model="addClassForm.classDescribe",type="textarea")
                
        div(slot="footer")
            Button(@click="canceladdClass('addClassForm')") 取消
            Button(type="primary",@click="handleSubmit('addClassForm')",:loading="loading") 确定
</template>
<script>
import utils from "@/utils/tool";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  FormItem,
  Input,
  Message,
  Page,
  Select,
  Option,
  Upload
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
    Page,
    Select,
    Option,
    Upload
  },
  data() {
    return {
      uploadData: {
        classId: ""
      },
      headers: {
        Authorization: `Bearer ${localStorage.token}`
      },
      admin: localStorage.role === "admin",
      teacherList: [],
      loading: false,
      ruleValidate: {
        className: [
          {
            required: true,
            message: "请输入班级名称",
            trigger: "blur"
          }
        ],
        teacherCode: [
          {
            required: true,
            message: "请选择任课教师",
            trigger: "change"
          }
        ]
      },
      classList: [],
      addClass: false,
      addClassForm: {
        title: "",
        teacherCode: localStorage.role === "admin" ? "" : localStorage.code,
        className: "",
        classDescribe: ""
      },
      columns: [
        {
          title: "序号",
          type: "index"
        },
        {
          title: "班级名称",
          key: "className"
        },
        {
          title: "班级人数",
          key: "num"
        },
        {
          title: "任课教师",
          key: "teacherName"
        },
        {
          title: "学生明细",
          slot: "detailed"
        },
        {
          title: "删除",
          slot: "delete"
        },
        {
          title: "编辑",
          slot: "edit"
        },
        {
          title: "导入",
          slot: "import"
        },
        {
          title: "导出",
          slot: "export"
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
    /**
     * 导入学生
     */
    importStudent(row) {
      this.uploadData.classId = row.id;
      console.log(row);
    },
    remove(val) {
      this.$http.delClass(val.id).then(async () => {
        await this.query();
        Message.success("删除班级成功!");
      });
    },
    edit(val) {
      this.addClassForm = JSON.parse(JSON.stringify(val));
      this.addClassForm.title = "编辑班级";
      this.addClass = true;
    },
    changePage(val) {
      this.page.pageNo = val;
      this.query();
    },
    /** 重置添加教师表单 */
    ResetForm() {
      this.addClassForm = {
        title: "",
        code: "",
        name: ""
      };
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.addClassForm.title === "编辑班级") {
            this.loading = true;
            this.$http
              .putClass(this.addClassForm)
              .then(async () => {
                await this.query();
                Message.success("编辑班级成功!");
                this.addClass = false;
                this.ResetForm();
                this.loading = false;
              })
              .catch(() => {
                this.loading = false;
              });
          } else {
            this.loading = true;
            const data = this.addClassForm;
            data.role = "teacher";
            this.$http
              .addClass(data)
              .then(async res => {
                console.log(res);
                if (res.data.success) {
                  await this.query();
                  Message.success(res.data.message);
                  this.loading = false;
                  this.ResetForm();
                  this.canceladdClass(name);
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
    canceladdClass(name) {
      this.$refs[name].resetFields();
      this.addClass = false;
    },
    fun_addClass() {
      this.addClassForm.title = "添加班级";
      this.addClass = true;
    },
    async query() {
      const queryTeacherList = await new Promise(next => {
        this.$http.getUserList("teacher").then(res => {
          this.teacherList = res.data.data.list;
          this.page.totalRecord = res.data.data.totalRecord;
          next();
        });
      });
      const queryClassList = new Promise(next => {
        this.$http
          .getClassList(this.page.pageNo, this.page.pageSize)
          .then(res => {
            this.classList = res.data.data.list.map(item => {
              item.num = 0;
              if (item.teacherCode) {
                this.$set(
                  item,
                  "teacherName",
                  utils.getObjectKey("code", this.teacherList, item.teacherCode)
                    .name
                );
              } else {
                item.teacherName = "";
              }
              return item;
            });
            this.page.totalRecord = res.data.data.totalRecord;
            next();
          });
      });
      return Promise.all([queryTeacherList, queryClassList]);
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
