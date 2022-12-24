// eslint-disable-next-line no-unused-vars
import $api from "../../axios";

export const contact = {
  namespaced: true,
  state: {
    contacts: {},
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
  },
  mutations: {
    setContactData(state, data) {
      state.contacts[data.id] = data;
    },
    setNewContactStatus(state, { contactId, status, value }) {
      console.log("setNewContactStatus", contactId, status, value);
      if (!state.contacts[contactId]) return;
      state.contacts[contactId][status] = value;
    },
    blockUser(state, contactId) {
      if (!state.contacts[contactId]) return;
      const contactData = state.contacts[contactId];
      contactData.isBanned = true;
      contactData.isConfirmRequest = false;
      contactData.isConfirmRequest = false;
      contactData.isFriend = false;
      contactData.isPendingRequest = false;
    },
    setError(state, message) {
      state.error = message;
    },
  },
  getters: {},
};
