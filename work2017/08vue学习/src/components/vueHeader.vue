<template>
  <div class="vue-header">
    <ul>
      <li v-for='nav in navs'>
        <router-link :to='nav.url'>{{nav.text}}</router-link>
      </li>
    </ul>
    <h6>{{author}}</h6>
    <p>
      {{title}}
    </p>
    <p>
      {{logo}}
    </p>
    <input type="num" name="sy" v-model='username' @change='setUser'>
  </div>
</template>
<script type="text/javascript">
export default {
  name: 'vueHeader',
  data() {
    return {
      title: '头部',
      username: '123',
      navs: [{ url: '/hello/child', text: 'hello' }, { url: '/main', text: 'main' }, { url: '/', text: 'index' }]
    }
  },
  props: ['logo'],
  methods: {
    setUser: function() {
      this.$emit('transferUser', this.username)
    }
  },
  computed: {
    author() {
      return this.$store.state.author
    }
  }
}

</script>
<style type="text/css" scoped>
p {
  font-size: 18px;
  text-align: center;
}

ul {
  list-style-type: none;
  text-align: center;
  padding: 0;
  margin: 0;
}

a {
  text-decoration: none;
}

</style>
