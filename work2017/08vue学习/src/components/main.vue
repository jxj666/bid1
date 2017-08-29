<template>
  <div class="main">
    <p>
      {{title}}
    </p>
  </div>
</template>
<script type="text/javascript">
export default {
  name: 'main',
  data() {
    return {
      title: '主页部分'
    }
  }
}

</script>
<style type="text/css" scoped>
p {
  font-size: 20px;
  text-align: center;
  color: green;
}

</style>
