import Vue from 'vue'
import Router from 'vue-router'
import Hello from '../components/Hello'
import index from '../components/index'
import main from '../components/main'
import child from '../components/child'


Vue.use(Router)


const routers = [{
  path: '/hello',
  name: 'Hello',
  component: Hello,
  children: [{
    path: '/hello/child',
    component: child
  }]
}, {
  path: '/main',
  name: 'main',
  component: main
}, {
  path: '/',
  name: 'index',
  component: index
}]
export default new Router({
  routes: routers
})
