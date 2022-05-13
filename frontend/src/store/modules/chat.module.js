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
    page: 0,
    limit: 10,
    hasMore: true,
    messages: []
  },
  actions: {
    async getContacts( {commit, rootState}) {
      const res = await $api.get("/chat/getContacts");
      const userLogin =  rootState.auth.user.login
      const contacts = res.data.filter((user) => user.login !== userLogin)

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
            page: state.page,
            limit: state.limit,
          },
        }
      )

      if (messagesRes.data.status !== false) {
        commit('saveMessages', messagesRes.data)
      }
    }
  },
  mutations: {
    saveContacts(state, constacts) {
      state.constacts = constacts
    },
    saveChats(state, chats) {
      state.chats = chats
    },
    saveMessages(state, messages) {
      state.messages.push(...messages)
    },
    setChatTitle(state, title) {
      state.chatData.title = title
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
    }
  }
};