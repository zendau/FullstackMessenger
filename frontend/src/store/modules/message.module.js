import $api from "@/axios";

const defoultLoadMessagesPagination = {
  page: 0,
  limit: 20,
  hasMore: true,
  inMemory: true,
};

const getDefaultState = () => ({
  isLoading: false,
  list: {},
});

export const message = {
  namespaced: true,
  state: getDefaultState(),
  actions: {
    async newChatMessage(
      { commit, rootGetters, dispatch },
      { messagesData, userId }
    ) {
      try {
        await dispatch(
          "chat/getChatById",
          {
            chatId: messagesData.roomId,
          },
          {
            root: true,
          }
        );

        commit("setNewMessageData", {
          messagesData,
          userId,
          roomData: rootGetters["chat/selectedChat"](messagesData.roomId),
        });

        commit("chat/setLastChatMessage", messagesData, { root: true });
        commit("chat/sortByMessageDate", null, { root: true });
      } catch (e) {
        commit("alert/setErrorMessage", e.response.data.message, {
          root: true,
        });
      }
    },
    async getChatMessages({ commit, dispatch, rootState }, chatId) {
      try {
        commit("setIsloadingStatus", true);

        await dispatch(
          "chat/getChatById",
          {
            chatId,
          },
          {
            root: true,
          }
        );

        const { chats } = rootState.chat;

        const messagePagination =
          chats.get(chatId)?.loadMessagesPagination ??
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

        const chatMessagesData = { chatId, uploadMessagesData: messages.data };

        commit("saveMessages", chatMessagesData);
        commit("chat/saveMessagesPagination", chatMessagesData, { root: true });

        commit("setIsloadingStatus", false);
      } catch (e) {
        commit("alert/setErrorMessage", e.response.data.message, {
          root: true,
        });
      }
    },
    editChatMesssage({ commit, state }, updatedMessageData) {
      if (
        Object.prototype.hasOwnProperty.call(
          state.list,
          updatedMessageData.roomId
        )
      ) {
        commit("updateMessage", updatedMessageData);
      }
    },
    deletedMessages({ commit, state, rootGetters }, deletedMessageData) {
      if (state.list[deletedMessageData.roomId]) {
        commit("deletedMessages", deletedMessageData);

        const lastMessage = rootGetters["chat/lastMessage"](
          deletedMessageData.roomId
        );

        if (!lastMessage) return;

        const isDeletedLastMessage = deletedMessageData.deletedData.find(
          (item) => {
            return item.id === lastMessage.id;
          }
        );
        if (isDeletedLastMessage) {
          commit("chat/setLastChatMessage", deletedMessageData, { root: true });
          commit("chat/sortByMessageDate", null, { root: true });
        }
      }
    },
  },
  mutations: {
    saveMessages(state, { chatId, uploadMessagesData }) {
      if (!state.list[chatId]) state.list[chatId] = [];

      state.list[chatId].push(...uploadMessagesData.messages);
    },
    clearChatMessages(state, chatId) {
      state.list[chatId] = [];
    },
    setNewMessageData(state, { messagesData, userId, roomData }) {
      if (state.list[messagesData.roomId]) {
        state.list[messagesData.roomId].unshift(messagesData);
      } else {
        state.list[messagesData.roomId] = [messagesData];
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
    updateMessage(state, updatedMessageData) {
      state.list[updatedMessageData.roomId] = state.list[
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
      state.list[deletedMessagesData.roomId] = state.list[
        deletedMessagesData.roomId
      ].filter(
        (message) =>
          !deletedMessagesData.deletedData.find(
            (item) => item.id === message.id
          )
      );
    },
    setIsloadingStatus(state, status) {
      state.isLoading = status;
    },
  },
};
