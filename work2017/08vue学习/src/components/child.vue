<template>
  <div class="child">
    <p>
      {{title}}
    </p>
  </div>
</template>
<script type="text/javascript">
export default {
  name: 'child',
  data() {
    return {
      title: '细节与内容!'
    }
  }
}

</script>
<style type="text/css" scoped>
p {
  font-size: 20px;
  text-align: center;
  color: yellow;
}

</style>
