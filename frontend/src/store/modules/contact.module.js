import $api from "@/axios";
import { insertUsersList } from "./users.module";

const defaultPatination = {
  page: 0,
  limit: 6,
  hasMore: true,
};

export const contact = {
  namespaced: true,
  state: {
    contacts: {},
    contactsPagintation: { ...defaultPatination },
    freeUsers: {},
    freeUsersPagintation: {
      ...defaultPatination,
    },
    pendingRequests: {},
    outgoingRequests: {},
    blockedUsers: {},
    contactsCount: {},
    users: {},
    error: null,
  },
  actions: {
    async blockUser({ commit }, { userId, contactId }) {
      try {
        await $api.patch("/contact/block", {
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
        await $api.patch("/contact/unBlock", {
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
        await $api.delete("/contact/delete", {
          params: {
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
        await $api.post("/contact/sendRequest", {
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
        await $api.post("/contact/reject", {
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
        await $api.post("/contact/confirm", {
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
        await $api.post("/contact/reject", {
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
    async getContactCount({ commit }, userId) {
      try {
        const res = await $api.get(`/contact/getContactCount/${userId}`);
        commit("setContactsCount", res.data);
      } catch (e) {
        commit("setError", e.response.data.message);
      }
    },
    async getContactData({ commit }, { userId, contactId }) {
      try {
        const res = await $api.get(`/contact/contactData`, {
          params: {
            userId,
            contactId,
          },
        });
        commit("setContactData", res.data);
      } catch (e) {
        commit("setError", e.response.data.message);
      }
    },
    async getContactsList({ commit, state }, { pattern, userId }) {
      try {
        let params = null;

        if (pattern) {
          commit("clearListData", "contacts");
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

        res.data.resList = insertUsersList(Object.values(res.data.resList));

        commit("setContacts", res.data);
      } catch (e) {
        console.log("e", e);
        commit("setError", e.response.data.message);
      }
    },
    async getFreeUsersList({ commit, state }, { userId, pattern }) {
      try {
        let params = null;

        if (pattern) {
          commit("clearListData", "freeUsers");
          params = {
            pattern,
            userId,
          };
        } else {
          params = {
            userId,
            page: state.freeUsersPagintation.page,
            limit: state.freeUsersPagintation.limit,
          };
        }

        if (!state.freeUsersPagintation.hasMore) return;

        const res = await $api.get("/contact/freeList", {
          params,
        });

        res.data.resList = insertUsersList(Object.values(res.data.resList));

        commit("setFreeUsers", res.data);
      } catch (e) {
        console.log("e", e);
        commit("setError", e.response.data.message);
      }
    },
    async getPendingRequests({ commit }, { userId, pattern }) {
      try {
        let params = null;

        if (pattern) {
          commit("clearListData", "pendingRequests");
          params = {
            pattern,
            userId,
          };
        } else {
          params = {
            userId,
          };
        }

        const res = await $api.get("/contact/pending", {
          params,
        });

        res.data.resList = insertUsersList(Object.values(res.data.resList));
        commit("setPendingRequests", res.data);
      } catch (e) {
        commit("setError", e.response.data.message);
      }
    },
    async getOutgoingRequests({ commit }, { userId, pattern }) {
      try {
        let params = null;

        if (pattern) {
          commit("clearListData", "outgoingRequests");
          params = {
            pattern,
            userId,
          };
        } else {
          params = {
            userId,
          };
        }

        const res = await $api.get("/contact/outgoing", {
          params,
        });

        res.data.resList = insertUsersList(Object.values(res.data.resList));
        commit("setOutgoingRequests", res.data);
      } catch (e) {
        commit("setError", e.response.data.message);
      }
    },
    async getBlockedUsers({ commit }, { userId, pattern }) {
      try {
        let params = null;

        if (pattern) {
          commit("clearListData", "blockedUsers");
          params = {
            pattern,
            userId,
          };
        } else {
          params = {
            userId,
          };
        }

        const res = await $api.get("/contact/blockedUsers", {
          params,
        });

        res.data.resList = insertUsersList(Object.values(res.data.resList));
        commit("setBannedUsersList", res.data);
      } catch (e) {
        commit("setError", e.response.data.message);
      }
    },
  },
  mutations: {
    clearListData(state, field) {
      if (typeof state[field] !== "object") return;

      state[field] = {};
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
      if (Object.keys(data.resList).length > 0) {
        Object.assign(state.contacts, data.resList);
      }

      state.contactsPagintation.page = data.page;
      state.contactsPagintation.hasMore = data.hasMore;
    },
    setFreeUsers(state, data) {
      if (Object.keys(data.resList).length > 0) {
        Object.assign(state.freeUsers, data.resList);
      }

      state.freeUsersPagintation.page = data.page;
      state.freeUsersPagintation.hasMore = data.hasMore;
    },
    setPendingRequests(state, data) {
      if (Object.keys(data.resList).length > 0) {
        Object.assign(state.pendingRequests, data.resList);
      }
    },
    setOutgoingRequests(state, data) {
      if (Object.keys(data.resList).length > 0) {
        Object.assign(state.outgoingRequests, data.resList);
      }
    },
    setBannedUsersList(state, data) {
      if (Object.keys(data.resList).length > 0) {
        Object.assign(state.blockedUsers, data.resList);
      }
    },
    setContactsCount(state, countData) {
      state.contactsCount = countData;
    },
    changeUserStatus(state, statusData) {
      console.log("test", statusData);
      switch (statusData.operation) {
        case "AddContact": {
          const contactData = state.freeUsers[statusData.contactId];
          delete state.freeUsers[statusData.contactId];
          state.outgoingRequests[statusData.contactId] = contactData;
          state.contactsCount.outgoingRequests++;
          break;
        }
        case "PendingAccept": {
          const contactData = state.pendingRequests[statusData.contactId];
          delete state.pendingRequests[statusData.contactId];
          state.contacts[statusData.contactId] = contactData;
          state.contactsCount.contacts++;
          state.contactsCount.pendingRequests--;
          break;
        }

        case "PendingReject": {
          const contactData = state.pendingRequests[statusData.contactId];
          delete state.pendingRequests[statusData.contactId];
          state.freeUsers[statusData.contactId] = contactData;
          state.contactsCount.pendingRequests--;
          break;
        }

        case "OutgointCancel": {
          const contactData = state.outgoingRequests[statusData.contactId];
          delete state.outgoingRequests[statusData.contactId];
          state.freeUsers[statusData.contactId] = contactData;
          state.contactsCount.outgoingRequests--;
          break;
        }
        case "DeleteContact": {
          const contactData = state.contacts[statusData.contactId];
          delete state.contacts[statusData.contactId];
          state.pendingRequests[statusData.contactId] = contactData;
          state.contactsCount.contacts--;
          state.contactsCount.pendingRequests++;
          break;
        }

        case "BlockUser": {
          let contactData = null;
          if (state.contacts[statusData.contactId]) {
            contactData = state.contacts[statusData.contactId];
            delete state.contacts[statusData.contactId];
            state.contactsCount.contacts--;
          } else if (state.freeUsers[statusData.contactId]) {
            contactData = state.freeUsers[statusData.contactId];
            delete state.freeUsers[statusData.contactId];
          } else if (state.pendingRequests[statusData.contactId]) {
            contactData = state.pendingRequests[statusData.contactId];
            delete state.pendingRequests[statusData.contactId];
            state.contactsCount.pendingRequests--;
          } else if (state.outgoingRequests[statusData.contactId]) {
            contactData = state.outgoingRequests[statusData.contactId];
            delete state.outgoingRequests[statusData.contactId];
            state.contactsCount.outgoingRequests--;
          }
          state.contactsCount.blockedUsers++;
          state.blockedUsers[statusData.contactId] = contactData;
          break;
        }

        case "UnBlockUser": {
          if (!state.blockedUsers[statusData.contactId]) break;
          const contactData = state.blockedUsers[statusData.contactId];
          delete state.blockedUsers[statusData.contactId];
          state.contactsCount.blockedUsers--;

          state.freeUsers[statusData.contactId] = contactData;
          break;
        }

        default:
          break;
      }
    },
    changeContactStatus(state, statusData) {
      console.log("test", statusData);
      switch (statusData.operation) {
        case "AddContact":
          delete state.freeUsers[statusData.userData.id];
          state.pendingRequests[statusData.userData.id] = statusData.userData;
          state.contactsCount.pendingRequests++;
          state.users[statusData.userData.id].isConfirmRequest = true;
          break;
        case "PendingAccept":
          delete state.outgoingRequests[statusData.userData.id];
          state.contacts[statusData.userData.id] = statusData.userData;
          state.contactsCount.contacts++;
          state.contactsCount.outgoingRequests--;
          state.users[statusData.userData.id].isPendingRequest = false;
          state.users[statusData.userData.id].isFriend = true;
          break;
        case "PendingReject":
          delete state.outgoingRequests[statusData.userData.id];
          state.freeUsers[statusData.userData.id] = statusData.userData;
          state.contactsCount.outgoingRequests--;
          state.users[statusData.userData.id].isPendingRequest = false;
          break;
        case "OutgointCancel":
          delete state.pendingRequests[statusData.userData.id];
          state.freeUsers[statusData.userData.id] = statusData.userData;
          state.contactsCount.pendingRequests--;
          state.users[statusData.userData.id].isConfirmRequest = false;
          break;
        case "DeleteContact":
          delete state.contacts[statusData.userData.id];
          state.outgoingRequests[statusData.userData.id] = statusData.userData;
          state.contactsCount.contacts--;
          state.contactsCount.outgoingRequests++;
          state.users[statusData.userData.id].isPendingRequest = true;
          state.users[statusData.userData.id].isFriend = false;
          break;
        case "BlockUser":
          if (state.contacts[statusData.userData.id]) {
            delete state.contacts[statusData.userData.id];
            state.contactsCount.contacts--;
          } else if (state.freeUsers[statusData.userData.id]) {
            delete state.freeUsers[statusData.userData.id];
          } else if (state.pendingRequests[statusData.userData.id]) {
            delete state.pendingRequests[statusData.userData.id];
            state.contactsCount.pendingRequests--;
          } else if (state.outgoingRequests[statusData.userData.id]) {
            delete state.outgoingRequests[statusData.userData.id];
            state.contactsCount.outgoingRequests--;
          }
          state.users[statusData.userData.id].isBannedByContact = true;

          break;

        case "UnBlockUser":
          state.freeUsers[statusData.userData.id] = statusData.userData;
          state.users[statusData.userData.id].isBannedByContact = false;
          break;

        default:
          break;
      }
    },
    updateUserOnline(state, userStatus) {
      if (state.contacts[userStatus.userId]) {
        state.contacts[userStatus.userId].lastOnline = userStatus.status;
        state.contacts[userStatus.userId].peerId = userStatus.peerId;
      }

      if (state.freeUsers[userStatus.userId]) {
        state.freeUsers[userStatus.userId].lastOnline = userStatus.status;
        state.freeUsers[userStatus.userId].peerId = userStatus.peerId;
      }

      if (state.pendingRequests[userStatus.userId]) {
        state.pendingRequests[userStatus.userId].lastOnline = userStatus.status;
        state.pendingRequests[userStatus.userId].peerId = userStatus.peerId;
      }

      if (state.outgoingRequests[userStatus.userId]) {
        state.outgoingRequests[userStatus.userId].lastOnline =
          userStatus.status;
        state.outgoingRequests[userStatus.userId].peerId = userStatus.peerId;
      }

      if (state.blockedUsers[userStatus.userId]) {
        state.blockedUsers[userStatus.userId].lastOnline = userStatus.status;
        state.blockedUsers[userStatus.userId].peerId = userStatus.peerId;
      }

      if (state.users[userStatus.userId]) {
        state.users[userStatus.userId].lastOnline = userStatus.status;
        state.users[userStatus.userId].peerId = userStatus.peerId;
      }
    },
  },
};
