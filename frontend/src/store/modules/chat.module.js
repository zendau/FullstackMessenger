import $api from "@/axios";
import router from "@/router";
import { insertUsersList } from "./users.module";

import i18n from "@/locales/index";
const { t: $t } = i18n.global;

const defaultLoadChatsPagination = {
  page: 0,
  limit: 6,
  hasMore: true,
  inMemory: true,
};

const defoultLoadMessagesPagination = {
  page: 0,
  limit: 20,
  hasMore: true,
  inMemory: true,
};

export const chat = {
  namespaced: true,
  state: {
    chats: new Map(),
    chatsByPattern: null,
    currentTempChatData: null,
    messages: {},
    tempPrivateChat: null,
    loadChatsPagination: { ...defaultLoadChatsPagination },
    freeChatUsers: {},
  },
  actions: {
    async newChatMessage({ commit, state, getters }, { messagesData, userId }) {
      try {
        console.log("resieve message", messagesData);

        if (!state.chats.has(messagesData.roomId)) {
          const res = await $api.get("/chat/byId", {
            params: {
              userId,
              chatId: messagesData.roomId,
            },
          });

          commit("saveChat", res.data);
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
        console.log("e", e);
        commit("alert/setErrorMessage", e.response.data.message, {
          root: true,
        });
      }
    },
    async getChatMessages({ commit, state }, { chatId, userId }) {
      try {
        if (!state.chats.has(chatId)) {
          const chatData = await $api.get("/chat/byId", {
            params: {
              userId,
              chatId,
            },
          });

          if (chatData.data) {
            commit("saveChat", chatData.data);
          } else {
            commit(
              "alert/setErrorMessage",
              $t("store.chat.notFoundChat", chatId),
              {
                root: true,
              }
            );
          }
        }

        const messagePagination =
          state.chats.get(chatId)?.loadMessagesPagination ??
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
      if (
        Object.prototype.hasOwnProperty.call(
          state.messages,
          updatedMessageData.roomId
        )
      ) {
        commit("updateMessage", updatedMessageData);
      }
    },
    deletedMessages({ commit, state }, deletedMessageData) {
      console.log("updateDeletedMessages", deletedMessageData);
      if (state.messages[deletedMessageData.roomId]) {
        commit("deletedMessages", deletedMessageData);

        const isDeletedLastMessage = deletedMessageData.deletedData.find(
          (item) => {
            return (
              item.id ===
              state.chats.get(deletedMessageData.roomId)?.lastMessage.id
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
            inMemory: state.loadChatsPagination.inMemory,
            ...(paginationData.chatId && { chatId: paginationData.chatId }),
          },
        });
        console.log("RES", res);

        const chatsList = JSON.parse(res.data.roomsData);

        for (const chat of chatsList) {
          chat[1].users = insertUsersList(chat[1].users);
        }

        commit("saveNewChatsPagination", {
          page: res.data.page,
          hasMore: res.data.hasMore,
          inMemory: res.data.inMemory,
        });
        commit("saveChats", chatsList);
        commit("sortByMessageDate");

        if (res.data.currentTempChatData) {
          commit("saveCurrentTempChat", res.data.currentTempChatData);
        }
      } catch (e) {
        console.log("e", e);
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
        console.log("e", e);
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
            users: chatData.users,
          },
        });

        res.data = insertUsersList(Object.values(res.data));

        commit("saveFreeChatUsers", res.data);
      } catch (e) {
        commit("alert/setErrorMessage", e.response.data.message, {
          root: true,
        });
      }
    },
    async deleteFromChat({ commit, getters, rootState }, deleteData) {
      try {
        const chatData = getters.selectedChat(deleteData.userData.chatId);

        if (!chatData) {
          commit("alert/setErrorMessage", $t("store.chat.deleteError"), {
            root: true,
          });
          return;
        }

        delete chatData.users[deleteData.deletedUserInfo];
        if (deleteData.deletedUserInfo !== rootState.auth.user.id) return;

        commit("deleteChatData", deleteData.userData.chatId);
        commit("clearChatMessages", deleteData.userData.chatId);
        router.push("/chat");
      } catch (e) {
        commit("alert/setErrorMessage", e.response.data.message, {
          root: true,
        });
      }
    },
    async getChatById({ commit }, { userId, chatId }) {
      const chatData = await $api.get("/chat/byId", {
        params: {
          userId,
          chatId,
        },
      });

      if (chatData.data) {
        commit("saveChat", chatData.data);
      } else {
        commit("alert/setErrorMessage", $t("store.chat.notFoundChat", chatId), {
          root: true,
        });
      }
    },
    async getPrivateChatId({ commit }, { userId, contactData, openChat }) {
      try {
        const res = await $api.get("/chat/checkPrivate", {
          params: {
            userId,
            contactId: contactData.id,
          },
        });
        if (res.data) {
          console.log("res", res.data);
          openChat(res.data);
        } else {
          openChat("contact");
          commit("setTempPrivateChat", {
            id: contactData.id,
            title: contactData.login,
            lastOnline: contactData.lastOnline,
          });
        }
      } catch (e) {
        console.log("e", e);
        commit("alert/setErrorMessage", e.response.data.message, {
          root: true,
        });
      }
    },
  },
  mutations: {
    saveChat(state, chat) {
      state.chats.set(chat.id, chat);
    },
    saveChats(state, chats) {
      const newChats = new Map(chats);
      state.chats = new Map([...state.chats, ...newChats]);
    },
    saveCurrentTempChat(state, chatData) {
      state.currentTempChatData = chatData;
    },
    saveMessages(state, { chatId, uploadMessagesData }) {
      console.log("test", chatId, uploadMessagesData);

      if (!state.messages[chatId]) state.messages[chatId] = [];

      console.log("!!!!!!!!11", chatId, uploadMessagesData);

      state.messages[chatId].push(...uploadMessagesData.messages);
      state.chats.get(chatId).loadMessagesPagination = {
        page: uploadMessagesData.page,
        limit: uploadMessagesData.limit,
        hasMore: uploadMessagesData.hasMore,
        inMemory: uploadMessagesData.inMemory,
      };
    },
    clearTempData(state) {
      console.log("CLEART TEMP");
      state.currentTempChatData = null;
      state.tempPrivateChat = null;
      state.freeChatUsers = {};
    },
    clearChatMessages(state, chatId) {
      state.messages[chatId] = [];
    },
    sortByMessageDate(state) {
      const sortedMessagesByDate = [...state.chats.keys()]
        .sort((a, b) => {
          const dateA = new Date(
            state.chats.get(a)?.lastMessage?.created_at || null
          ).getTime();
          const dateB = new Date(
            state.chats.get(b)?.lastMessage?.created_at || null
          ).getTime();

          return dateA < dateB ? 1 : dateA === dateB ? 0 : -1;
        })
        .reduce((obj, key) => {
          obj.set(key, state.chats.get(key));
          return obj;
        }, new Map());

      state.chats = sortedMessagesByDate;
    },

    setNewMessageData(state, { messagesData, userId, roomData }) {
      if (state.messages[messagesData.roomId]) {
        state.messages[messagesData.roomId].unshift(messagesData);
      } else {
        state.messages[messagesData.roomId] = [messagesData];
      }

      if (
        !roomData ||
        (messagesData.type !== undefined && messagesData.type !== "text")
      )
        return;

      if (messagesData.authorId !== userId) {
        roomData.userUnread++;
      }

      roomData.chatUnread++;
    },

    setLastChatMessage(state, roomId) {
      const messages = state.messages[roomId];
      if (!messages) return [];

      const [lastMessage] = messages;
      state.chats.get(roomId).lastMessage = lastMessage;
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
      if (!state.chats.has(chatId)) return;
      state.chats.get(chatId).users[userData.id] = userData;
    },
    deleteChatData(state, chatId) {
      if (state.chats.has(chatId)) {
        state.chats.delete(chatId);
      } else if (state.currentTempChatData.id === chatId) {
        state.currentTempChatData = null;
      }
    },
    updateReadMessages(state, { chatId, unreadCount }) {
      console.log("QQWW", chatId, unreadCount);
      if (state.chats.has(chatId)) {
        state.chats.get(chatId).chatUnread = unreadCount;
      } else if (state.currentTempChatData?.id === chatId) {
        state.currentTempChatData.chatUnread = unreadCount;
      }
    },
    setTempPrivateChat(state, chatData) {
      console.log("SET TEMP DATA");
      state.tempPrivateChat = chatData;
    },
    saveNewChatsPagination(state, { page, hasMore, inMemory }) {
      state.loadChatsPagination.page = page;
      state.loadChatsPagination.hasMore = hasMore;
      state.loadChatsPagination.inMemory = inMemory;
    },
    setDefaultChatsPagination(state) {
      state.loadChatsPagination = { ...defaultLoadChatsPagination };
    },
    saveChatsByPattern(state, chats) {
      state.chatsByPattern = new Map(chats);
    },
    clearChatsByPattern(state) {
      state.chatsByPattern = null;
    },
    saveFreeChatUsers(state, freeUsers) {
      state.freeChatUsers = freeUsers;
    },
    updateFreeChatUsers(state, withoutId) {
      console.log("CAASD");
      const a = Object.entries(state.freeChatUsers);
      const b = a.filter((userData) => userData[1].id !== withoutId);

      const c = Object.fromEntries(b);
      state.freeChatUsers = c;
    },
    pushFreeChatUsers(state, userData) {
      state.freeChatUsers[userData.id] = userData;
    },
  },
  getters: {
    selectedChat: (state) => (chatId) => {
      if (state.chats.has(chatId)) return state.chats.get(chatId);
      else if (state.currentTempChatData?.id === chatId)
        return state.currentTempChatData;
      else if (state.tempPrivateChat) return state.tempPrivateChat;
      else return null;
    },
    chatList(state) {
      if (state.chatsByPattern) {
        return state.chatsByPattern;
      }
      return state.chats;
    },
  },
};
