import { createRouter, createWebHistory } from 'vue-router'

// import createRoom from '../views/Room/createRoom.vue'
// import AllRooms from '../views/Room/AllRooms.vue'
// import roomGateway from '../views/Room/RoomGateway.vue'
const conferences = () => import('../views/conference/conferences.vue')

// import chatGateway from '../views/Chat/chatGateway.vue'
// import chatRoom from '../views/Chat/chatRoom.vue'
//import chat from '../views/Chat/chat.vue'
import chatTest from '../views/Chat/chatTest.vue'

import pageNotFound from '../views/404.vue'

import register from '../views/Auth/register.vue'
import login from '../views/Auth/login.vue'
import forgot from '../views/Auth/forgot.vue'

const user = () => import('../views/user.vue')

import createConference from '../views/conference/createConference.vue'
import editConference from '../views/conference/editConference.vue'

import { Role } from './roles'
import { Layout } from './layouts'

import store from '../store/index'

import conference from '../layout/auth.conferecnce.vue'
import audioConference from '../views/conference/audioConference.vue'
import videoConference from '../views/conference/videoConference.vue'

const routes = [
  // {
  //   path: '/room',
  //   component: roomGateway,
  //   children: [
  //     {
  //       path: 'create',
  //       name: 'createRoom',
  //       component: createRoom,
  //       meta: {
  //         requiresAuth: true,
  //         role: Role.User,
  //         layout: Layout.Main
  //       }
  //     },
  //     {
  //       path: 'all',
  //       name: 'AllRooms',
  //       component: AllRooms,
  //       meta: {
  //         requiresAuth: true,
  //         role: Role.User,
  //         layout: Layout.Main
  //       }
  //     }
  //   ]
  // },
  {
    path: '/conferences',
    name: 'conferences',
    component: conferences,
    meta: {
      requiresAuth: true,
      role: Role.User,
      layout: Layout.Main
    }
  },
  {
    path: '/conference',
    name: 'conference',
    component: conference,
    children: [
      {
        path: 'audio/:id',
        name: 'audioRoom',
        component: audioConference,
        meta: {
          requiresAuth: true,
          role: Role.User,
          layout: Layout.Main
        }
      },
      {
        path: 'video/:id',
        name: 'videoRoom',
        component: videoConference,
        meta: {
          requiresAuth: true,
          role: Role.User,
          layout: Layout.Main
        }
      }
    ]
  },
  // {

  //   path: '/video/:id',
  //   component: videoConference,
  //   meta: {
  //     requiresAuth: true,
  //     role: Role.User,
  //     layout: Layout.Main
  //   }
  // },
  // {
  //   path: '/audio/:id',
  //   component: audioConference,
  //   meta: {
  //     requiresAuth: true,
  //     role: Role.User,
  //     layout: Layout.Main
  //   }
  // },
  {
    path: '/chat/:id?',
    component: chatTest,
    name: 'chat',
    meta: {
      requiresAuth: true,
      role: Role.User,
      layout: Layout.Chat
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
      role: Role.noAuth,
      layout: Layout.NoAuth
    }
  },
  {
    path: '/login',
    component: login,
    name: 'login',
    meta: {
      requiresAuth: false,
      role: Role.noAuth,
      layout: Layout.NoAuth
    }
  },
  {
    path: '/user',
    component: user,
    name: 'user',
    meta: {
      requiresAuth: true,
      role: Role.User,
      layout: Layout.Main
    }
  },
  {
    path: '/create',
    component: createConference,
    name: 'createConference',
    meta: {
      requiresAuth: true,
      role: Role.User,
      layout: Layout.Main
    }
  },
  {
    path: '/edit/:id',
    component: editConference,
    name: 'editConference',
    meta: {
      requiresAuth: true,
      role: Role.User,
      layout: Layout.Main
    }
  },
  {
    path: '/forgot',
    component: forgot,
    name: 'forgot',
    meta: {
      requiresAuth: false,
      role: Role.noAuth,
      layout: Layout.noAuth
    }
  },
  {
    path: '/404',
    component: pageNotFound,
    meta: {
      requiresAuth: true,
      role: Role.noAuth,
      layout: Layout.Main
    }
  },
  {
    path: '/:pathMatch(.*)*',
    component: pageNotFound,
    meta: {
      requiresAuth: false,
      role: Role.noAuth,
      layout: Layout.noAuth
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
