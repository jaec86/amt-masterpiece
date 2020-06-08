import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    meta: { order: 0 },
    component: Home
  },
  {
    path: '/shader',
    name: 'Shader',
    meta: { order: 1 },
    component: () => import(/* webpackChunkName: "shader" */ '../views/Shader.vue')
  },
  {
    path: '/halftone',
    name: 'Halftone',
    meta: { order: 2 },
    component: () => import(/* webpackChunkName: "halftone" */ '../views/Halftone.vue')
  },
  {
    path: '/noise',
    name: 'Noise',
    meta: { order: 3 },
    component: () => import(/* webpackChunkName: "noise" */ '../views/Noise.vue')
  },
  {
    path: '/sound',
    name: 'Sound',
    meta: { order: 4 },
    component: () => import(/* webpackChunkName: "sound" */ '../views/Sound.vue')
  },
  {
    path: '/demo',
    name: 'Demo',
    meta: { order: 5 },
    component: () => import(/* webpackChunkName: "demo" */ '../views/Demo.vue')
  },
  {
    path: '*',
    name: 'NotFound',
    meta: { order: 6 },
    component: () => import(/* webpackChunkName: "demo" */ '../views/NotFound.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  let side = to.meta.order >= from.meta.order ? 'left': 'right'
  store.dispatch('moveOverlay', side)
  next()
})

export default router
