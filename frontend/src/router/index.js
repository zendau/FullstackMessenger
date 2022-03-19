import { createRouter, createWebHistory } from 'vue-router'

import theChat from "../components/theChat.vue"
import theLogin from "../components/theLogin"

import test from '../components/test.vue'

import createRoom from '../views/createRoom.vue'

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
  {
    path: '/test',
    name: 'Test',
    component: test
  },
  {
    path: '/room/create',
    name: 'createRoom',
    component: createRoom
  }
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
