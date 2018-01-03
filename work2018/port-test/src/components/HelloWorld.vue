<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>
<script>
import axios from 'axios'
var CryptoJS = require("crypto-js")

export default {
  name: 'HelloWorld',
  data() {
    return {
      msg: '接口测试1'
    }
  },
  created() {
    function encryptByDES(message, key) {
      var keyHex = CryptoJS.enc.Utf8.parse(key);
      var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
      console.log(encrypted.toString());
      return encrypted.toString();
    }

    axios({
      url: 'act/rule/JS0001DS001?name=authentication',
      method: 'post',
      data: {
        keyStr: encryptByDES('oGFdHwIFhUhp6QZ-HhpuIGWR6YecMJ2v815nUPsUo1YLro1rMubY4v', 'yanzhengyonghu')
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





    axios({
      url: '/act/rule/JS0001DS001?name=redpack_redouble',
      method: 'post',
      data: {
        openid: '123',
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
