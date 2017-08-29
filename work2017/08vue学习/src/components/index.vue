<template>
  <div class="index">
    <p>
      {{title}}
    </p>
  </div>
</template>
<script type="text/javascript">
export default {
  name: 'index',
  data() {
    return {
      title: '首页部分'
    }
  }
}

</script>
<style type="text/css" scoped>
p {
  font-size: 20px;
  text-align: center;
  color:red;
}

</style>
