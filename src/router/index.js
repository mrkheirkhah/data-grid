import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/infiniteScrollView',
      name: 'infiniteScrollView',
      component: () => import('../views/InfiniteScrollView.vue')
    },
    {
      path: '/paginationView',
      name: 'paginationView',
      component: () => import('../views/PaginationView.vue')
    },
  ]
})

export default router
