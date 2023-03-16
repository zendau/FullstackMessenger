import $api from "@/axios";
import { insertUsersList } from "./users.module";

const defaultPatination = {
  page: 0,
  limit: 8,
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
    contactStatutes: {},
    error: null,
  },
  actions: {
    async blockUser({ commit }, contactId) {
      try {
        await $api.patch("/contact/block", {
          contactId,
        });
        commit("blockUser", contactId);
      } catch (e) {
        commit("setError", e.response.data.message);
      }
    },
    async unblockUser({ commit }, contactId) {
      try {
        await $api.patch("/contact/unBlock", {
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
    async deleteFromContacts({ commit }, contactId) {
      try {
        await $api.delete("/contact/delete", {
          params: {
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
    async addToContacts({ commit }, contactId) {
      try {
        await $api.post("/contact/sendRequest", {
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
    async cancelOutgoingRequest({ commit }, contactId) {
      try {
        await $api.post("/contact/reject", {
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
    async confirmContactRequest({ commit }, contactId) {
      try {
        await $api.post("/contact/confirm", {
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
          contactId,
        });
        commit("setNewContactStatus", {
          contactId: userId,
          status: "isConfirmRequest",
          value: false,
        });
      } catch (e) {
        commit("setError", e.response.data.message);
      }
    },
    async getContactCount({ commit }) {
      try {
        const res = await $api.get("contact/getContactCount");
        commit("setContactsCount", res.data);
      } catch (e) {
        commit("setError", e.response.data.message);
      }
    },
    async getContactStatutesData({ commit }, contactId) {
      try {
        const res = await $api.get(`/contact/contactData`, {
          params: {
            contactId,
          },
        });
        commit("setContactStatutesData", { contactId, data: res.data });
      } catch (e) {
        commit("setError", e.response.data.message);
      }
    },
    async getContactsList({ commit, state }, pattern) {
      try {
        let params = null;

        if (pattern) {
          commit("clearListData", "contacts");
          params = {
            pattern,
          };
        } else {
          if (!state.contactsPagintation.hasMore) return;

          params = {
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
    async getFreeUsersList({ commit, state }, pattern) {
      try {
        let params = null;

        if (pattern) {
          commit("clearListData", "freeUsers");
          params = {
            pattern,
          };
        } else {
          params = {
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
    async getPendingRequests({ commit }, pattern) {
      try {
        let params = null;

        if (pattern) {
          commit("clearListData", "pendingRequests");
          params = {
            pattern,
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
    async getOutgoingRequests({ commit }, pattern) {
      try {
        let params = null;

        if (pattern) {
          commit("clearListData", "outgoingRequests");
          params = {
            pattern,
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
    async getBlockedUsers({ commit }, pattern) {
      try {
        let params = null;

        if (pattern) {
          commit("clearListData", "blockedUsers");
          params = {
            pattern,
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
    setContactStatutesData(state, { contactId, data }) {
      state.contactStatutes[contactId] = data;
    },
    setNewContactStatus(state, { contactId, status, value }) {
      if (!state.contactStatutes[contactId]) return;
      state.contactStatutes[contactId][status] = value;
    },
    blockUser(state, contactId) {
      if (!state.contactStatutes[contactId]) return;
      const contactData = state.contactStatutes[contactId];
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
      // eslint-disable-next-line no-debugger
      debugger;
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
      // eslint-disable-next-line no-debugger
      debugger;
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

          if (state.contactStatutes[statusData.userData.id]) {
            state.contactStatutes[
              statusData.userData.id
            ].isConfirmRequest = true;
          }

          break;
        case "PendingAccept":
          delete state.outgoingRequests[statusData.userData.id];
          state.contacts[statusData.userData.id] = statusData.userData;
          state.contactsCount.contacts++;
          state.contactsCount.outgoingRequests--;
          state.contactStatutes[
            statusData.userData.id
          ].isPendingRequest = false;

          if (state.contactStatutes[statusData.userData.id]) {
            state.contactStatutes[statusData.userData.id].isFriend = true;
          }

          break;
        case "PendingReject":
          delete state.outgoingRequests[statusData.userData.id];
          state.freeUsers[statusData.userData.id] = statusData.userData;
          state.contactsCount.outgoingRequests--;

          if (state.contactStatutes[statusData.userData.id]) {
            state.contactStatutes[
              statusData.userData.id
            ].isPendingRequest = false;
          }

          break;
        case "OutgointCancel":
          delete state.pendingRequests[statusData.userData.id];
          state.freeUsers[statusData.userData.id] = statusData.userData;
          state.contactsCount.pendingRequests--;

          if (state.contactStatutes[statusData.userData.id]) {
            state.contactStatutes[
              statusData.userData.id
            ].isConfirmRequest = false;
          }

          break;
        case "DeleteContact":
          delete state.contacts[statusData.userData.id];
          state.outgoingRequests[statusData.userData.id] = statusData.userData;
          state.contactsCount.contacts--;
          state.contactsCount.outgoingRequests++;

          if (state.contactStatutes[statusData.userData.id]) {
            state.contactStatutes[
              statusData.userData.id
            ].isPendingRequest = true;
            state.contactStatutes[statusData.userData.id].isFriend = false;
          }

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

          if (state.contactStatutes[statusData.userData.id]) {
            state.contactStatutes[
              statusData.userData.id
            ].isBannedByContact = true;
          }

          break;

        case "UnBlockUser":
          state.freeUsers[statusData.userData.id] = statusData.userData;

          if (state.contactStatutes[statusData.userData.id]) {
            state.contactStatutes[
              statusData.userData.id
            ].isBannedByContact = false;
          }

          break;

        default:
          break;
      }
    },
  },
};
