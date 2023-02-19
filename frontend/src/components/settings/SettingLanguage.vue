<template>
  <ul style="color: var(--color-primary)">
    <li
      v-for="item in availableLocales"
      :key="item"
      style="cursor: pointer; width: 40px; height: 40px; background-color: var(--button-chat-hover); margin: 5px"
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
    const { locale, availableLocales } = useI18n();

    const changeLocale = (lang) => {
      locale.value = lang;
    };

    return {
      locale,
      availableLocales,
      changeLocale,
    };
  },
};
</script>

<style></style>
