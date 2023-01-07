import $api from "../../axios";
import jwt_decode from "jwt-decode";

import router from "../../router";

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
  },
  actions: {
    async login({ commit }, loginData) {
      try {
        const resData = await $api.post("/user/login", {
          email: loginData.email,
          password: loginData.password,
        });

        const accessToken = resData.data.accessToken;
        const tokenDecode = jwt_decode(accessToken);
        commit("authSuccess", tokenDecode);
        localStorage.setItem("token", accessToken);
        router.push("/users");
      } catch (e) {
        debugger;
        const message = e.response.data;
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
          "New password was send to your email",
          {
            root: true,
          }
        );
      } catch (e) {
        const message = e.response.data.message;
        commit("alert/setErrorMessage", message, {
          root: true,
        });
      }
    },
    async changeUserData({ commit }, userData) {
      try {
        await $api.patch("/user/editData", {
          id: userData.id,
          email: userData.email,
          newEmail: userData.newEmail,
          login: userData.login,
          password: userData.password,
          confirmPassword: userData.confirmPassword,
          confirmCode: userData.confirmCode,
        });

        commit("alert/setSuccessMessage", "Your data was updated", {
          root: true,
        });
        commit("updateData", userData);
      } catch (e) {
        const message = e.response.data.message;
        commit("alert/setErrorMessage", message, {
          root: true,
        });
      }
    },
    async logout({ commit }) {
      localStorage.removeItem("token");
      const resData = await $api.get("/user/logout");
      console.log(resData);
      commit("logout");
      router.push("/");
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

        const accessToken = resData.data.accessToken;
        const tokenDecode = jwt_decode(accessToken);
        commit("authSuccess", tokenDecode);
        localStorage.setItem("token", accessToken);
        router.push("/users");
      } catch (e) {
        const message = e.response.data;
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
    async checkAuth({ commit }) {
      console.log("checkAuth");
      // TODO: Return jwt request
      //   const accessToken = localStorage.getItem("token");
      //   let tokenDecode = null;

      //   try {
      //     tokenDecode = jwt_decode(accessToken);
      //   } catch {
      //     const resRefresh = await $api.get("/user/refresh");

      //     if (resRefresh.data.statusCode === 401) return;

      //     const accessToken = resRefresh.data.accessToken;
      //     localStorage.setItem("token", accessToken);
      //     tokenDecode = jwt_decode(accessToken);
      //   } finally {
      //     if (tokenDecode !== null) {
      //       commit("authSuccess", tokenDecode);
      //     }
      //   }
      const userData = JSON.parse(localStorage.getItem("userData"));
      console.log("userData", userData);
      commit("authSuccess", {
        id: userData.id,
        email: userData.email,
        login: userData.login,
        role: userData.role,
        isBanned: userData.isBanned,
        deviceId: userData.deviceId,
      });
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
      console.log("auth success", userData);
      state.user = {
        id: userData.id,
        email: userData.email,
        login: userData.login,
        role: userData.role,
        isBanned: userData.isBanned,
        deviceId: userData.deviceId,
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
      state.user = {
        id: null,
        email: null,
        role: [],
      };
      state.authStatus = false;
    },
    saveDivicesData(state, diveces) {
      state.devices = diveces;
    },

    deleteDivicesData(state, devicesIdList) {
      console.log(
        "devicesIdList",
        devicesIdList,
        state.devices,
        Array.isArray(state.devices)
      );
      state.devices = state.devices.filter((device) => {
        console.log(
          devicesIdList.includes(device.id),
          devicesIdList,
          device.id
        );
        return !devicesIdList.includes(device.id);
      });
      console.log("RES", state.devices);
    },
  },
  getters: {
    getUserContactData(state) {
      return {
        email: state.user.email,
        id: state.user.id,
        lastOnline: "online",
        login: state.user.login,
      };
    },
  },
};
