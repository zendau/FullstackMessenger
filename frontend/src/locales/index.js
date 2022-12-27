import { createI18n } from "vue-i18n";

import chat_en from "./chat/en.json";
import chat_ru from "./chat/ru.json";

const messages = {
  en: {
    chat: chat_en,
  },
  ru: {
    chat: chat_ru,
  },
};

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: "ru",
  fallbackLocale: "en",
  messages,
});

export default i18n;
