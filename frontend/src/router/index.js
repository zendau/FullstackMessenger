import { createRouter, createWebHistory } from 'vue-router'

import theChat from "../components/theChat.vue"
import theLogin from "../components/theLogin"

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: theLogin,
    alias: "/"
  },
  {
    path: '/chat',
    name: 'Chat',
    component: theChat,
  },
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
