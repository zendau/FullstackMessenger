import { createRouter, createWebHistory } from "vue-router";

import store from "../store/index";
import { Role } from "./roles";
import { Layout } from "./layouts";

const ChatPage = () => import("@/views/Chat/ChatPage.vue");

const Register = () => import("@/views/Auth/RegisterPage.vue");
const Login = () => import("@/views/Auth/LoginPage.vue");
const Forgot = () => import("@/views/Auth/ForgotPage.vue");

const Settings = () => import("@/views/SettingsPage.vue");

const UsersPage = () => import("@/views/Users/UsersPage.vue");

const Conferences = () => import("@/views/Conference/ConferencesList.vue");
const CreateConference = () =>
  import("@/views/Conference/CreateConference.vue");
const EditConference = () => import("@/views/Conference/EditConference.vue");
const Conference = () => import("@/layout/AuthConference.vue");
const AudioConference = () => import("@/views/Conference/AudioConference.vue");
const VideoConference = () => import("@/views/Conference/VideoConference.vue");

const AdminView = () => import("@/views/Admin/AdminPage.vue");
const AdminUsers = () => import("@/views/Admin/UsersPage.vue");

const PageNotFound = () => import("@/views/PageNotFound.vue");

const routes = [
  {
    path: "/conferences",
    name: "conferences",
    component: Conferences,
    meta: {
      requiresAuth: true,
      role: Role.USER,
      layout: Layout.Main,
    },
  },
  {
    path: "/users",
    name: "UsersContacts",
    component: UsersPage,
    meta: {
      requiresAuth: true,
      role: Role.USER,
      layout: Layout.Main,
    },
  },
  {
    path: "/conference",
    name: "conference",
    component: Conference,
    children: [
      {
        path: "audio/:id",
        name: "audioRoom",
        component: AudioConference,
        meta: {
          requiresAuth: true,
          role: Role.USER,
          layout: Layout.Main,
        },
      },
      {
        path: "video/:id",
        name: "videoRoom",
        component: VideoConference,
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
    component: ChatPage,
    name: "chat",
    meta: {
      requiresAuth: true,
      role: Role.USER,
      layout: Layout.Chat,
    },
  },
  {
    path: "/admin",
    component: AdminView,
    name: "adminLayout",
    meta: {
      requiresAuth: true,
      role: Role.ADMIN,
    },
    children: [
      {
        path: "users",
        component: AdminUsers,
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
    component: Register,
    name: "register",
    meta: {
      requiresAuth: false,
      role: Role.GUEST,
      layout: Layout.NoAuth,
    },
  },
  {
    path: "/login",
    component: Login,
    name: "login",
    meta: {
      requiresAuth: false,
      role: Role.GUEST,
      layout: Layout.NoAuth,
    },
  },
  {
    path: "/forgot",
    component: Forgot,
    name: "forgot",
    meta: {
      requiresAuth: false,
      role: Role.GUEST,
      layout: Layout.NoAuth,
    },
  },
  {
    path: "/settings",
    component: Settings,
    name: "settings",
    meta: {
      requiresAuth: true,
      role: Role.USER,
      layout: Layout.Main,
    },
  },
  {
    path: "/create",
    component: CreateConference,
    name: "createConference",
    meta: {
      requiresAuth: true,
      role: Role.USER,
      layout: Layout.Main,
    },
  },
  {
    path: "/edit/:id",
    component: EditConference,
    name: "editConference",
    meta: {
      requiresAuth: true,
      role: Role.USER,
      layout: Layout.Main,
    },
  },
  {
    path: "/404",
    component: PageNotFound,
    meta: {
      requiresAuth: true,
      role: Role.GUEST,
      layout: Layout.Main,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    component: PageNotFound,
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
