<template>
  <div>
    <div v-if="!isLogin" id="login">
      <div class="main">
        <h2>四川大学绩点/平均分一键计算</h2>
        <mu-text-field label="学号" hintText="请输入学号" :errorText="valid.uid" fullWidth labelFloat @input="getUid" /><br/>
        <mu-text-field label="密码" hintText="请输入教务处密码" :errorText="valid.password" fullWidth type="password" labelFloat @input="getPassword"
        /><br/>
        <mu-raised-button label="登录" @click="login" class="demo-raised-button" fullWidth primary/>
      </div>

      <div id="footer">
        <a target="_blank" href="http://lailin.xyz">&#xa9; Mohuishou</a><a target="_blank" href="http://fyscu.com">	&#x261b; 飞扬研发实验室</a>
      </div>
    </div>

    <div v-if="isLogin" id="grade">
      <div>
        <mu-tabs class="grade-tabs" :value="activeTab" @change="switchTab">
          <mu-tab value="0" title="本学期成绩" />
          <mu-tab value="1" title="所有成绩" @click="getGradeAll" />
          <mu-tab value="2" title="不及格成绩" @click="getNotPass" />
        </mu-tabs>
      </div>

      <my-grade v-show="activeTab==0" :isHead=true :grade="grade" title="本学期成绩"></my-grade>

      <my-grade v-show="activeTab==1" :isHead=true :grade="grade" :title="grade.grades[0].term_name" v-for="grade in gradeAll"></my-grade>

      <my-grade v-show="activeTab!=0" :isHead=false :grade="notPass[0]" title="尚不及格"></my-grade>

      <my-grade v-show="activeTab!=0" :isHead=false :grade="notPass[1]" title="曾不及格"></my-grade>


      <mu-bottom-nav class="bottom" :value="bottomData" @change="handleChange">
        <mu-bottom-nav-item value="cal" title="计算" @click.native="calculation" icon="assignment_turned_in" />
        <mu-bottom-nav-item value="required" title="必修" @click.native="chooseRequire" icon="class" />
        <mu-bottom-nav-item value="all" title="全选" @click.native="chooseAll" icon="select_all" />
        <mu-bottom-nav-item value="clear" title="清空" @click.native="clear" icon="delete_forever" />
      </mu-bottom-nav>
    </div>
    <mu-dialog :open="dialogCal" title="计算结果" @close="closeCal">
      <div id="cal-result">
        <div class="result">
          <p>您一共选择了 {{avg.count}} 门课程，总计 {{avg.credit}} 学分</p>
          <p>平均分: {{avg.grade}}</p>
          <p>绩点: {{avg.gpa}}</p>
        </div>
        <div class="attention">
          <p>注：</p>
          <p>学分绩点=∑(课程绩点*课程学分) / 课程总学分</p>
          <p>平均成绩=∑(课程成绩*课程学分) / 课程总学分</p>
        </div>
      </div>
      <mu-flat-button slot="actions" primary @click="closeCal" label="确定" />
    </mu-dialog>

    <mu-dialog :open="errorLog" title="提示" @close="closeCal">
      {{errorText}}
      <br />
      <p style="background: #eee;padding: 15px;">
        注：如果遇到网络问题，请先测试能否直接打开教务处网站
      </p>
      <mu-flat-button slot="actions" primary @click="closeCal" label="确定" />
    </mu-dialog>

    <mu-dialog :open="isLoading" dialogClass="loading">
      <mu-circal :size="60" color="#fff" /> 
    </mu-dialog>

    <div class="loading" v-show="isLoading" >
            
    </div>
    
  </div>

