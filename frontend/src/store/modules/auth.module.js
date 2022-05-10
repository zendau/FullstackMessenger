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
            const message =  e.response.data

            if (typeof message === 'string') {
                commit('authFailed', message)
            } else {
                commit('authFailed', message[0])
            }
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
            const message =  e.response.data

            if (typeof message === 'string') {
                commit('authFailed', message)
            } else {
                commit('authFailed', message[0])
            }
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
    logout(state) {
        state.user = {
            id: null,
            email: null,
            role: []
        }
        state.authStatus = false
    },
    clearMessage(state) {
        state.message.text = ""
        state.message.type = null
    },
    setErrorMessage(state, text) {
        state.message.text = text
        state.message.type = alert.danger
    },
    setSuccessMessage(state, text) {
        state.message.text = text
        state.message.type = alert.success
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