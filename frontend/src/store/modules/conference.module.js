// eslint-disable-next-line no-unused-vars
import $api from '../../axios'
import router from '../../router'


export const conference = {
  namespaced: true,
  state: {
    adminId: null,
    adminLogin: null,
    chatId: null,
    title: null,
    type: null,
    id: null
  },
  actions: {
    async createConference({ commit }, conferenceData) {
      
      try {
        const res = await $api.post('/room/add', {
          roomTitle: conferenceData.title,
          adminId: conferenceData.adminId,
          chatId: conferenceData.chatId,
          roomWithVideo: conferenceData.type
  
        })
        commit('saveConferenceData', res.data)
        const roomType = res.data.roomWithVideo ? 'video' : 'audio'
        router.push(`/conference/${roomType}/${res.data.roomId}`)
      } catch (error) {
        $api.delete(`/chat/delete/${conferenceData.chatId}`)

        commit('auth/setErrorMessage', error.response.data.message, { root: true })
      }
    },
    async getConferenceData({ commit }, roomId) { 
      try {
        const res = await $api.get('/room/get/' + roomId)
        commit('saveConferenceData', res.data)
      } catch (error) {
        commit('auth/setErrorMessage', error.response.data.message, { root: true })
      }
    },
    async editConference({ commit, state }, conferenceData) {
      try {
        await $api.patch('/room/edit', {
          roomTitle: conferenceData.title,
          roomWithVideo: conferenceData.type,
          id: conferenceData.id
  
        })
        commit('saveConferenceData', {
          adminLogin: state.adminLogin,
          chatId: state.chatId,
          title: conferenceData.title,
          adminId: state.adminId,
          roomWithVideo: conferenceData.type,
          id: state.id
        })
        const roomType = conferenceData.type ? 'video' : 'audio'
        router.push(`/conference/${roomType}/${conferenceData.roomId}`)
      } catch (error) {
        $api.delete(`/chat/delete/${conferenceData.chatId}`)

        commit('auth/setErrorMessage', error.response.data.message, { root: true })
      }
    }
  },
  mutations: {
    saveConferenceData(state, conferenceData) {
      state.adminLogin = conferenceData.adminLogin
      state.chatId = conferenceData.chatId
      state.title = conferenceData.roomTitle
      state.adminId = conferenceData.adminId
      state.type = conferenceData.roomWithVideo
      state.id = conferenceData.id
    }
  },
  getters: {

  }
}