<template>
  <div id="app">
    <vue-header :logo='logo_data' @transferUser='getUser'></vue-header>
    <img src="./assets/logo.png">
    <h1>{{logo_data}}</h1>
    <p>{{user}}</p>
    <router-view></router-view>
    <vue-footer :logo='logo_data'></vue-footer>
  </div>
</template>
<script>
import vueHeader from './components/vueHeader'
import vueFooter from './components/vueFooter'
export default {
  name: 'app',
  components: {
    vueHeader,
    vueFooter
  },
  data() {
    return {
      logo_data: 'jxj',
      user: 'ks'
    }
  },
  methods: {
    getUser(msg) {
      this.user = msg
    }
  }
}

</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

</style>
