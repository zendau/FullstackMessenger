<template>
  <h1 style="color: white;">
    {{ t("chat.hello") }}
  </h1>
  <ul style="color: white;">
    <li
      v-for="item in availableLocales"
      :key="item"
      style="cursor: pointer;"
      @click="changeLocale(item)"
    >
      {{ item }}
    </li>
  </ul>
</template>

<script>
import { useI18n } from "vue-i18n";

export default {
  setup() {
    const { t, locale, availableLocales } = useI18n();

    const changeLocale = (lang) => {
      locale.value = lang;
    };

    return {
      t,
      locale,
      availableLocales,
      changeLocale,
    };
  },
};
</script>

<style></style>
