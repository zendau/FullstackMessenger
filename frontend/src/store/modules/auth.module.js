import $api from "../../axios";
import jwt_decode from "jwt-decode";

import router from '../../router'

export const auth = {
  namespaced: true,
  state: {
    user: {
        id: null,
        login: null,
        email: null,
        role: []
    },
    authStatus: false,
    error: ""
  },
  actions: {
    async login({ commit }, loginData) {
        try {
            const resData = await $api.post('/auth/login', {
                email: loginData.email,
                password: loginData.password
            })

            const tokenDecode = jwt_decode(resData.data.accessToken)
            commit('authSuccess', tokenDecode)
            router.push('/user')
        } catch (e) {
            commit('authFailed', e.response.data)
        }
    },
    logout({ commit }) {
        localStorage.removeItem('token');
        commit('logout')

    },
    async register({ commit }, registerData) {
        try {
            const resData = await $api.post('/auth/register', {
                email: registerData.email,
                password: registerData.password,
                confirmPassword: registerData.confirmPassword
            })

            const tokenDecode = jwt_decode(resData.data.accessToken)

            commit('authSuccess', tokenDecode)
            router.push('/user')
        } catch (e) {
            commit('authFailed', e.response.data)
        }
    },
    async checkAuth({ commit }) {
        try {



            const resData = await $api.get('/auth/refresh')
            const accessToken = resData.data.accessToken
            const tokenDecode = jwt_decode(accessToken)

            commit('authSuccess', tokenDecode)
            router.push('/user')
        } catch {
            return
        }
    }
  },
  mutations: {
    authSuccess(state, userData) {
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
            login: null,
            email: null,
            role: []
        },
        state.authStatus = false,
        state.error = ""
    },
    clearErrorMessage(state) {
        state.error = ""
    }
  }
};