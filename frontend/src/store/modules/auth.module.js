import $api from "../../axios";
import jwt_decode from "jwt-decode";

import router from '../../router'

import {alert} from '../../components/UI/alert'

export const auth = {
  namespaced: true,
  state: {
    user: {
        id: null,
        email: null,
        role: []
    },
    authStatus: false,
  message: {
    text: '',
    type: null
  }
  },
  actions: {
    async login({ commit }, loginData) {
        try {
            const resData = await $api.post('/user/login', {
                email: loginData.email,
                password: loginData.password,
              })
            
            const accessToken = resData.data.accessToken
            const tokenDecode = jwt_decode(accessToken)
            commit('authSuccess', tokenDecode)
            localStorage.setItem('token', accessToken)
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

            const accessToken = resData.data.accessToken
            const tokenDecode = jwt_decode(accessToken)
            commit('authSuccess', tokenDecode)
            localStorage.setItem('token', accessToken)
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
            state.message.text = msg
            state.message.type = alert.danger
        } else {
            state.message.text =  msg[0]
            state.message.type = alert.danger
        }
        console.log(state)
    },
    logout(state) {
        state.user = {
            id: null,
            email: null,
            role: []
        }
        state.authStatus = false
    },
    clearErrorMessage(state) {
        state.message.text = ""
        state.message.type = null
    }
  },
  getters: {
      getAuthStatus(state) {
          console.log('state', state)
          return state.authStatus
      },
      getUserData(state) {
        return state.user
      },
      getAlertMessage(state) {
          return state.message
      },
      getRoleAcessLevel(state) {
          return state.user.role.accessLevel
      }
  }
};