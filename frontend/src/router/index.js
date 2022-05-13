import { createRouter, createWebHistory } from 'vue-router'

import createRoom from '../views/Room/createRoom.vue'
import AllRooms from '../views/Room/AllRooms.vue'
import audioRoom from '../views/Room/audioRoom.vue'
import videoRoom from '../views/Room/videoRoom'
import roomGateway from '../views/Room/RoomGateway.vue'

// import chatGateway from '../views/Chat/chatGateway.vue'
// import chatRoom from '../views/Chat/chatRoom.vue'
//import chat from '../views/Chat/chat.vue'
import chatTest from '../views/Chat/chatTest.vue'

import pageNotFound from '../views/404.vue'

import register from '../views/Auth/register.vue'
import login from '../views/Auth/login.vue'
import forgot from '../views/Auth/forgot.vue'

import user from '../views/user.vue'

import createConference from '../views/createConference.vue'

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
    path: '/chat/:id?',
    component: chatTest,
    name: 'chat',
    meta: {
      requiresAuth: true,
      role: Role.User
    }
    // children: [
    //   {
    //     path: '/chat/:id',
    //     component: chat,
    //     name: 'chat',
        
    //   },
    //   {
    //     path: '/chat/all',
    //     component: chatRoom,
    //     name: 'chatRoom',
    //     meta: {
    //       requiresAuth: true,
    //       role: Role.User
    //     }
    //   },
     
    // ]
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
    path: '/user',
    component: user,
    name: 'user',
    meta: {
      requiresAuth: true,
      role: Role.User
    }
  },
  {
    path: '/create',
    component: createConference,
    name: 'createConference',
    meta: {
      requiresAuth: true,
      role: Role.User
    }
  },
  {
    path: '/forgot',
    component: forgot,
    name: 'forgot',
    meta: {
      requiresAuth: false,
      role: Role.noAuth
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

  const noAuthRedicect = process.env.VUE_APP_ROUTER_REDIRECT_NO_AUTH_PATH
  const wrongRoleRedicect = process.env.VUE_APP_ROUTER_REDIRECT_WRONG_ROLE_PATH
  const startAuthPage = process.env.VUE_APP_ROUTER_START_AUTH_PAGE_PATH

  const authStatus = store.getters['auth/getAuthStatus']
  const userRole = store.getters['auth/getRoleAcessLevel']

  if (to.meta.requiresAuth) {
    if (authStatus) {
      if (to.meta.role <= userRole) {
        next()
      } else {
        next(wrongRoleRedicect)
      }
    }
    else {
      next(noAuthRedicect)
    }
  } else {
    if (authStatus) {
      next(startAuthPage)
    }
    else {
      next()
    }
  }
})

export default router
