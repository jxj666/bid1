<template>
  <button v-on:click="number += 1">{{ number }}</button>
</template>
<script type="text/javascript">
export default {
  name: 'Experiment',
  props: {
    numCounter: { type: Number, required: true },
  },
  data() {
    return {
      number: this.numCounter,
    }
  }
}

</script>
<style scoped>
p {
  color: blue;
}

</style>
