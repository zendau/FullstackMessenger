// eslint-disable-next-line no-unused-vars
import $api from '../../axios'
import router from '../../router'


export const conference = {
  namespaced: true,
  state: {
    adminLogin: null,
    chatId: null,
    title: null,
  },
  actions: {
    async createConference({ commit }, conferenceData) {
      
      $api.post('/room/add', {
        roomTitle: conferenceData.title,
        adminLogin: conferenceData.adminLogin,
        chatId: conferenceData.chatId,
        roomWithVideo: conferenceData.type

      }).then(res => {
        commit('saveConferenceData', res.data)
        const roomType = res.data.roomWithVideo ? 'video' : 'audio'
        router.push(`/conference/${roomType}/${res.data.roomId}`)
      }).catch(error => {
        commit('auth/setErrorMessage', error.response.data.message, { root: true })
      })
    }
  },
  mutations: {
    saveConferenceData(state, conferenceData) {
      state.adminLogin = conferenceData.adminLogin
      state.chatId = conferenceData.chatId
      state.title = conferenceData.roomTitle
    }
  },
  getters: {

  }
}