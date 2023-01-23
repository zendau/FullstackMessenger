import { createRouter, createWebHistory } from "vue-router";

import store from "../store/index";
import { Role } from "./roles";
import { Layout } from "./layouts";

const chatPage = () => import("../views/Chat/ChatPage.vue");

const register = () => import("../views/Auth/RegisterPage.vue");
const login = () => import("../views/Auth/LoginPage.vue");
const forgot = () => import("../views/Auth/ForgotPage.vue");

const settings = () => import("../views/SettingsPage.vue");

const conferences = () => import("../views/Conference/СonferencesList.vue");
const createConference = () =>
  import("../views/Conference/createConference.vue");
const editConference = () => import("../views/Conference/editConference.vue");
const conference = () => import("../layout/auth.conferecnce.vue");
const audioConference = () => import("../views/Conference/AudioConference.vue");
const videoConference = () => import("../views/Conference/videoConference.vue");

const adminView = () => import("../views/Admin/AdminPage.vue");
const adminUsers = () => import("../views/Admin/UsersPage.vue");

const pageNotFound = () => import("../views/PageNotFound.vue");

const routes = [
  {
    path: "/conferences",
    name: "conferences",
    component: conferences,
    meta: {
      requiresAuth: true,
      role: Role.USER,
      layout: Layout.Main,
    },
  },
  {
    path: "/conference",
    name: "conference",
    component: conference,
    children: [
      {
        path: "audio/:id",
        name: "audioRoom",
        component: audioConference,
        meta: {
          requiresAuth: true,
          role: Role.USER,
          layout: Layout.Main,
        },
      },
      {
        path: "video/:id",
        name: "videoRoom",
        component: videoConference,
        meta: {
          requiresAuth: true,
          role: Role.USER,
          layout: Layout.Main,
        },
      },
    ],
  },
  {
    path: "/chat/:id?",
    component: chatPage,
    name: "chat",
    meta: {
      requiresAuth: true,
      role: Role.USER,
      layout: Layout.Chat,
    },
  },
  {
    path: "/admin",
    component: adminView,
    name: "adminLayout",
    meta: {
      requiresAuth: true,
      role: Role.ADMIN,
    },
    children: [
      {
        path: "users",
        component: adminUsers,
        name: "adminUsers",
        meta: {
          requiresAuth: true,
          role: Role.ADMIN,
          layout: Layout.Main,
        },
      },
    ],
  },
  {
    path: "/register",
    component: register,
    name: "register",
    meta: {
      requiresAuth: false,
      role: Role.GUEST,
      layout: Layout.NoAuth,
    },
  },
  {
    path: "/login",
    component: login,
    name: "login",
    meta: {
      requiresAuth: false,
      role: Role.GUEST,
      layout: Layout.NoAuth,
    },
  },
  {
    path: "/forgot",
    component: forgot,
    name: "forgot",
    meta: {
      requiresAuth: false,
      role: Role.GUEST,
      layout: Layout.NoAuth,
    },
  },
  {
    path: "/settings",
    component: settings,
    name: "settings",
    meta: {
      requiresAuth: true,
      role: Role.USER,
      layout: Layout.Main,
    },
  },
  {
    path: "/create",
    component: createConference,
    name: "createConference",
    meta: {
      requiresAuth: true,
      role: Role.USER,
      layout: Layout.Main,
    },
  },
  {
    path: "/edit/:id",
    component: editConference,
    name: "editConference",
    meta: {
      requiresAuth: true,
      role: Role.USER,
      layout: Layout.Main,
    },
  },
  {
    path: "/404",
    component: pageNotFound,
    meta: {
      requiresAuth: true,
      role: Role.GUEST,
      layout: Layout.Main,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    component: pageNotFound,
    meta: {
      requiresAuth: false,
      role: Role.GUEST,
      layout: Layout.noAuth,
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const noAuthRedicect = import.meta.env.VITE_ROUTER_REDIRECT_NO_AUTH_PATH;
  const wrongRoleRedicect = import.meta.env
    .VITE_ROUTER_REDIRECT_WRONG_ROLE_PATH;
  const startAuthPage = import.meta.env.VITE_ROUTER_START_AUTH_PAGE_PATH;

  const { authStatus } = store.state.auth;
  const userRole = store.state.auth.user.role;
  const { isBanned } = store.state.auth.user;

  if (to.meta.requiresAuth) {
    if (authStatus) {
      if (isBanned) {
        store.dispatch("auth/logout");
      } else {
        if (to.meta.role <= Role[userRole]) {
          next();
        } else {
          next(wrongRoleRedicect);
        }
      }
    } else {
      next(noAuthRedicect);
    }
  } else {
    if (authStatus) {
      next(startAuthPage);
    } else {
      if (to.fullPath === "/") {
        next(noAuthRedicect);
      } else {
        next();
      }
    }
  }
});

export default router;
