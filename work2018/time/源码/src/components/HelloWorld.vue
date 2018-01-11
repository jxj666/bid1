<template>
  <div class="hello">
    <div class="sleect">
      年份:
      <select @change='count' v-model="year">
        <option v-for="x in years" :value="x">{{x}}</option>
      </select>
      周数:
      <select v-model="week" >
        <option v-for="y in weeks" :value="y.text">{{`第${y.i+1}周 ${y.text_min}`}}</option>
      </select>
    </div>
    <br>
    <div class="info">
       起始周周日
    </div>
    <br>
    <div class="week_day">
      时间段:{{week}}
    </div>
  </div>
</template>
<script>
var moment = require('moment')

export default {
  name: 'HelloWorld',
  data() {
    return {
      year: '',
      week:'',
      years: [2015,2016,2017,2018,2019],
      weeks: [],
      one_day_num: 86400000,
    }
  },
  methods: {
    count() {
      if (!this.year) { return }
      var first_day = moment(`${this.year}-01-01 00:00:00`)
      //取首周(周日为一周开始)
      var first_weeks = first_day.day()
      var fix_day = moment(`${this.year}-01-01 00:00:00`).subtract(first_weeks, 'd')
      this.weeks = []
      for (var i = 0; i < 54; i++) {
       var fix_day1_name_min = fix_day.format("YYYY/MM/DD")
        var fix_day1_name = fix_day.format("YYYY/MM/DD,HH:mm:ss,SSS")
        fix_day = fix_day.add(1, 'w')
        fix_day=fix_day.subtract(1, 'ms')
       var fix_day2_name_min = fix_day.format("YYYY/MM/DD")
       var fix_day2_name = fix_day.format("YYYY/MM/DD,HH:mm:ss,SSS")
        fix_day = fix_day.add(1, 'ms')
        var obj = {
          start_name: fix_day1_name,
          stop_name: fix_day2_name,
          text_min:`${fix_day1_name_min} - ${fix_day2_name_min}`,
          text:`${fix_day1_name} - ${fix_day2_name}`,
          i: i,
        }
        if (fix_day1_name.split('/')[0] > this.year) {
          return
        }
        this.weeks.push(obj)
      }
    },
    count2(){

    }
  },

}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

</style>
