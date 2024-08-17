import { createWebHistory, createRouter } from 'vue-router'
import Home from '../views/Home.vue'
import Relic from '../views/Relic.vue'
import Planar from '../views/Planar.vue'
import Character from '../views/Character.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/relics/:id?',
    name: 'relics',
    component: Relic,
  },
  {
    path: '/planars/:id?',
    name: 'planars',
    component: Planar,
  },
  {
    path: '/characters/:id?',
    name: 'characters',
    component: Character,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
