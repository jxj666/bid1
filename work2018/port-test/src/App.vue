<template>
  <div id="app">
    <router-view/>
    <test v-bind='msg' />
    <div class="btns">
      <experiment :num-counter='num1'/>
      <experiment :num-counter='num2'/>
      <experiment :num-counter='num3'/>
    </div>
  </div>
</template>
<script>
import Test from '@/components/Test'
import Experiment from '@/components/Experiment'
export default {
  name: 'app',
  data() {
    return {
      num: 1,
      msg: { title: 'success', content: 'good job' },
      num1: 1,
      num2: 2,
      num3: 3,
    }
  },
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
