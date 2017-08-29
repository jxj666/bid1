<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>进阶</h2>
    <router-view></router-view>
    <ul>
      <li v-for='item in list'>
        <a href="javascript:void(0)">
      {{item.name}}
        </a>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'hello',
  data() {
    return {
      msg: '欢迎进入 vue 学习页',
      list: [{

        name: '脚手架安装'
      }, {

        name: '单页面组件'
      }, {
        name: '数据通信'
      }, {

        name: '多重路由'
      }, {
        name: '状态管理'
      }]
    }
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
