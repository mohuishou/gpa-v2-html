<template>
    <div>
        <div id="login">
            
        </div>
        <div id="grade">
            <div>
             <mu-tabs class="grade-tabs" :value="activeTab" @change="switchTab">
                <mu-tab value="0" title="本学期成绩"/>
                <mu-tab value="1" title="所有成绩" @click="getGradeAll"/>
                <mu-tab value="2" title="不及格成绩" @click="getNotPass"/>
              </mu-tabs>
            </div>
            
            <my-grade v-show="activeTab==0" :isHead=true :grade="grade" title="本学期成绩" ></my-grade>

            <my-grade v-show="activeTab==1" :isHead=true :grade="grade" :title="grade.grades[0].term_name"  v-for="grade in gradeAll" ></my-grade>

            <my-grade v-show="activeTab!=0" :isHead=false :grade="notPass[0]" title="尚不及格" ></my-grade>

            <my-grade v-show="activeTab!=0" :isHead=false :grade="notPass[1]" title="曾不及格" ></my-grade>

            
             <mu-bottom-nav class="bottom" :value="bottomData" :shift=true @change="handleChange">
              <mu-bottom-nav-item value="movies" title="计算" @click.native="calculation" icon="assignment_turned_in"/>
              <mu-bottom-nav-item value="music" title="必修" @click.native="chooseRequire"  icon="class"/>
              <mu-bottom-nav-item value="books" title="全选" @click.native="chooseAll" icon="select_all"/>
              <mu-bottom-nav-item value="pictures" title="清空" @click.native="clear" icon="delete_forever"/>
            </mu-bottom-nav>
        </div>
    </div>
    
