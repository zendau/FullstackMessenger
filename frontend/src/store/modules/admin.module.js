import $api from "@/axios";

const defaultLoadUsersPagination = {
  page: 0,
  limit: 20,
  hasMore: true,
};

export const admin = {
  namespaced: true,
  state: {
    userList: {},
    rolesList: [],
    loadUsersPagination: { ...defaultLoadUsersPagination },
  },
  actions: {
    async getRolesList({ commit }) {
      try {
        const res = await $api.get("/admin/rolesList");

        commit("saveRoles", res.data);
      } catch (e) {
        commit("alert/setErrorMessage", e.response.data.message, {
          root: true,
        });
      }
    },
    async getUsersListPagination({ commit, state }, userId) {
      if (!state.loadUsersPagination.hasMore) return;
      try {
        const res = await $api.get("/admin/list", {
          params: {
            page: state.loadUsersPagination.page,
            limit: state.loadUsersPagination.limit,
            userId: userId,
          },
        });

        commit("saveNewUsersPagination", {
          page: res.data.page,
          hasMore: res.data.hasMore,
        });
        commit("saveUsers", res.data.resList);
      } catch (e) {
        commit("alert/setErrorMessage", e.response.data.message, {
          root: true,
        });
      }
    },
    async setUserRole({ commit }, { userId, role }) {
      try {
        await $api.patch("/admin/setRole", {
          userId,
          role,
        });

        commit("updateUserRole", { userId, role });
      } catch (e) {
        commit("alert/setErrorMessage", e.response.data.message, {
          root: true,
        });
      }
    },
    async blockUser({ commit }, userId) {
      try {
        await $api.patch(`/admin/blockUser/${userId}`);

        commit("updateBlockedStatus", { userId, status: 1 });
      } catch (e) {
        commit("alert/setErrorMessage", e.response.data.message, {
          root: true,
        });
      }
    },
    async unBlockUser({ commit }, userId) {
      try {
        await $api.patch(`/admin/unblockUser/${userId}`);

        commit("updateBlockedStatus", { userId, status: 0 });
      } catch (e) {
        commit("alert/setErrorMessage", e.response.data.message, {
          root: true,
        });
      }
    },
  },
  mutations: {
    saveUsers(state, paginationUsers) {
      state.userList = Object.assign(state.userList, paginationUsers);
    },
    saveNewUsersPagination(state, { page, hasMore }) {
      state.loadUsersPagination.page = page;
      state.loadUsersPagination.hasMore = hasMore;
    },
    saveRoles(state, rolesList) {
      state.rolesList = rolesList;
    },
    updateUserRole(state, { userId, role }) {
      if (Object.prototype.hasOwnProperty.call(state.userList, userId)) {
        state.userList[userId].role = role;
      }
    },
    updateBlockedStatus(state, { userId, status }) {
      if (Object.prototype.hasOwnProperty.call(state.userList, userId)) {
        state.userList[userId].isBanned = status;
      }
    },
  },
};
