import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./style.css";

import { library } from "@fortawesome/fontawesome-svg-core";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faGlobe,
  faPenToSquare,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  faEdge,
  faInternetExplorer,
  faChrome,
  faSafari,
  faFirefox,
  faOpera,
  faYandex,
  faAndroid,
  faApple,
} from "@fortawesome/free-brands-svg-icons";

library.add(
  faAndroid,
  faApple,
  faGlobe,
  faEdge,
  faInternetExplorer,
  faChrome,
  faSafari,
  faFirefox,
  faOpera,
  faYandex,
  faPenToSquare,
  faXmark
);

// import 'bootstrap'
// import 'bootstrap/dist/css/bootstrap.min.css'
import i18n from "./locales";
createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(store)
  .use(router)
  .use(i18n)
  .mount("#app");
