<template>
  <button v-on:click="counter += 1">{{ counter }}</button>
</template>
<script type="text/javascript">
export default {
  name: 'Experiment',
  data() {
    return {
      counter: 0,
    }
  }
}

</script>
<style scoped>
p {
  color: blue;
}

</style>
