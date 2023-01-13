import $api from "../../axios";

const defaultLoadChatsPagination = {
  page: 0,
  limit: 6,
  hasMore: true,
};

const defoultLoadMessagesPagination = {
  page: 0,
  limit: 10,
  hasMore: true,
  inMemory: true,
};

export const chat = {
  namespaced: true,
  state: {
    chats: {},
    chatsByPattern: null,
    currentTempChatData: null,
    messages: {},
    tempPrivateChat: null,
    loadChatsPagination: { ...defaultLoadChatsPagination },
    freeChatUsers: null,
  },
  actions: {
    async newChatMessage({ commit, state, getters }, { messagesData, userId }) {
      try {
        console.log("resieve message", messagesData);

        if (!state.chats[messagesData.roomId]) {
          const res = await $api.get("/chat/byId", {
            params: {
              userId,
              chatId: messagesData.roomId,
            },
          });

          const { chatId } = res.data;

          commit("saveChats", { [chatId]: res.data });
        }

        commit("setNewMessageData", {
          messagesData,
          userId,
          roomData: getters.selectedChat(messagesData.roomId),
        });

        console.log("2222");
        commit("setLastChatMessage", messagesData.roomId);
        commit("sortByMessageDate");
      } catch (e) {
        commit("alert/setErrorMessage", e.response.data.message, {
          root: true,
        });
      }
    },
    async getChatMessages({ commit, state }, { chatId, userId }) {
      try {
        if (!state.chats[chatId]) {
          const chatData = await $api.get("/chat/byId", {
            params: {
              userId,
              chatId,
            },
          });

          if (chatData.data) {
            commit("saveChats", { [chatId]: chatData.data });
          } else {
            commit("alert/setErrorMessage", `Not fount chat - ${chatId}`, {
              root: true,
            });
          }
        }
        // chatId: chatId.value,
        // page: messagePagination.page,
        // limit: messagePagination.limit,
        // inMemory: messagePagination.inMemory,

        const messagePagination =
          state.chats[chatId]?.loadMessagesPagination ??
          defoultLoadMessagesPagination;

        if (!messagePagination.hasMore) return;

        const messages = await $api.get("message/listPagination", {
          params: {
            chatId,
            page: messagePagination.page,
            limit: messagePagination.limit,
            inMemory: messagePagination.inMemory,
          },
        });

        commit("saveMessages", { chatId, uploadMessagesData: messages.data });
      } catch (e) {
        console.log("e", e);
        commit("alert/setErrorMessage", e.response.data.message, {
          root: true,
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
        if (isDeletedLastMessage) {
          commit("setLastChatMessage", deletedMessageData.roomId);
          commit("sortByMessageDate");
        }
      }
    },
    async getChats({ commit, state }, paginationData) {
      if (!state.loadChatsPagination.hasMore) return;
      console.log("call", { ...state.loadChatsPagination });
      try {
        const res = await $api.get("/chat/listPagination", {
          params: {
            page: state.loadChatsPagination.page,
            limit: state.loadChatsPagination.limit,
            userId: paginationData.userId,
            ...(paginationData.chatId && { chatId: paginationData.chatId }),
          },
        });
        console.log("RES", res);

        commit("saveNewChatsPagination", {
          page: res.data.page,
          hasMore: res.data.hasMore,
          inMemory: res.data.inMemory,
        });
        commit("saveChats", res.data.roomsData);

        if (res.data.currentTempChatData) {
          commit("saveCurrentTempChat", res.data.currentTempChatData);
        }
      } catch (e) {
        commit("alert/setErrorMessage", e.response.data.message, {
          root: true,
        });
      }
    },
    async getChatsByPattern({ commit }, searchData) {
      try {
        const res = await $api.get("/chat/serch", {
          params: {
            userId: searchData.userId,
            pattern: searchData.pattern,
          },
        });

        commit("saveChatsByPattern", res.data);
      } catch (e) {
        commit("alert/setErrorMessage", e.response.data.message, {
          root: true,
        });
      }
    },
    async getFreeChatUsers({ commit }, chatData) {
      try {
        const res = await $api.get("/chat/freeUsers", {
          params: {
            userId: chatData.userId,
            chatId: chatData.chatId,
          },
        });

        commit("saveFreeChatUsers", res.data);
      } catch (e) {
        commit("alert/setErrorMessage", e.response.data.message, {
          root: true,
        });
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
    async createChat({ commit }, chatData) {
      $api
        .post("/chat/create", {
          adminId: chatData.adminId,
          users: chatData.users,
          groupName: chatData?.groupName,
        })
        .then((res) => {
          console.log("res create", res);
          //commit("setChatId", res.data.id);
        })
        .catch((error) => {
          console.log("res error", error);
          // commit("auth/setErrorMessage", error.response.data.message, {
          //   root: true,
          // });
        });
    },
  },
  mutations: {
    saveChats(state, chats) {
      console.log(Object.keys(state.chats), Object.keys(chats));
      state.chats = Object.assign(state.chats, chats);
    },
    saveCurrentTempChat(state, chatData) {
      state.currentTempChatData = chatData;
    },
    saveMessages(state, { chatId, uploadMessagesData }) {
      console.log("test", chatId, uploadMessagesData);

      if (!state.messages[chatId]) state.messages[chatId] = [];

      console.log("!!!!!!!!11", chatId, uploadMessagesData);

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
        roomData.userUnread++;
      }

      roomData.chatUnread++;
    },

    setLastChatMessage(state, roomId) {
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
    addUserToGroup(state, { chatId, userData }) {
      if (!state.chats[chatId]) return;
      state.chats[chatId].users.push(userData);
    },
    deleteChatData(state, chatId) {
      if (state.chats[chatId]) {
        delete state.chats[chatId];
      } else if (state.currentTempChatData.id === chatId) {
        state.currentTempChatData = null;
      }
    },
    updateUserOnline(state, userStatus) {
      Object.keys(state.chats).forEach((chat) => {
        state.chats[chat].users.forEach((user) => {
          if (user.id === userStatus.userId) {
            user.lastOnline = userStatus.status;
          }
        });
      });
    },
    updateReadMessages(state, { chatId, unreadCount }) {
      if (state.chats.hasOwnProperty(chatId)) {
        state.chats[chatId].chatUnread = unreadCount;
      } else if (state.currentTempChatData.id === chatId) {
        state.currentTempChatData.chatUnread = unreadCount;
      }
    },
    setTempPrivateChat(state, chatData) {
      state.tempPrivateChat = chatData;
    },
    saveNewChatsPagination(state, { page, hasMore }) {
      state.loadChatsPagination.page = page;
      state.loadChatsPagination.hasMore = hasMore;
    },
    setDefaultChatsPagination(state) {
      state.loadChatsPagination = { ...defaultLoadChatsPagination };
    },
    saveChatsByPattern(state, chats) {
      state.chatsByPattern = chats;
    },
    clearChatsByPattern(state) {
      state.chatsByPattern = null;
    },
    saveFreeChatUsers(state, freeUsers) {
      state.freeChatUsers = freeUsers;
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
      if (state.chats[chatId]) return state.chats[chatId];
      else if (state.currentTempChatData?.id === chatId)
        return state.currentTempChatData.id;
      else if (state.tempPrivateChat) return state.tempPrivateChat;
      else return null;
    },
    chatList(state) {
      if (state.chatsByPattern) {
        return state.chatsByPattern;
      }
      return state.chats;
    },
    // getRemoveUserList(state, getters, rootState) {
    //   if (!state.chatData.group) return null;
    //   const userId = rootState.auth.user.id;
    //   return state.chatData.group.filter((user) => user.id !== userId);
    // },
  },
};
