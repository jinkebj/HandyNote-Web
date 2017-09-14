import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Layout from '@/components/Layout'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/dashboard',
      component: Layout
    },
    {
      path: '*',
      redirect: '/dashboard'
    }
  ]
})
