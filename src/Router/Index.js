import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../Views/HomePage.vue'
import VaultPage from '../Views/VaultPage.vue'
import FindPage from '../Views/FindPage.vue'
import ResultPage from '../Views/ResultPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/vault',
    name: 'vault',
    component: VaultPage,
  },
  {
    path: '/find',
    name: 'find',
    component: FindPage,
  },
  {
    path: '/result',
    name: 'result',
    component: ResultPage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
