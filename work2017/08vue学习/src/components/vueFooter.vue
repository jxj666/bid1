<template>
  <div class="vue-footer">
    <p>
      {{title}}
    </p>
    <p>
      {{logo}}
    </p>
    <button @click='goIndex'>主页</button>
    <input type="text" v-model='writer' @change='setWriter'>
  </div>
</template>
<script type="text/javascript">
export default {
  name: 'vueFooter',
  data() {
    return {
      title: '尾部',
      writer: 'jxj'
    }
  },
  props: ['logo'],
  methods: {
    goIndex: function() {
      this.$router.push({ path: '/' })
    },
    setWriter: function() {
      this.$store.commit('newAuthor', this.writer)
    }
  }
}

</script>
<style type="text/css" scoped>
p {
  font-size: 20px;
  text-align: center;
}

</style>
