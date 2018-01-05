<template>
  <div id="test">
    <p>{{title}}</p>
    <p>{{content}}</p>
  </div>
</template>
<script type="text/javascript">
export default {
  name: 'Test',
  props: {
    'title': {
      type: String,
      required: true,
    },
    'content': {
      type: [String, Number],
      default: '默认',
    }
  },
  data() {
    return {

    }
  }
}

</script>
<style scoped>
p {
  color: red;
}

</style>
