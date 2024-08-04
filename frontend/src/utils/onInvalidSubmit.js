import store from "@/store/index";

export default function onInvalidSubmit({ errors }) {
  const errorMessage = Object.values(errors)
    .map((error) => `<span>${error.key ?? error}</span>`)
    .join("");
  store.commit("alert/setErrorMessage", errorMessage);
}
