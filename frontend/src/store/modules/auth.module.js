import $api from "../../axios";
import jwt_decode from "jwt-decode";

import router from '../../router'

export const auth = {
  namespaced: true,
  state: {
    user: {
        id: null,
        email: null,
        role: []
    },
    authStatus: false,
    error: ""
  },
  actions: {
    async login({ commit }, loginData) {
        try {
            const resData = await $api.post('/user/login', {
                email: loginData.email,
                password: loginData.password,
              })
            
            const tokenDecode = jwt_decode(resData.data.accessToken)
            commit('authSuccess', tokenDecode)
            router.push('/users')
        } catch (e) {
            commit('authFailed', e.response.data)
        }
    },
    logout({ commit }) {
        localStorage.removeItem('token');
        commit('logout')
        router.push('/')

    },
    async register({ commit }, registerData) {
        try {
            const resData = await $api.post('/user/register', {
                email: registerData.email,
                password: registerData.password,
                confirmPassword: registerData.confirmPassword
              })

            const tokenDecode = jwt_decode(resData.data.accessToken)
            commit('authSuccess', tokenDecode)
            router.push('/users')
        } catch (e) {
            commit('authFailed', e.response.data)
        }
    },
    async checkAuth({ commit }) {
        try {

            console.log('checkAuth')

            //const resData = await $api.get('/auth/refresh')
            const accessToken = localStorage.getItem('token')
            const tokenDecode = jwt_decode(accessToken)
            console.log(tokenDecode)
            commit('authSuccess', tokenDecode)
            //router.push('/users')
        } catch (e) {
            console.log('e', e)
            return
        }
    }
  },
  mutations: {
    authSuccess(state, userData) {
        console.log('auth success')
        state.user = {
            id: userData.id,
            email: userData.email,
            role: userData.role
        }
        state.authStatus = true
    },
    authFailed(state, error) {
        const msg = error.message

        if (typeof msg === 'string') {
            state.error = msg
        } else {
            state.error = msg[0]
        }
    },
    logout(state) {
        state.user = {
            id: null,
            email: null,
            role: []
        },
        state.authStatus = false,
        state.error = ""
    },
    clearErrorMessage(state) {
        state.error = ""
    }
  },
  getters: {
      getAuthStatus(state) {
          console.log('state', state)
          return state.authStatus
      },
      getUserData(state) {
        return state.user
      }
  }
};