</template>
<script>
import {tabs,tab} from "muse-components/tabs"
import {bottomNav,bottomNavItem} from "muse-components/bottomNav"
import gradeItem from "../../components/grade-item.vue"
import axios from 'axios'
import gradeObj from '../../js/grade.js'
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
const qs = require('querystring')
let test={
  avg:{
    required:{},
    all:{}
  },
  grades:{}
}
    export default{
        components:{
            "mu-bottom-nav":bottomNav,
            "mu-bottom-nav-item":bottomNavItem,
            "mu-tabs":tabs,
            "mu-tab":tab,
            "my-grade":gradeItem
        },
        methods:{
            selectedGrade(data,e){
                console.log(e);
                console.log(data)
            },
            handleChange (val) {
              this.bottomData = val
            },
            switchTab(val){
                this.activeTab=val;
            },
            getGradeAll(){
                if(this.check.gpaAll!=0){
                    return
                }
                let _this=this;
                let url="http://120.26.53.243:6627/gpa/all"
                axios.post(url,qs.stringify(this.params))
                .then(function (response) {
                    let  res=response.data;
                    if(res.status){
                       let g=gradeObj.cal(res.data);
                        _this.gradeAll=g.reverse();
                        _this.check.gpaAll=1;
                        _this.getNotPass()
                    }else{
                        console.log(res.msg);
                    }
                })
                .catch(function (response) {
                  // console.log(error);
                  console.log(response.message);
                });
            },
            getNotPass(){
                if(this.check.notPass!=0){
                    return
                }
                let _this=this;
                let url="http://120.26.53.243:6627/gpa/not-pass";
                axios.post(url,qs.stringify(this.params))
                .then(function (response) {
                    let  res=response.data;
                    if(res.status){
                        _this.notPass=gradeObj.cal(res.data);
                        _this.check.notPass=1;
                    }else{
                        console.log(res.msg);
                    }
                })
                .catch(function (response) {
                  // console.log(error);
                  console.log(response.message);
                });
            },
            getGrade(){
                if(this.check.gpa!=0){
                    return
                }
                let _this=this;
                let url="http://120.26.53.243:6627/gpa";
                axios.post(url,qs.stringify(this.params))
                .then(function (response) {
                    let  res=response.data;
                    if(res.status){
                        _this.grade=gradeObj.cal([res.data])[0];
                        console.log(res.data);
                        _this.check.gpa=1;
                    }else{
                        console.log(res.msg);
                    }
                })
                .catch(function (response) {
                  // console.log(error);
                  console.log(response.message);
                });
            },
            calculation(){
                
                let all={
                    gpa:0,
                    credit:0,
                    grade:0,
                    count:0
                }
                if(this.activeTab==0){
                    all=this.calCount(this.grade,all)
                }else if (this.activeTab==1) {
                    for (let i=0; i < this.gradeAll.length; i++) {
                        all=this.calCount(this.gradeAll[i],all);
                    }
                    for (let i=0; i < this.notPass.length; i++) {
                        all=this.calCount(this.notPass[i],all);
                    }

                }
                
                this.avg=all;
                this.avg.gpa=(all.gpa/all.credit).toFixed(3);
                this.avg.grade=(all.grade/all.credit).toFixed(3);
                console.log(this.avg);
            },
            calCount(arr,all){
                arr.grades.map((item,index) => {
                    if(item && item.selected){
                        all.gpa+=item.gpa*item.credit;
                        all.credit+=item.credit;
                        all.grade+=item.gradeCal*item.credit;;
                        all.count++;
                    }
                })
                return all;
            },
            chooseAll(){
                if(this.activeTab==0){
                    this.grade.grades=this.grade.grades.map((item,index) => {
                            item.selected=true
                        return item
                    })
                }else if(this.activeTab==1){
                    for (let i=0; i < this.gradeAll.length; i++) {
                        this.gradeAll[i].grades=this.gradeAll[i].grades.map((item,index) => {
                            item.selected=true
                        return item
                    })
                    }
                }
            },
            chooseRequire(){
                if(this.activeTab==0){
                    this.grade.grades=this.grade.grades.map((item,index) => {
                        if(item && item.course_type && item.course_type=="必修"){
                            item.selected=true
                        }else{
                            item.selected=false
                        }
                        return item
                    })
                }else if(this.activeTab==1){
                    for (let i=0; i < this.gradeAll.length; i++) {
                        this.gradeAll[i].grades=this.gradeAll[i].grades.map((item,index) => {
                        if(item && item.course_type && item.course_type=="必修"){
                            item.selected=true
                        }else{
                            item.selected=false
                        }
                        return item
                    })
                    }
                }
                
            },
            clear(){
                this.grade.grades=this.grade.grades.map((item,index) => {
                        item.selected=false
                    return item
                })
                for (let i=0; i < this.gradeAll.length; i++) {
                    this.gradeAll[i].grades=this.gradeAll[i].grades.map((item,index) => {
                        item.selected=false
                        return item
                    })
                }
                for (let i=0; i < this.notPass.length; i++) {
                    this.notPass[i].grades=this.notPass[i].grades.map((item,index) => {
                        item.selected=false
                        return item
                    })
                }
            }
        },
        data (){
            return{
                bottomData: 'movies',
                activeTab: "0",
                gradeAll:{},
                grade:test,
                notPass:[
                    test,
                    test
                ],
                check:{
                    gpa:0,
                    gpaAll:0,
                    notPass:0
                },
                params:{
                    "uid":"2014141463233",
                    "password":"091925"
                },
                avg:{
                    gpa:0,
                    credit:0,
                    grade:0,
                    count:0
                }
            }
        },
        mounted(){
            this.getGrade()
        }
    }
</script>

<style lang="less">
    #grade{
        .grade-tabs {
            background-color: transparent;
            color: rgba(0,0,0,0.87);
        }
        .mu-tab-link-highlight{
            background: #03a9f4;
        }
        .grade-tabs .mu-tab-link {
            color: rgba(0,0,0,0.54);
        }
        .grade-tabs .mu-tab-active {
            color: #03a9f4;
        }
        .mu-card{
            margin-top: 10px;
            margin-bottom: 20px;
        }
        .mu-card-title-container{
            text-align: center;
            background: #03a9f4;
        }
        .mu-card-title-container *{
            color: #fff;

        }
        .mu-card-text{
            padding: 0;
        }
        .grade-head{
            color: #333;
            font-weight: bold;
            background: #03a9f4;
            color: #fff;
        }
        .grade-head>div{
            height: 30px;
        }
        .grade-head>div>div{
            width: 50%;
            text-align: center;
        }
        .left{
            float: left;
        }
        .right{
            float: right;
        }
        h1{
            text-align: center;
        }
        .bottom{
            // padding-left:256px;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;

        }

        td,th{
                white-space:normal;
                padding-left: 0;
                padding-right: 0;
                text-align: center;
        }
    }
</style>