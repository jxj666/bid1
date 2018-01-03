<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>
<script>
import axios from 'axios'
import { Base64 } from 'js-base64'

export default {
  name: 'HelloWorld',
  data() {
    return {
      msg: '接口测试1'
    }
  },
  created() {
    axios({
        method: 'post',
        url: 'https://testweiop.chengjuiot.com/act/rule/JS0001DS001?name=authentication ',
        data: {
          keyStr: Base64.encode('123456789')
        }
      })
      .then(function(response) {
        console.log(response)
      })
  }
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
