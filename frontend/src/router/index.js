import { createRouter, createWebHistory } from 'vue-router'

import theChat from "../components/theChat.vue"
import theLogin from "../components/theLogin"

import test from '../components/test.vue'

import createRoom from '../views/createRoom.vue'
import allRooms from '../views/allRooms.vue'
import audioRoom from '../views/audioRoom'
import roomGateway from '../views/Room/RoomGateway.vue'

import pageNotFound from '../views/404.vue'

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
    path: '/room',
    component: roomGateway,
    children: [
      {
        path: 'create',
        name: 'createRoom',
        component: createRoom
      },
      {
        path: 'all',
        name: 'allRooms',
        component: allRooms
      },
      {
        path: ':id',
        name: 'audioRoom',
        component: audioRoom
      },
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    component: pageNotFound
  }
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
