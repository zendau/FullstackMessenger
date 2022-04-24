import { createRouter, createWebHistory } from 'vue-router'

import createRoom from '../views/Room/createRoom.vue'
import AllRooms from '../views/Room/AllRooms.vue'
import audioRoom from '../views/Room/audioRoom.vue'
import videoRoom from '../views/Room/videoRoom'
import roomGateway from '../views/Room/RoomGateway.vue'

import chatGateway from '../views/Chat/chatGateway.vue'
import chatRoom from '../views/Chat/chatRoom.vue'
import chat from '../views/Chat/chat.vue'

import pageNotFound from '../views/404.vue'

import register from '../views/register.vue'
import login from '../views/login.vue'
import users from '../views/users.vue'

const routes = [
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
        name: 'AllRooms',
        component: AllRooms
      },
      {
        path: 'audio/:id',
        name: 'audioRoom',
        component: audioRoom
      },
      {
        path: 'video/:id',
        name: 'videoRoom',
        component: videoRoom
      },
    ]
  },
  {
    path: '/chat',
    component: chatGateway,
    children: [
      {
        path: '/chat/:id',
        component: chat,
        name: 'chat'
      },
      {
        path: '/chat/all',
        component: chatRoom,
        name: 'chatRoom'
      },
     
    ]
  },
  {
    path: '/register',
    component: register,
    name: 'register',
  },
  {
    path: '/login',
    component: login,
    name: 'login',
  },
  {
    path: '/users',
    component: users,
    name: 'users',
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
