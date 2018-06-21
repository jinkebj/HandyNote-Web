import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Layout from '@/components/Layout'
import NoteDetail from '@/components/NoteDetail'

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
      path: '/notes/:id',
      component: NoteDetail,
      props: true
    },
    {
      path: '*',
      redirect: '/dashboard'
    }
  ]
})
