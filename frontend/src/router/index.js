import { createRouter, createWebHistory } from 'vue-router'

import store from '../store/index'
import { Role } from './roles'
import { Layout } from './layouts'

const chat = () => import('../views/Chat/chat.vue')

const register = () => import('../views/Auth/register.vue')
const login = () => import('../views/Auth/login.vue')
const forgot = () => import('../views/Auth/forgot.vue')

const user = () => import('../views/user.vue')

const conferences = () => import('../views/conference/conferences.vue')
const createConference = () => import('../views/conference/createConference.vue')
const editConference = () => import('../views/conference/editConference.vue')
const conference = () => import('../layout/auth.conferecnce.vue')
const audioConference = () => import('../views/conference/audioConference.vue')
const videoConference = () => import('../views/conference/videoConference.vue')

const adminView = () => import('../views/Admin/admin.vue')
const adminUsers = () => import('../views/Admin/users.vue')

const pageNotFound = () => import('../views/404.vue')

const routes = [
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
  {
    path: '/chat/:id?',
    component: chat,
    name: 'chat',
    meta: {
      requiresAuth: true,
      role: Role.User,
      layout: Layout.Chat
    }
  },
  {
    path: '/admin',
    component: adminView,
    name: 'adminLayout',
    meta: {
      requiresAuth: true,
      role: Role.Admin
    },
    children: [
      {
        path: 'users',
        component: adminUsers,
        name: 'adminUsers',
        meta: {
          requiresAuth: true,
          role: Role.Admin,
          layout: Layout.Main
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
    path: '/forgot',
    component: forgot,
    name: 'forgot',
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
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})


router.beforeEach((to, from, next) => {

  const noAuthRedicect = process.env.VUE_APP_ROUTER_REDIRECT_NO_AUTH_PATH
  const wrongRoleRedicect = process.env.VUE_APP_ROUTER_REDIRECT_WRONG_ROLE_PATH
  const startAuthPage = process.env.VUE_APP_ROUTER_START_AUTH_PAGE_PATH

  const authStatus = store.state.auth.authStatus
  const userRole = store.state.auth.user.role.accessLevel
  const isBanned = store.state.auth.user.isBanned

  if (to.meta.requiresAuth) {
    if (authStatus) {
      if (isBanned) {
        store.dispatch('auth/logout')
      } else {
        if (to.meta.role <= userRole) {
          next()
        } else {
          next(wrongRoleRedicect)
        }
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
      if (to.fullPath === '/') {
        next(noAuthRedicect)
      } else {
        next()
      }

    }
  }
})

export default router
