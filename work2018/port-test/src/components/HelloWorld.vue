<template>
  <div class="hello">
    <h1>{{ msg1 }}</h1>
    <input v-model="message1" placeholder="edit me">
    <p>Message is: {{ message1 || '待填写' }}</p>
    <a @click="link1(message1)">开始连接</a>
    <h1>{{ msg2 }}</h1>
    <input v-model="message2" placeholder="edit me">
    <p>Message is: {{ message2 ||'待填写' }}</p>
    <a @click="link2(message2)">开始连接</a>
  </div>
</template>
<script>
import axios from 'axios'
var CryptoJS = require("crypto-js")

export default {
  name: 'HelloWorld',
  data() {
    return {
      msg1: '权限测试',
      msg2: '得分测试',
      message1: '',
      message2: '',
    }
  },
  methods: {
    link1: function(data1) {
      if (!data1) {
        alert('请输入参数!')
        return
      }
      axios({
        url: '/act/rule/JS0001DS001?name=authentication',
        method: 'post',
        data: {
          keyStr: encryptByDES(data1, 'yanzhengyonghu')
        },
        transformRequest: [function(data) {
          // Do whatever you want to transform the data
          let ret = ''
          for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          }
          return ret
        }],
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
    },
    link2: function(data1) {
      if (!data1) {
        alert('请输入参数!')
        return
      }
      axios({
        url: '/act/rule/JS0001DS001?name=redpack_redouble',
        method: 'post',
        data: {
          openid: data1,
          score: '123'
        },
        transformRequest: [function(data) {
          // Do whatever you want to transform the data
          let ret = ''
          for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          }
          return ret
        }],
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
    }
  },
  created() {

  }
}

function encryptByDES(message, key) {
  var keyHex = CryptoJS.enc.Utf8.parse(key)
  var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
    iv: keyHex,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  console.log(encrypted.toString())
  return encrypted.toString()
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
