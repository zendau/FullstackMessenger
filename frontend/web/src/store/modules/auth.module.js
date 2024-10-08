import $api from "@/axios";
import jwt_decode from "jwt-decode";

import router from "@/router";

import i18n from "@/locales/index";
const { t: $t } = i18n.global;

export const auth = {
  namespaced: true,
  state: {
    user: {
      id: null,
      email: null,
      login: null,
      role: null,
      isBanned: null,
      deviceId: null,
    },
    devices: [],
    authStatus: false,
    isConfirmCode: false,
  },
  actions: {
    async login({ commit }, loginData) {
      try {
        const resData = await $api.post("/user/login", {
          email: loginData.email,
          password: loginData.password,
        });

        const { accessToken } = resData.data;

        setAccessToken(commit, accessToken, true);

        router.push("/chat");
      } catch (e) {
        const message = e.response?.data ?? e.message;
        commit("alert/setErrorMessage", message, {
          root: true,
        });
      }
    },
    async checkEmail({ commit }, { email, isFind }) {
      try {
        const resData = await $api.post("/user/checkEmail", {
          email,
        });

        const { find, message } = resData.data;
        if (find === isFind) {
          commit("setIsConfirmCode", true);
        } else {
          commit("alert/setErrorMessage", message, {
            root: true,
          });
        }
      } catch (e) {
        const { message } = e.response.data;
        commit("alert/setErrorMessage", message, {
          root: true,
        });
      }
    },
    async resetPassword({ commit }, resetData) {
      try {
        await $api.patch("/user/resetPassword", {
          email: resetData.email,
          confirmCode: resetData.confirmCode,
        });

        commit(
          "alert/setSuccessMessage",
          $t("store.auth.newPassword", { email: resetData.email }),
          {
            root: true,
          }
        );
        router.push("/login");
      } catch (e) {
        const { message } = e.response.data;
        commit("alert/setErrorMessage", message, {
          root: true,
        });
      }
    },
    async changeUserData({ commit }, userData) {
      try {
        const resData = await $api.patch("/user/editData", userData);

        commit("alert/setSuccessMessage", $t("store.auth.updatedData"), {
          root: true,
        });

        const { accessToken } = resData.data;
        localStorage.setItem("token", accessToken);
        commit("updateData", userData);
      } catch (e) {
        const { message } = e.response.data;
        commit("alert/setErrorMessage", message, {
          root: true,
        });
      }
    },
    async logout({ commit }) {
      commit("logout");
      await $api.get("/user/logout");
    },
    async register({ commit }, registerData) {
      try {
        const resData = await $api.post("/user/register", {
          email: registerData.email,
          login: registerData.login,
          password: registerData.password,
          confirmPassword: registerData.confirmPassword,
          confirmCode: registerData.confirmCode,
        });

        const { accessToken } = resData.data;

        setAccessToken(commit, accessToken, true);

        router.push("/chat");
      } catch (e) {
        const message = e.response?.data ?? e.message;
        commit("alert/setErrorMessage", message, {
          root: true,
        });
      }
    },
    async confirmCode({ commit }, email) {
      try {
        await $api.post("/user/setConfirmCode", {
          email,
        });
      } catch (e) {
        const message = e.response.data;
        commit("alert/setErrorMessage", message, {
          root: true,
        });
      }
    },
    async initAuth({ commit }) {
      const accessToken = localStorage.getItem("token");
      if (!accessToken) return;

      setAccessToken(commit, accessToken, false);
      try {
        const res = await $api.get("/user/refresh");

        const { accessToken } = res.data;

        if (!accessToken) throw Error;

        setAccessToken(commit, accessToken, true);
      } catch (e) {
        commit("logout");
        const message = e.response?.data ?? e.message;
        commit("alert/setErrorMessage", message, {
          root: true,
        });
      }
    },
    async getUserDevices({ commit, state }) {
      try {
        const devicesData = await $api.get(
          `/user/getDevicesData/${state.user.id}`
        );
        commit("saveDivicesData", devicesData.data);
      } catch (e) {
        const message = e.response.data;
        commit("alert/setErrorMessage", message, {
          root: true,
        });
      }
    },
    async deleteDevices({ commit }, devicesIdList) {
      try {
        // TODO: Request to api
        // const devicesData = await $api.get(
        //   `/user/getDevicesData/${state.user.id}`
        // );
        commit("deleteDivicesData", devicesIdList);
      } catch (e) {
        // const message = e.response.data;
        const message = "error";
        commit("alert/setErrorMessage", message, {
          root: true,
        });
      }
    },
  },
  mutations: {
    authSuccess(state, userData) {
      state.user = {
        id: userData.id,
        email: userData.email,
        login: userData.login,
        role: userData.role,
        isBanned: userData.isBanned,
        deviceId: userData.deviceId,
        info: userData.info,
      };
      state.authStatus = true;
    },
    updateData(state, newData) {
      const updateData = {
        ...(newData.newEmail
          ? { email: newData.newEmail }
          : { email: state.user.email }),
        ...(newData.login
          ? { login: newData.login }
          : { login: state.user.login }),
      };

      state.user.email = updateData.email;
      state.user.login = updateData.login;
    },
    logout(state) {
      localStorage.removeItem("token");
      state.user = {
        id: 0,
        email: null,
        login: null,
        role: null,
        isBanned: null,
        deviceId: null,
      };
      state.devices = [];
      state.authStatus = false;
      state.isConfirmCode = false;
      router.push("/");
    },
    saveDivicesData(state, diveces) {
      state.devices = diveces;
    },

    deleteDivicesData(state, devicesIdList) {
      state.devices = state.devices.filter((device) => {
        return !devicesIdList.includes(device.id);
      });
    },
    setIsConfirmCode(state, status) {
      state.isConfirmCode = status;
    },
  },
  getters: {
    getUserContactData(state) {
      return {
        email: state.user.email,
        id: state.user.id,
        info: state.user.info,
        lastOnline: $t("store.user.online"),
        login: state.user.login,
        role: state.user.role,
      };
    },
  },
};

function setAccessToken(commit, accessToken, isNew) {
  if (isNew) {
    localStorage.setItem("token", accessToken);
  }

  const decodeToken = jwt_decode(accessToken);
  commit("authSuccess", decodeToken);
}
