import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ApiMode from '../views/ApiMode.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'TTS',
      component: ApiMode
    },
    {
      path: '/home2',
      name: 'about',
      component: ApiMode
    },
    {
      path: '/home3',
      name: 'bacaBerita',
      component: () => import('../views/BacaBerita.vue')
    }
  ]
})

export default router
