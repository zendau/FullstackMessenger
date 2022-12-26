// eslint-disable-next-line no-unused-vars
import $api from "../../axios";

const defaultPatination = {
  page: 0,
  limit: 6,
  hasMore: true,
};

export const contact = {
  namespaced: true,
  state: {
    contacts: [],
    contactsPagintation: { ...defaultPatination },
    freeUsers: [],
    freeUsersPagintation: {
      ...defaultPatination,
    },
    pendingRequests: [],
    outgoingRequests: [],
    blockedUsers: [],
    users: {},
    error: null,
  },
  actions: {
    async blockUser({ commit }, { userId, contactId }) {
      try {
        const res = await $api.patch("/contact/block", {
          userId,
          contactId,
        });
        commit("blockUser", contactId);
      } catch (e) {
        commit("setError", e.response.data.message);
      }
    },
    async unblockUser({ commit }, { userId, contactId }) {
      try {
        const res = await $api.patch("/contact/unBlock", {
          userId,
          contactId,
        });

        commit("setNewContactStatus", {
          contactId,
          status: "isBanned",
          value: false,
        });
      } catch (e) {
        commit("setError", e.response.data.message);
      }
    },
    async deleteFromContacts({ commit }, { userId, contactId }) {
      try {
        const res = await $api.delete("/contact/delete", {
          data: {
            userId,
            contactId,
          },
        });
        commit("setNewContactStatus", {
          contactId,
          status: "isFriend",
          value: false,
        });
        commit("setNewContactStatus", {
          contactId,
          status: "isConfirmRequest",
          value: true,
        });
      } catch (e) {
        commit("setError", e.response.data.message);
      }
    },
    async addToContacts({ commit }, { userId, contactId }) {
      try {
        const res = await $api.post("/contact/sendRequest", {
          userId,
          contactId,
        });
        commit("setNewContactStatus", {
          contactId,
          status: "isPendingRequest",
          value: true,
        });
      } catch (e) {
        commit("setError", e.response.data.message);
      }
    },
    async cancelOutgoingRequest({ commit }, { userId, contactId }) {
      try {
        const res = await $api.post("/contact/reject", {
          userId,
          contactId,
        });
        commit("setNewContactStatus", {
          contactId,
          status: "isPendingRequest",
          value: false,
        });
      } catch (e) {
        commit("setError", e.response.data.message);
      }
    },
    async confirmContactRequest({ commit }, { userId, contactId }) {
      try {
        const res = await $api.post("/contact/confirm", {
          userId,
          contactId,
        });
        commit("setNewContactStatus", {
          contactId,
          status: "isConfirmRequest",
          value: false,
        });
        commit("setNewContactStatus", {
          contactId,
          status: "isFriend",
          value: true,
        });
      } catch (e) {
        commit("setError", e.response.data.message);
      }
    },
    async cancelPendingRequest({ commit }, { userId, contactId }) {
      try {
        const res = await $api.post("/contact/reject", {
          userId,
          contactId,
        });
        commit("setNewContactStatus", {
          contactId,
          status: "isConfirmRequest",
          value: false,
        });
      } catch (e) {
        commit("setError", e.response.data.message);
      }
    },
    async getContactsList({ commit, state }, { pattern, userId }) {
      try {
        let params = null;

        if (pattern) {
          commit('clearListData', 'contacts')
          params = {
            pattern,
            userId,
          };
        } else {
          if (!state.contactsPagintation.hasMore) return;

          params = {
            userId,
            page: state.contactsPagintation.page,
            limit: state.contactsPagintation.limit,
          };
        }

        const res = await $api.get("/contact/list", {
          params,
        });
        commit("setContacts", res.data);
      } catch (e) {
        commit("setError", e.response.data.message);
      }
    },
    async getFreeUsersList({ commit, state }, userId) {
      try {
        if (!state.freeUsersPagintation.hasMore) return;

        const res = await $api.get("/contact/freeList", {
          params: {
            userId,
            page: state.freeUsersPagintation.page,
            limit: state.freeUsersPagintation.limit,
          },
        });
        commit("setFreeUsers", res.data);
      } catch (e) {
        commit("setError", e.response.data.message);
      }
    },
    async getPendingRequests({ commit }, userId) {
      try {
        const res = await $api.get("/contact/pending", {
          params: {
            userId,
          },
        });
        commit("setPendingRequests", res.data);
      } catch (e) {
        commit("setError", e.response.data.message);
      }
    },
    async getOutgoingRequests({ commit, state }, userId) {
      try {
        const res = await $api.get("/contact/outgoing", {
          params: {
            userId,
          },
        });
        commit("setOutgoingRequests", res.data);
      } catch (e) {
        commit("setError", e.response.data.message);
      }
    },
    async getBlockedUsers({ commit, state }, userId) {
      try {
        if (!state.freeUsersPagintation.hasMore) return;

        const res = await $api.get("/contact/blockedUsers", {
          params: {
            userId,
          },
        });
        commit("setBannedUsersList", res.data);
      } catch (e) {
        commit("setError", e.response.data.message);
      }
    },
  },
  mutations: {
    clearListData(state, field) {
      if (!state[field] && !Array.isArray(state[field])) return;

      state[field] = [];
    },
    setContactData(state, data) {
      state.users[data.id] = data;
    },
    setNewContactStatus(state, { contactId, status, value }) {
      console.log("setNewContactStatus", contactId, status, value);
      if (!state.users[contactId]) return;
      state.users[contactId][status] = value;
    },
    blockUser(state, contactId) {
      if (!state.users[contactId]) return;
      const contactData = state.users[contactId];
      contactData.isBanned = true;
      contactData.isConfirmRequest = false;
      contactData.isConfirmRequest = false;
      contactData.isFriend = false;
      contactData.isPendingRequest = false;
    },
    setError(state, message) {
      state.error = message;
    },
    setContacts(state, data) {
      if (data.resList.length > 0) {
        state.contacts.push(...data.resList);
      }

      state.contactsPagintation.page = data.page;
      state.contactsPagintation.hasMore = data.hasMore;
    },
    setFreeUsers(state, data) {
      if (data.freeUsersList.length > 0) {
        state.freeUsers.push(...data.resList);
      }

      state.freeUsersPagintation.page = data.page;
      state.freeUsersPagintation.hasMore = data.hasMore;
    },
    setPendingRequests(state, data) {
      if (data.length > 0) {
        state.pendingRequests.push(...data.resList);
      }
    },
    setOutgoingRequests(state, data) {
      if (data.length > 0) {
        state.outgoingRequests.push(...data.resList);
      }
    },
    setBannedUsersList(state, data) {
      if (data.length > 0) {
        state.blockedUsers.push(...data.resList);
      }
    },
  },
  getters: {},
};
