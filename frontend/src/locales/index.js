import { createI18n } from "vue-i18n";

import chat_en from "./chat/en.json";
import chat_ru from "./chat/ru.json";

import ui_en from "./UI/en.json";
import ui_ru from "./UI/ru.json";

import navbar_en from "./navbar/en.json";
import navbar_ru from "./navbar/ru.json";

import conference_en from "./conference/en.json";
import conference_ru from "./conference/ru.json";

import setting_en from "./setting/en.json";
import setting_ru from "./setting/ru.json";

import view_en from "./view/en.json";
import view_ru from "./view/ru.json";

const messages = {
  en: {
    chat: chat_en,
    ui: ui_en,
    navbar: navbar_en,
    conference: conference_en,
    setting: setting_en,
    view: view_en,
  },
  ru: {
    chat: chat_ru,
    ui: ui_ru,
    navbar: navbar_ru,
    conference: conference_ru,
    setting: setting_ru,
    view: view_ru,
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
