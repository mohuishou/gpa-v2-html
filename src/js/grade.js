let grade = {};

const GRADE_GPA_OLD = [
  [60, 0], //0-60[不包括60]
  [61, 1], //60-61[不包括61]
  [63, 1.3],
  [66, 1.7],
  [70, 2],
  [73, 2.3],
  [76, 2.7],
  [80, 3],
  [85, 3.3],
  [90, 3.7],
  [101, 4]
]

//分数绩点对照表
const GRADE_GPA = [
  [60, 0], //0-60[不包括60]
  [61, 1], //60-61[不包括61]
  [63, 1.3],
  [66, 1.7],
  [70, 2],
  [73, 2.3],
  [76, 2.7],
  [80, 3],
  [85, 3.3],
  [90, 3.7],
  [101, 4]
]

grade.cal = function (data) {
  let grade = [];

  for (let k = 0; k < data.length; k++) {
    if (!data[k]) {
      continue;
    }
    let sum = {
      all: {
        grade: 0,
        credit: 0,
        gpa: 0
      },
      required: {
        grade: 0,
        credit: 0,
        gpa: 0
      }

    };
    let avg = {
      all: {
        grade: 0,
        gpa: 0
      },
      required: {
        grade: 0,
        gpa: 0
      }

    };
    let t = [];
    for (let i = 0; i < data[k].length; i++) {
      let d = data[k][i];
      if (!d.course_id) {
        continue;
      }
      d.selected = false;
      d.gradeCal = lv2grade(d.grade);
      d.gpa = grade2gpa(d.gradeCal);
      d.credit = parseFloat(d.credit);
      t.push(d);

      if (d.grade.trim() === "") {
        continue
      }
      if (d.course_type == "必修") {
        sum.required.grade += d.gradeCal * d.credit;
        sum.required.credit += d.credit;
        sum.required.gpa += d.gpa * d.credit;
      }
      sum.all.grade += d.gradeCal * d.credit;
      sum.all.credit += d.credit;
      sum.all.gpa += d.gpa * d.credit;
    }
    if (t[0]) {
      //计算平均分保留两位小数
      avg.all.gpa = (sum.all.gpa / sum.all.credit).toFixed(3);
      avg.all.grade = (sum.all.grade / sum.all.credit).toFixed(3);

      avg.required.gpa = (sum.required.gpa / sum.required.credit).toFixed(3);
      avg.required.grade = (sum.required.grade / sum.required.credit).toFixed(3);
    }

    grade[k] = {}
    grade[k].avg = avg;
    grade[k].sum = sum;
    grade[k].grades = t;

  }

  return grade;
}
//分数绩点转换
function grade2gpa(grade) {
  let gpa = 0;
  let prev = 0;
  for(let i=0;i<GRADE_GPA.length;i++){
    if (grade >= prev && grade < GRADE_GPA[i][0]) {
      gpa = GRADE_GPA[i][1]
    }
    prev = GRADE_GPA[i][0]
  }
  return gpa;
}

function trimStr(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}
//等级转换分数
function lv2grade(g) {
  g = trimStr(g);
  if (!isNaN(g)) {
    return g;
  }
  switch (g) {
    case "优秀":
      g = 100;
      break;
    case "良好":
      g = 84;
      break;
    case "中等":
      g = 75;
      break;
    case "合格":
    case "通过":
    case "及格":
      g = 69;
      break;
    case "未通过":
    case "不及格":
      g = 0;
      break;
  }
  return g;
}

module.exports = grade;
