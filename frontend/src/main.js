import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./style.css";
import { setLocale } from "yup";

import { library } from "@fortawesome/fontawesome-svg-core";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faGlobe,
  faPenToSquare,
  faXmark,
  faMagnifyingGlass,
  faUser,
  faUserGroup,
  faCheck,
  faCheckDouble,
  faFile,
  faPaperPlane,
  faCommentDots,
  faAddressBook,
  faPhone,
  faGear,
  faRightFromBracket,
  faMicrophone,
  faMicrophoneSlash,
  faVideo,
  faVideoSlash,
  faDisplay,
  faCircleStop,
  faCircleXmark,
  faRecordVinyl,
  faCopy,
  faCircleCheck,
  faTrash,
  faPhoneVolume,
  faEnvelope,
  faInfo,
  faMoon,
  faSun,
  faHand,
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
  faXmark,
  faMagnifyingGlass,
  faUser,
  faUserGroup,
  faCheck,
  faCheckDouble,
  faFile,
  faPaperPlane,
  faCommentDots,
  faAddressBook,
  faPhone,
  faGear,
  faRightFromBracket,
  faMicrophone,
  faMicrophoneSlash,
  faVideo,
  faVideoSlash,
  faDisplay,
  faCircleStop,
  faCircleXmark,
  faRecordVinyl,
  faCopy,
  faPenToSquare,
  faCircleCheck,
  faTrash,
  faPhoneVolume,
  faEnvelope,
  faInfo,
  faSun,
  faMoon,
  faHand
);

import i18n from "./locales";
const $t = i18n.global.t;

setLocale({
  mixed: {
    required: ({ label }) => ({ key: $t("yup.mixed.required", { label }) }),
  },
  string: {
    min: ({ min, label }) => ({ key: $t("yup.string.min", { min, label }) }),
    email: $t("yup.string.email"),
  },
});

createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(store)
  .use(router)
  .use(i18n)
  .mount("#app");
