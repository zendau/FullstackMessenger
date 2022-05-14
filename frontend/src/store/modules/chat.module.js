import $api from "../../axios";

export const chat = {
  namespaced: true,
  state: {
    constacts: [],
    chats: [],
    chatData: {
      title: null,
      group: null
    },
    message: {
      page: 0,
      limit: 10,
      hasMore: true,
    },
    messages: []
  },
  actions: {
    async getContacts( {commit, rootState}) {
      
      const res = await $api.get("/chat/getContacts");
      const userLogin =  rootState.auth.user.login
      const contacts = res.data.filter((user) => user.login !== userLogin)
      console.log('dispatch contacts')
      commit('saveContacts', contacts)
    },
    async getChats( {commit, rootState}) {
      const userId = rootState.auth.user.id      
      const res = await $api.get(`/chat/getByUser/${userId}`);

      commit('saveChats', res.data)
    },
    async getMessges( {commit, state }, chatId) {
      const messagesRes = await $api.get(
        `/message/getAllChat/${chatId}`,
        {
          params: {
            page: state.message.page,
            limit: state.message.limit,
          },
        }
      )

      if (messagesRes.data.status !== false) {
        console.log('commit messages')
        commit('saveMessages', messagesRes.data)
      }
    }
  },
  mutations: {
    saveContacts(state, constacts) {
      console.log('mutation contacts')
      state.constacts = constacts
    },
    saveChats(state, chats) {
      state.chats = chats
    },
    saveMessages(state, messages) {
      state.messages.push(...messages)
      state.message.page++

      if (messages.length < state.message.limit) {
        state.message.hasMore = false
      }
    },
    setChatTitle(state, data) {
      const anotherUser = data.users.filter((user) => user.id !== data.userId)
      state.chatData.title = anotherUser[0].login
    },
    cleanMessages(state) {
      console.log('clean')
      state.messages = []
      state.message = {
        page: 0,
        limit: 10,
        hasMore: true
      }
    }
  },
  getters: {
    getContacts(state) {
      return state.constacts
    },
    getChats(state) {
      return state.chats
    },
    getChatData(state) {
      return state.chatData
    },
    getMessageData(state) {
      return state.message
    },
    getMessages(state) {
      console.log('get messages')
      return state.messages
    }
  }
};