import $api from "../../axios";
import jwt_decode from "jwt-decode";

import router from '../../router'

import { alert } from '../../components/UI/alert'

export const auth = {
    namespaced: true,
    state: {
        user: {
            id: null,
            email: null,
            login: null,
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
                debugger
                const message = e.response.data
                commit('setErrorMessage', message)
            }
        },
        async resetPassword({ commit }, resetData) {
            try {
                await $api.patch('/user/resetPassword', {
                    email: resetData.email,
                    confirmCode: resetData.confirmCode,
                })

                commit('setSuccessMessage', 'New password was send to your email')
            } catch (e) {
                const message = e.response.data.message
                commit('setErrorMessage', message)

            }
        },
        async changeUserData({ commit }, userData) {
            try {
                await $api.patch('/user/editData', {
                    id: userData.id,
                    email: userData.email,
                    newEmail: userData.newEmail,
                    login: userData.login,
                    password: userData.password,
                    confirmPassword: userData.confirmPassword,
                    confirmCode: userData.confirmCode,
                })



                commit('setSuccessMessage', 'Your data was updated')
                commit('updateData', userData)
            } catch (e) {
                const message = e.response.data.message
                commit('setErrorMessage', message)

            }
        },
        async logout({ commit }) {
            localStorage.removeItem('token');
            const resData = await $api.get('/user/logout')
            console.log(resData)
            commit('logout')
            router.push('/')

        },
        async register({ commit }, registerData) {
            try {
                const resData = await $api.post('/user/register', {
                    email: registerData.email,
                    login: registerData.login,
                    password: registerData.password,
                    confirmPassword: registerData.confirmPassword,
                    confirmCode: registerData.confirmCode
                })

                const accessToken = resData.data.accessToken
                const tokenDecode = jwt_decode(accessToken)
                commit('authSuccess', tokenDecode)
                localStorage.setItem('token', accessToken)
                router.push('/users')
            } catch (e) {
                const message = e.response.data
                commit('setErrorMessage', message)
            }
        },
        async confirmCode({ commit }, email) {
            try {
                await $api.post('/user/setConfirmCode', {
                    email
                })
            } catch (e) {
                const message = e.response.data
                commit('setErrorMessage', message)
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
                login: userData.login,
                role: userData.role
            }
            state.authStatus = true
        },
        updateData(state, newData) {

            const updateData = {
                ...(newData.newEmail ? { email: newData.newEmail } : { email: state.user.email }),
                ...(newData.login ? { login: newData.login } : { login: state.user.login }),
            }

            state.user.email = updateData.email
            state.user.login = updateData.login
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
            let message = null
            if (typeof text === 'string') {
                message = text
            }
            else if (text.message) {
                message = text.message
            } else {
                message = text[0]
            }
 
            state.message.text = message
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