</template>
<script>
  import "../../css/grade.less"


  import { tabs, tab } from "muse-components/tabs"
  import { bottomNav, bottomNavItem } from "muse-components/bottomNav"
  import gradeItem from "../../components/grade-item.vue"
  import dialog from "muse-components/dialog"
  import flatButton from "muse-components/flatButton"
  import raisedButton from "muse-components/raisedButton"
  import textField from "muse-components/textField"
  import circularProgress from "muse-components/circularProgress"

  import axios from 'axios'
  import gradeObj from '../../js/grade.js'
  const qs = require('querystring')

  axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  let gradeTest = {
    avg: {
      required: {},
      all: {}
    },
    grades: {}
  }
  export default {
    components: {
      "mu-bottom-nav": bottomNav,
      "mu-bottom-nav-item": bottomNavItem,
      "mu-tabs": tabs,
      "mu-tab": tab,
      "my-grade": gradeItem,
      "mu-dialog": dialog,
      "mu-flat-button": flatButton,
      "mu-raised-button": raisedButton,
      "mu-text-field": textField,
      "mu-circal":circularProgress
    },
    methods: {
      getUid(val) {
        this.valid.uid = '';
        this.params.uid = val;
      },
      getPassword(val) {
        this.valid.password = '';
        this.params.password = val;
      },
      login() {
        if (!this.params.uid || isNaN(this.params.uid)) {
          this.valid.uid = "学号必填且必须是数字"
          return
        }

        if (!this.params.password) {
          this.valid.password = "密码必填"
          return
        }

        this.getGrade();
        
      },
      closeCal() {
        this.dialogCal = false;
        this.errorLog = false;
      },
      handleChange(val) {
        this.bottomData = val
      },
      switchTab(val) {
        this.activeTab = val;
      },
      getGradeAll() {
        if (this.check.gpaAll != 0) {
          return
        }
        this.isLoading=true; 
        let _this = this;
        let url = "http://120.26.53.243:6627/gpa/all"
        axios.post(url, qs.stringify(this.params))
          .then(function (response) {
            let res = response.data;
            if (res.status) {
              let g = gradeObj.cal(res.data);
              _this.gradeAll = g.reverse();
              _this.check.gpaAll = 1;
              _this.getNotPass()
            } else {
              console.log(res.msg);
            }
            _this.isLoading=false;
          })
          .catch(function (response) {
            // console.log(error);
            console.log(response.message);
          })

      },
      getNotPass() {
        if (this.check.notPass != 0) {
          return
        }
        this.isLoading=true;     
        let _this = this;
        let url = "http://120.26.53.243:6627/gpa/not-pass";
        axios.post(url, qs.stringify(this.params))
          .then(function (response) {
            let res = response.data;
            if (res.status) {
              _this.notPass = gradeObj.cal(res.data);
              _this.check.notPass = 1;
            } else {
              console.log(res.msg);
            }
            _this.isLoading=false;
          })
          .catch(function (response) {
            // console.log(error);
            console.log(response.message);
          })
      },
      getGrade() {
        if (this.check.gpa != 0) {
          return
        }
        this.isLoading=true;        
        let _this = this;
        let url = "http://120.26.53.243:6627/gpa";
        axios.post(url, qs.stringify(this.params))
          .then(function (response) {
            let res = response.data;
            if (res.status) {
              _this.isLogin = true;              
              _this.grade = gradeObj.cal([res.data])[0];
              _this.check.gpa = 1;
            } else {
              _this.errorLog = true;
              _this.errorText = res.msg;
              console.log(res.msg);
            }
            _this.isLoading=false;
          })
          .catch(function (response) {
            _this.errorLog = true;
            _this.errorText = response.message;
            console.log(response.message);
          })
      
      },

      //计算成绩/绩点
      calculation() {
        let all = {
          gpa: 0,
          credit: 0,
          grade: 0,
          count: 0
        }
        if (this.activeTab == 0) {
          all = this.calCount(this.grade, all)
        } else if (this.activeTab == 1) {
          for (let i = 0; i < this.gradeAll.length; i++) {
            all = this.calCount(this.gradeAll[i], all);
          }
          for (let i = 0; i < this.notPass.length; i++) {
            all = this.calCount(this.notPass[i], all);
          }
        }else if (this.activeTab == 2) {
          for (let i = 0; i < this.notPass.length; i++) {
            all = this.calCount(this.notPass[i], all);
          }
        }

        this.avg = all;
        this.avg.gpa = (all.gpa / all.credit).toFixed(3);
        this.avg.grade = (all.grade / all.credit).toFixed(3);

        this.dialogCal = true;
        console.log(this.avg);
      },

      //计算统计（计算前统计总分）
      calCount(arr, all) {
        arr.grades.map((item, index) => {
          if (item && item.selected) {
            all.gpa += item.gpa * item.credit;
            all.credit += item.credit;
            all.grade += item.gradeCal * item.credit;;
            all.count++;
          }
        })
        return all;
      },

      //选择所有课程（不包含不及格）
      chooseAll() {
        if (this.activeTab == 0) {
          this.grade.grades = this.grade.grades.map((item, index) => {
            item.selected = true
            return item
          })
        } else if (this.activeTab == 1) {
          for (let i = 0; i < this.gradeAll.length; i++) {
            this.gradeAll[i].grades = this.gradeAll[i].grades.map((item, index) => {
              item.selected = true
              return item
            })
          }
        }
      },

      //选择所有的必修课程（不包含不及格课程）
      chooseRequire() {
        if (this.activeTab == 0) {
          this.grade.grades = this.grade.grades.map((item, index) => {
            if (item && item.course_type && item.course_type == "必修") {
              item.selected = true
            } else {
              item.selected = false
            }
            return item
          })
        } else if (this.activeTab == 1) {
          for (let i = 0; i < this.gradeAll.length; i++) {
            this.gradeAll[i].grades = this.gradeAll[i].grades.map((item, index) => {
              if (item && item.course_type && item.course_type == "必修") {
                item.selected = true
              } else {
                item.selected = false
              }
              return item
            })
          }
        }

      },

      //清除所有已选项
      clear() {
        this.grade.grades = this.grade.grades.map((item, index) => {
          item.selected = false
          return item
        })

        if (this.check.notPass) {
          for (let i = 0; i < this.gradeAll.length; i++) {
            this.gradeAll[i].grades = this.gradeAll[i].grades.map((item, index) => {
              item.selected = false
              return item
            })
          }
          for (let i = 0; i < this.notPass.length; i++) {
            this.notPass[i].grades = this.notPass[i].grades.map((item, index) => {
              item.selected = false
              return item
            })
          }
        }

      }
    },
    data() {
      return {
        valid: {
          uid: '',
          password: ''
        },
        isLoading: false,
        isLogin: false,
        bottomData: 'cal',
        activeTab: "0",
        gradeAll: {},
        grade: gradeTest,
        dialogCal: false,
        errorText: "",
        errorLog: false,
        notPass: [
          gradeTest,
          gradeTest
        ],
        check: {
          gpa: 0,
          gpaAll: 0,
          notPass: 0
        },
        params: {
        },
        avg: {
          gpa: 0,
          credit: 0,
          grade: 0,
          count: 0
        }
      }
    },
    mounted() {
    }
  }

</script>

<style lang="less">

</style>