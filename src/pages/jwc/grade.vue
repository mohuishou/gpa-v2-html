<template>
    <div id="grade">
        <div>
         <mu-tabs class="grade-tabs" :value="activeTab" @change="getGrade">
            <mu-tab value="gpa" title="本学期成绩"/>
            <mu-tab value="gpa/all" title="所有成绩"/>
            <mu-tab value="gpa/not-pass" title="不及格成绩"/>
          </mu-tabs>
        </div>
        <mu-card v-for="grade in grades">
          <mu-card-title v-if="grade.grades[0].term_name" :title="grade.grades[0].term_name" subTitle="@飞扬俱乐部" />
          <mu-card-title v-if="!grade.grades[0].term_name" title="本学期成绩" subTitle="@飞扬俱乐部" />
          <mu-card-text>
          <div class="grade-head">
              <div>
                  <div class="left">必修绩点：<span>{{grade.avg.required.gpa}}</span></div>
                  <div class="right">必修平均分：<span>{{grade.avg.required.grade}}</span></div>
              </div>
              <div>
                  <div class="left">全部绩点：<span>{{grade.avg.all.gpa}}</span></div>
                  <div class="right">全部平均分：<span>{{grade.avg.all.grade}}</span></div>
              </div>
          </div>
           <mu-table class="t-1" @rowSelection="selectedGrade" :enableSelectAll=true :multiSelectable=true >
                <colgroup>
                    <col width="40">
                    <col width="120">
                    <col width="40">
                    <col width="30">
                    <col width="30">
                    <col width="50">
                </colgroup>
             <mu-thead>
               <mu-tr>
                 <mu-th>课程名</mu-th>
                 <mu-th>分数</mu-th>
                 <mu-th>绩点</mu-th>
                 <mu-th>学分</mu-th>
                 <mu-th>属性</mu-th>
               </mu-tr>
             </mu-thead>
             <mu-tbody>
               <mu-tr v-for="g in grade.grades">
                 <mu-td>{{g.course_name}}</mu-td>
                 <mu-td>{{g.grade}}</mu-td>
                 <mu-td>{{g.gpa}}</mu-td>
                 <mu-td>{{g.credit}}</mu-td>
                 <mu-td>{{g.course_type}}</mu-td>
               </mu-tr>
             </mu-tbody>
           </mu-table>
          </mu-card-text>
        </mu-card>

        
         <mu-bottom-nav class="bottom" :value="bottomData" :shift=true @change="handleChange">
          <mu-bottom-nav-item value="movies" title="Movies" icon="ondemand_video"/>
          <mu-bottom-nav-item value="music" title="Music" icon="music_note"/>
          <mu-bottom-nav-item value="books" title="Books" icon="books"/>
          <mu-bottom-nav-item value="pictures" title="Pictures" icon="photo"/>
        </mu-bottom-nav>
    </div>
</template>

<script>
import {tabs,tab} from "muse-components/tabs"
import {card,cardHeader,cardTitle,cardText} from "muse-components/card"
import {table,tr,td,th,tbody,thead} from "muse-components/table"
import {bottomNav,bottomNavItem} from "muse-components/bottomNav"
import axios from 'axios'
import gradeObj from '../../js/grade.js'
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
const qs = require('querystring')
    export default{
        components:{
            "mu-table":table,
            "mu-thead":thead,
            "mu-th":th,
            "mu-tr":tr,
            "mu-td":td,
            "mu-tbody":tbody,
            "mu-bottom-nav":bottomNav,
            "mu-bottom-nav-item":bottomNavItem,
            "mu-card":card,
            "mu-card-header":cardHeader,
            "mu-card-title":cardTitle,
            "mu-card-text":cardText,
            "mu-tabs":tabs,
            "mu-tab":tab
        },
        methods:{
            selectedGrade(data){
                console.log(this)
            },
            handleChange (val) {
              this.bottomData = val
            },
            getGrade(path){
                this.activeTab=path;
                let _this=this;
                let params={
                    "uid":"2014141453066",
                    "password":"lailin123"
                }
                let url="http://120.26.53.243:6627/"+path
                axios.post(url,qs.stringify(params))
                .then(function (response) {
                    let  res=response.data;
                    if(res.status){
                       // _this.grades.shift()
                       let g
                        if(res.data && res.data[0][0]){
                            g=gradeObj.cal(res.data)
                        }else{
                            g=gradeObj.cal([res.data])
                        }
                        console.log(g);
                        _this.grades=g.reverse()
                       
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
            
            }
        },

        data (){
            return{
                bottomData: 'movies',
                activeTab: 'gpa',
                grades:{}
            }
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