import $api from "../../axios";

export const chat = {
  namespaced: true,
  state: {
    constacts: [],
    chats: [],
    chatData: {
      id: null,
      title: null,
      group: null,
      adminId: null,
      invaitedUsers: null
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
    },
    async getInvaitedUsers( {commit, state}) {
      const usersId = []
      state.chatData.group.forEach(user => {
        usersId.push(user.id)
      })

      const res = await $api.get('/chat/invaitedUsers/', {
        params: {
          userData: usersId
        }
      })

      if (res.data) {
        commit('saveInvaitedUsers', res.data)
      }
    },
    async invaiteUserToChat({commit}, invaitedData) {
      
      const res = await $api.patch('/chat/invaiteToChat', {
        userId: invaitedData.userId,
        roomId: invaitedData.chatId
      })

      if (!res.data.status) {
        const res = await $api.get(`/user/getById/${invaitedData.userId}`)
        commit('addUserToGroup', res.data)
      }
    },
    async removeUserFromChat({commit}, removeData) {
      const res = await $api.delete("/chat/exitUser", {
        params: {
          chatId: removeData.chatId,
          userId: removeData.userId
        }
      })

      if (res.data) {
        commit('removeUserFromGroup', removeData.userId)
      }
    },
    async createChat({ commit }, chatData) {
      $api.post("/chat/create", {
        adminId: chatData.adminId,
        users: chatData.users,
        groupName: chatData?.groupName
      }).then(async res => {
        await commit('setChatId', res.data.chatId)
      }).catch(error => {
        commit('auth/setErrorMessage', error.response.data.message, { root: true })
      })

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
      state.message.page++

      if (messages.length < state.message.limit) {
        state.message.hasMore = false
      }
    },
    addMessage(state, message) {
      state.messages.unshift(message)
    },
    setChatId(state, chatId) {
      state.chatData.id = chatId
      console.log(state.chatData.id)
    },
    setChatTitle(state, data) {
      const anotherUser = data.users.filter((user) => user.id !== data.userId)
      state.chatData.title = anotherUser[0].login
      state.chatData.group = null
    },
    setGroupData(state, groupData) {
      state.chatData.title = groupData.title
      state.chatData.group = groupData.users
      state.chatData.adminId = groupData.adminId
    },
    cleanMessages(state) {
      state.messages = []
      state.message = {
        page: 0,
        limit: 10,
        hasMore: true
      }
    },
    cleanChatData(state) {
      state.chatData = {
        title: null,
        group: null,
        adminId: null,
        invaitedUsers: null
      }
    },
    addUserToGroup(state, userData) {
      state.chatData.group.push(userData)
      state.invaitedUsers = state.invaitedUsers.filter(user => user.id !== userData.id)
    },
    removeUserFromGroup(state, removeUserId) {

      const freeUser = state.chatData.group.find((user) => user.id === removeUserId)
      state.invaitedUsers.push(freeUser)
      state.chatData.group = state.chatData.group.filter((user) => user.id !== removeUserId)  

      state.chatData.group = state.chatData.group.filter((user) => user.id !== removeUserId)
    },
    saveInvaitedUsers(state, invaitedUsers) {
      state.invaitedUsers = invaitedUsers
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
      return state.messages
    },
    getRemoveUserList(state, getters, rootState) {
      if (!state.chatData.group) return null

      const userId = rootState.auth.user.id
      return state.chatData.group.filter((user) => user.id !== userId)
    }
  }
};