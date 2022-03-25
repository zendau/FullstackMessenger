import { createRouter, createWebHistory } from 'vue-router'

import createRoom from '../views/Room/createRoom.vue'
import AllRooms from '../views/Room/AllRooms.vue'
import audioRoom from '../views/Room/audioRoom'
import roomGateway from '../views/Room/RoomGateway.vue'

import pageNotFound from '../views/404.vue'

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
