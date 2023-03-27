import debounce from "@/utils/debounce";
import i18n from "@/locales/index";
const { t: $t } = i18n.global;

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
    hotClearAlert: (state) => {
      state.text = "";
      state.type = null;
    },
    clearAlert: debounce((state) => {
      state.text = "";
      state.type = null;
    }, 4000),
    setErrorMessage(state, text) {
      if (text === "Unauthorized") return;

      if (Array.isArray(text)) {
        state.text = $t(text[0], text[1]);
      } else if (typeof text === "string") {
        state.text = $t(text);
      } else if (text.message) {
        state.text = $t(text.message);
      }
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
