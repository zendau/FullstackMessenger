import $api from "../../axios";

export const chat = {
  namespaced: true,
  state: {
    constacts: {},
    chats: {},
    currentTempChatData: null,
    messages: {},
  },
  actions: {
    newChatMessage(
      { commit, state, getters },
      { messagesData, chatSocket, userId }
    ) {
      console.log("resieve message", messagesData);

      commit("setNewMessageData", {
        messagesData,
        userId,
        roomData: getters.selectedChat(messagesData.roomId),
      });

      if (state.chats[messagesData.roomId]) {
        console.log("2222");
        commit("setLastChatMessage", messagesData.roomId);
        commit("sortByMessageDate");
      } else {
        chatSocket.emit("load-chat-by-id", {
          userId,
          chatId: messagesData.roomId,
        });
      }
    },
    editChatMesssage({ commit, state }, updatedMessageData) {
      if (state.messages.hasOwnProperty(updatedMessageData.roomId)) {
        commit("updateMessage", updatedMessageData);
      }
    },
    deletedMessages({ commit, state }, deletedMessageData) {
      console.log("updateDeletedMessages", deletedMessageData);
      debugger;
      if (state.messages[deletedMessageData.roomId]) {
        commit("deletedMessages", deletedMessageData);

        const isDeletedLastMessage = deletedMessageData.deletedData.find(
          (item) => {
            console.log(
              "qq",
              item.id,
              state.chats[deletedMessageData.roomId],
              state.chats[deletedMessageData.roomId].lastMessage.id
            );
            return (
              item.id === state.chats[deletedMessageData.roomId].lastMessage.id
            );
          }
        );
        debugger;
        if (isDeletedLastMessage) {
          commit("setLastChatMessage", deletedMessageData.roomId);
          commit("sortByMessageDate");
        }
      }
    },
    // async getContacts({ commit, rootState }) {
    //   const res = await $api.get("/chat/getContacts");
    //   const userLogin = rootState.auth.user.login;
    //   const contacts = res.data.filter((user) => user.login !== userLogin);
    //   commit("saveContacts", contacts);
    // },
    // async getChats({ commit, rootState }) {
    //   const userId = rootState.auth.user.id;
    //   console.log("TEST", rootState.auth);
    //   const res = await $api.get(`/chat/getByUser/${userId}`);
    //   commit("saveChats", res.data);
    // },
    // async getMessges({ commit, state }, chatId) {
    //   const messagesRes = await $api.get(`/message/getAllChat/${chatId}`, {
    //     params: {
    //       page: state.message.page,
    //       limit: state.message.limit,
    //     },
    //   });
    //   if (messagesRes.data.status !== false) {
    //     console.log("commit messages");
    //     commit("saveMessages", messagesRes.data);
    //   }
    // },
    // async getInvaitedUsers({ commit, state }) {
    //   const usersId = [];
    //   state.chatData.group.forEach((user) => {
    //     usersId.push(user.id);
    //   });
    //   const res = await $api.post("/chat/invaitedUsers/", {
    //     users: usersId,
    //   });
    //   if (res.data) {
    //     commit("saveInvaitedUsers", res.data);
    //   }
    // },
    // async invaiteUserToChat({ commit }, invaitedData) {
    //   const res = await $api.patch("/chat/invaiteToChat", {
    //     userId: invaitedData.userId,
    //     roomId: invaitedData.chatId,
    //   });
    //   if (!res.data.status) {
    //     const res = await $api.get(`/user/getById/${invaitedData.userId}`);
    //     commit("addUserToGroup", res.data);
    //   }
    // },
    // async removeUserFromChat({ commit }, removeData) {
    //   const res = await $api.delete("/chat/exitUser", {
    //     params: {
    //       chatId: removeData.chatId,
    //       userId: removeData.userId,
    //     },
    //   });
    //   if (res.data) {
    //     commit("removeUserFromGroup", removeData.userId);
    //   }
    // },
    // async createChat({ commit }, chatData) {
    //   $api
    //     .post("/chat/create", {
    //       adminId: chatData.adminId,
    //       users: chatData.users,
    //       groupName: chatData?.groupName,
    //     })
    //     .then(async (res) => {
    //       await commit("setChatId", res.data.id);
    //     })
    //     .catch((error) => {
    //       commit("auth/setErrorMessage", error.response.data.message, {
    //         root: true,
    //       });
    //     });
    // },
  },
  mutations: {
    // saveContacts(state, constacts) {
    //   state.constacts = constacts;
    // },
    saveChats(state, chats) {
      state.chats = chats;
    },

    saveCurrentTempChat(state, chatData) {
      state.currentTempChatData = chatData;
    },
    saveMessages(state, { chatId, uploadMessagesData }) {
      if (!state.messages[chatId]) state.messages[chatId] = [];

      state.messages[chatId].push(...uploadMessagesData.messages);
      state.chats[chatId].loadMessagesPagination = {
        page: uploadMessagesData.page,
        limit: uploadMessagesData.limit,
        hasMore: uploadMessagesData.hasMore,
        inMemory: uploadMessagesData.inMemory,
      };
    },
    sortByMessageDate(state) {
      const sortedMessagesByDate = Object.keys(state.chats)
        .sort((a, b) => {
          const dateA = new Date(
            state.chats[a]?.lastMessage?.created_at || null
          ).getTime();
          const dateB = new Date(
            state.chats[b]?.lastMessage?.created_at || null
          ).getTime();

          return dateA < dateB ? 1 : dateA === dateB ? 0 : -1;
        })
        .reduce((obj, key) => {
          obj[key] = { ...state.chats[key] };
          return obj;
        }, {});

      state.chats = sortedMessagesByDate;
    },

    setNewMessageData(state, { messagesData, userId, roomData }) {
      if (state.messages[messagesData.roomId]) {
        state.messages[messagesData.roomId].unshift(messagesData);
      } else {
        state.messages[messagesData.roomId] = [messagesData];
      }

      // if (!roomsData.value.hasOwnProperty(messagesData.roomId)) {
      //   roomsData.value[messagesData.roomId] = {}
      // }

      if (!roomData) return;

      if (messagesData.authorId !== userId) {
        roomData.unread++;
      }

      roomData.isNotUnread++;
    },

    setLastChatMessage(state, roomId) {
      debugger;
      const messages = state.messages[roomId];
      if (!messages) return [];

      const lastMessage = messages[0];
      const messageRoom = state.chats[roomId];
      // if (!messageRoom.hasOwnProperty("lastMessage")) {
      //   messageRoom.lastMessage = {};
      // }

      messageRoom.lastMessage = lastMessage;
    },
    updateMessage(state, updatedMessageData) {
      state.messages[updatedMessageData.roomId] = state.messages[
        updatedMessageData.roomId
      ].map((message) => {
        if (message.id === updatedMessageData.messageId) {
          message.isEdited = true;

          if (updatedMessageData.updatedText) {
            message.text = updatedMessageData.updatedText;
          }

          if (updatedMessageData.deletedFiles) {
            message.files = message.files.filter(
              (file) => !updatedMessageData.deletedFiles.includes(file.id)
            );
          }

          if (updatedMessageData.files) {
            message.files.push(...updatedMessageData.files);
          }
        }
        return message;
      });
    },
    deletedMessages(state, deletedMessagesData) {
      state.messages[deletedMessagesData.roomId] = state.messages[
        deletedMessagesData.roomId
      ].filter(
        (message) =>
          !deletedMessagesData.deletedData.find(
            (item) => item.id === message.id
          )
      );
    },
    // addMessage(state, message) {
    //   state.messages.unshift(message);
    // },
    // setChatId(state, chatId) {
    //   state.chatData.id = chatId;
    //   console.log(state.chatData.id);
    // },
    // setChatTitle(state, data) {
    //   const anotherUser = data.users.filter((user) => user.id !== data.userId);
    //   state.chatData.title = anotherUser[0].login;
    //   state.chatData.group = null;
    // },
    // setGroupData(state, groupData) {
    //   state.chatData.title = groupData.title;
    //   state.chatData.group = groupData.users;
    //   state.chatData.adminId = groupData.adminId;
    // },
    // cleanMessages(state) {
    //   state.messages = [];
    //   state.message = {
    //     page: 0,
    //     limit: 10,
    //     hasMore: true,
    //   };
    // },
    // cleanChatData(state) {
    //   state.chatData = {
    //     title: null,
    //     group: null,
    //     adminId: null,
    //     invaitedUsers: null,
    //   };
    // },
    // cleanAllData(state) {
    //   (state.constacts = []),
    //     (state.chats = []),
    //     (state.chatData = {
    //       id: null,
    //       title: null,
    //       group: null,
    //       adminId: null,
    //       invaitedUsers: null,
    //     }),
    //     (state.message = {
    //       page: 0,
    //       limit: 10,
    //       hasMore: true,
    //     }),
    //     (state.messages = []);
    // },
    // addUserToGroup(state, userData) {
    //   state.chatData.group.push(userData);
    //   state.invaitedUsers = state.invaitedUsers.filter(
    //     (user) => user.id !== userData.id
    //   );
    // },
    // removeUserFromGroup(state, removeUserId) {
    //   const freeUser = state.chatData.group.find(
    //     (user) => user.id === removeUserId
    //   );
    //   state.invaitedUsers.push(freeUser);
    //   state.chatData.group = state.chatData.group.filter(
    //     (user) => user.id !== removeUserId
    //   );
    //   state.chatData.group = state.chatData.group.filter(
    //     (user) => user.id !== removeUserId
    //   );
    // },
    // saveInvaitedUsers(state, invaitedUsers) {
    //   state.invaitedUsers = invaitedUsers;
    // },
  },
  getters: {
    selectedChat: (state) => (chatId) => {
      const chatData = state.currentTempChatData ?? state.chats[chatId];
      return chatData;
    },
    // getRemoveUserList(state, getters, rootState) {
    //   if (!state.chatData.group) return null;
    //   const userId = rootState.auth.user.id;
    //   return state.chatData.group.filter((user) => user.id !== userId);
    // },
  },
};
