import debounce from "../../utils/debounce";

const alertTypes = {
  success: "success",
  danger: "danger",
};

export const alert = {
  namespaced: true,
  state: {
    text: "",
    type: null,
  },
  mutations: {
    clearAlert: debounce((state) => {
      state.text = "";
      state.type = null;
    }, 4000),
    setErrorMessage(state, text) {
      let message = null;
      if (typeof text === "string") {
        message = text;
      } else if (text.message) {
        message = text.message;
      } else {
        message = text[0];
      }

      state.text = message;
      state.type = alertTypes.danger;

      this.commit("alert/clearAlert");
    },
    setSuccessMessage(state, text) {
      state.text = text;
      state.type = alertTypes.success;

      this.commit("alert/clearAlert");
    },
  },
};
