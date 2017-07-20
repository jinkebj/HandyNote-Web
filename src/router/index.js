import Vue from 'vue'
import Router from 'vue-router'
import NoteDetail from '@/components/NoteDetail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/notes/:id',
      name: 'NoteDetail',
      component: NoteDetail
    }
  ]
})
