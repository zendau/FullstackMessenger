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
    id: null,
    rooms: []
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

        const room = res.data

        commit('saveConferenceData', room)
        conferenceData.socket.emit('insertNewRoom', {
          adminId: room.adminId,
          chatId: room.chatId,
          id: room.id,
          roomTitle: room.roomTitle,
          roomWithVideo: room.roomWithVideo,
        })
        const roomType = room.roomWithVideo ? 'video' : 'audio'
        router.push(`/conference/${roomType}/${room.id}`)
      } catch (error) {
        $api.delete(`/chat/delete/${conferenceData.chatId}`)

        commit('alert/setErrorMessage', error.response.data.message, { root: true })
      }
    },
    async getConferenceData({ commit }, roomId) {
      try {
        const res = await $api.get('/room/get/' + roomId)
        commit('saveConferenceData', res.data)
      } catch (error) {
        router.push('/404')
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
        router.push(`/conference/${roomType}/${conferenceData.id}`)
      } catch (error) {
        commit('alert/setErrorMessage', error.response.data.message, { root: true })
      }
    },
    async deleteConference({ commit }, id) {
      try {
        await $api.delete(`/room/delete/${id}`)
        commit('clearConferenceData')
      } catch (error) {
        commit('alert/setErrorMessage', error.response.data.message, { root: true })
      }
    },
    async getConferesRooms({ commit }) {
      try {
        const res = await $api.get('/room/getAll')
        commit('saveRoomsData', res.data)
      } catch (error) {
        commit('alert/setErrorMessage', error.response.data.message, { root: true })
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
    },
    clearConferenceData(state) {
      state.adminLogin = null
      state.chatId = null
      state.title = null
      state.adminId = null
      state.type = null
      state.id = null
    },
    saveRoomsData(state, roomsData) {
      state.rooms = roomsData
    },
    insertNewConferenceRoom(state, newRoom) {
      state.rooms.push(newRoom)
      console.log(state)
    }
  },
  getters: {}
}