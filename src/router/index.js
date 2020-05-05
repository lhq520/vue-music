import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Hot from '../views/Hot.vue'
import Playlist from '../views/Playlist.vue'
import Search from '../views/Search.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  // {
  //   path: '/hot',
  //   name: 'hot',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/Hot.vue')
  // },
  {
    path:'/hot',
    name:'hot',
    component:Hot
  },
  {
    path:'/search',
    name:'search',
    component:Search
  },

  {
    path:'/playlist',
    name:'playlist',
    component:Playlist,
    meta:{requiresAuth:true}
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router
