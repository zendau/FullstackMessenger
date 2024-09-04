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

const getDefaultState = () => ({
  isLoading: false,
  chats: new Map(),
  chatsByPattern: null,
  currentTempChatData: null,
  tempPrivateChat: null,
  loadChatsPagination: { ...defaultLoadChatsPagination },
  freeChatUsers: {},
});

export const chat = {
  namespaced: true,
  state: getDefaultState(),
  actions: {
    async getChats({ commit, state }, paginationData) {
      if (!state.loadChatsPagination.hasMore) return;
      try {
        const res = await $api.get("/chat/listPagination", {
          params: {
            page: state.loadChatsPagination.page,
            limit: state.loadChatsPagination.limit,
            inMemory: state.loadChatsPagination.inMemory,
            ...(paginationData?.chatId && { chatId: paginationData.chatId }),
          },
        });

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
    async getChatsByPattern({ commit }, pattern) {
      try {
        const res = await $api.get("/chat/serch", {
          params: {
            pattern,
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
        commit("message/clearChatMessages", deleteData.userData.chatId, {
          root: true,
        });
        router.push("/chat");
      } catch (e) {
        commit("alert/setErrorMessage", e.response.data.message, {
          root: true,
        });
      }
    },
    async getChatById({ commit, state }, { chatId }) {
      if (state.chats.has(chatId)) return;

      const chatData = await $api.get("/chat/byId", {
        params: {
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
    async getPrivateChatId({ commit }, { contactData, openChat }) {
      try {
        const res = await $api.get("/chat/checkPrivate", {
          params: {
            contactId: contactData.id,
          },
        });
        if (res.data) {
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
    saveMessagesPagination(state, { chatId, uploadMessagesData }) {
      if (!state.chats.has(chatId)) return;

      state.chats.get(chatId).loadMessagesPagination = {
        page: uploadMessagesData.page,
        limit: uploadMessagesData.limit,
        hasMore: uploadMessagesData.hasMore,
        inMemory: uploadMessagesData.inMemory,
      };
    },
    clearTempData(state) {
      state.currentTempChatData = null;
      state.tempPrivateChat = null;
      state.freeChatUsers = {};
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
    setLastChatMessage(state, message) {
      if (!state.chats.has(message.roomId)) return;

      state.chats.get(message.roomId).lastMessage = message;
    },
    addUserToGroup(state, { chatId, userData }) {
      if (!state.chats.has(chatId)) return;
      state.chats.get(chatId).users[userData.id] = userData;
    },
    deleteChatData(state, chatId) {
      if (state.chats.has(chatId)) {
        state.chats.delete(chatId);
      } else if (state.currentTempChatData?.id === chatId) {
        state.currentTempChatData = null;
      }
    },
    updateReadMessages(state, { chatId, unreadCount }) {
      if (state.chats.has(chatId)) {
        state.chats.get(chatId).chatUnread = unreadCount;
      } else if (state.currentTempChatData?.id === chatId) {
        state.currentTempChatData.chatUnread = unreadCount;
      }
    },
    setTempPrivateChat(state, chatData) {
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
      const a = Object.entries(state.freeChatUsers);
      const b = a.filter((userData) => userData[1].id !== withoutId);

      const c = Object.fromEntries(b);
      state.freeChatUsers = c;
    },
    pushFreeChatUsers(state, userData) {
      state.freeChatUsers[userData.id] = userData;
    },
    $reset(state) {
      Object.assign(state, getDefaultState());
    },
    setIsloadingStatus(state, status) {
      state.isLoading = status;
    },
  },
  getters: {
    lastMessage: (state) => (chatId) => {
      if (!state.chats.has(chatId)) return null;

      return state.chats.get(chatId)?.lastMessage;
    },
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
