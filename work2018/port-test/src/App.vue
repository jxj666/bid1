<template>
  <div id="app">
    <router-view/>
    <test/>
    <div class="btns">
      <experiment/>
      <experiment/>
      <experiment/>
    </div>
  </div>
</template>
<script>
import Test from '@/components/Test'
import Experiment from '@/components/Experiment'
export default {
  name: 'app',
  components: {
    'test': Test,
    'experiment': Experiment,
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
