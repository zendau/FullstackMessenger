import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./style.css";
// import 'bootstrap'
// import 'bootstrap/dist/css/bootstrap.min.css'
import i18n from "./locales";
createApp(App).use(store).use(router).use(i18n).mount("#app");
