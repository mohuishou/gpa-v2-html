<template>
  <!-- 不及格成绩 -->
  <mu-card>
    <mu-card-header :title="title">
      <template slot="default">
        <a v-if="grade.grades.length > 0" :download="`${title}.csv`" :href="exportCSV"> 导出CSV </a>
      </template>
    </mu-card-header>
    <mu-card-text>
      <div v-if="isHead" class="grade-head">
        <div>
          <div class="left">必修绩点：
            <span>{{grade.avg.required.gpa}}</span>
          </div>
          <div class="right">必修平均分：
            <span>{{grade.avg.required.grade}}</span>
          </div>
        </div>
        <div>
          <div class="left">全部绩点：
            <span>{{grade.avg.all.gpa}}</span>
          </div>
          <div class="right">全部平均分：
            <span>{{grade.avg.all.grade}}</span>
          </div>
        </div>
      </div>
      <mu-table class="t-1" @rowSelection="handleSelect" :enableSelectAll=true :multiSelectable=true>
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
            <mu-th> 课程名</mu-th>
            <mu-th>分数</mu-th>
            <mu-th>绩点</mu-th>
            <mu-th>学分</mu-th>
            <mu-th>属性</mu-th>
          </mu-tr>
        </mu-thead>
        <mu-tbody>
          <mu-tr v-if="g.course_name" v-for="g in grade.grades" :selected="g.selected">
            <input type="hidden" class="grade" :value="g.gradeCal">
            <input type="hidden" class="credit" :value="g.credit">
            <input type="hidden" class="gpa" :value="g.gpa">
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
</template>

<script>
import { card, cardHeader, cardTitle, cardText } from "muse-components/card"
import { table, tr, td, th, tbody, thead } from "muse-components/table"

const json2csv = require('json2csv');

export default {
  props: {
    grade: {
      default: {
        avg: {
          required: {},
          all: {}
        },
        grades: {}
      }
    },
    isHead: {
      default: true
    },
    title: {
      required: true
    }
  },
  computed: {

    exportCSV() {
      let cvs = json2csv({
        data: this.grade.grades,
        fields: [
          {
            label: "课程号",
            value: "course_id",
            default: 'null'
          },
          {
            label: "课序号",
            value: "lesson_id",
            default: 'null'
          },
          {
            label: "课程名",
            value: "course_name",
            default: 'null'
          },
          {
            label: "属性",
            value: "course_type",
            default: 'null'
          },
          {
            label: "学分",
            value: "credit",
            default: 'null'
          },
          {
            label: "绩点",
            value: "gpa",
            default: 'null'
          },
          {
            label: "成绩",
            value: "grade",
            default: 'null'
          },
          {
            label: "学期",
            value: "term_name",
            default: 'null'
          },
        ]
      })
      let blob = new Blob([cvs], { type: 'text/csv' }); //new way  
      let csvUrl = URL.createObjectURL(blob);
      return csvUrl
    }
  },
  methods: {
    handleSelect(rowIndexs) {
      this.grade.grades = this.grade.grades.map((item, index) => {
        item.selected = rowIndexs.indexOf(index) !== -1
        return item
      })
    }
  },
  components: {
    "mu-table": table,
    "mu-thead": thead,
    "mu-th": th,
    "mu-tr": tr,
    "mu-td": td,
    "mu-tbody": tbody,
    "mu-card": card,
    "mu-card-header": cardHeader,
    "mu-card-title": cardTitle,
    "mu-card-text": cardText
  },
  mounted() {

  }


}

</script>