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

import { Role } from './roles'

import store from '../store/index'

const routes = [
  {
    path: '/room',
    component: roomGateway,
    children: [
      {
        path: 'create',
        name: 'createRoom',
        component: createRoom,
        meta: {
          requiresAuth: true,
          role: Role.User
        }
      },
      {
        path: 'all',
        name: 'AllRooms',
        component: AllRooms,
        meta: {
          requiresAuth: true,
          role: Role.User
        }
      },
      {
        path: 'audio/:id',
        name: 'audioRoom',
        component: audioRoom,
        meta: {
          requiresAuth: true,
          role: Role.User
        }
      },
      {
        path: 'video/:id',
        name: 'videoRoom',
        component: videoRoom,
        meta: {
          requiresAuth: true,
          role: Role.User
        }
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
        name: 'chat',
        meta: {
          requiresAuth: true,
          role: Role.User
        }
      },
      {
        path: '/chat/all',
        component: chatRoom,
        name: 'chatRoom',
        meta: {
          requiresAuth: true,
          role: Role.User
        }
      },
     
    ]
  },
  {
    path: '/register',
    component: register,
    name: 'register',
    meta: {
      requiresAuth: false,
      role: Role.noAuth
    }
  },
  {
    path: '/login',
    component: login,
    name: 'login',
    meta: {
      requiresAuth: false,
      role: Role.noAuth
    }
  },
  {
    path: '/users',
    component: users,
    name: 'users',
    meta: {
      requiresAuth: true,
      role: Role.User
    }
  },
  {
    path: '/:pathMatch(.*)*',
    component: pageNotFound,
    meta: {
      requiresAuth: false,
      role: Role.noAuth
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})


router.beforeEach((to, from, next) => {

  debugger
  const authStatus = store.getters['auth/getAuthStatus']
  const userRole = store.getters['auth/getRoleAcessLevel']
  console.log(authStatus, userRole)

  if (to.meta.requiresAuth) {
    if (authStatus) {
      next()
    }
    else {
      next('/login')
    }
  } else {
    if (authStatus) {
      next('/users')
    }
    else {
      next()
    }
  }

  // if (to.path === "/") {
  //   if (userStatus) {
  //     next("/requests")
  //   } else {
  //     next()
  //   }
  // } else {
  //   if (to.meta.login && userStatus) {
  //     next()
  //   } else {
  //     next({
  //       path: "/",
  //       query: {
  //         error: "noAuth"
  //       }
  //     })
  //   }
  // }

})

export default router
