<template>
  <select
    v-model="locale"
    @change="changeLocale"
  >
    <option disabled>
      {{ $t("setting.settingLanguage.select") }}
    </option>
    <option
      v-for="item in availableLocales"
      :key="item"
    >
      {{ item }}
    </option>
  </select>
</template>

<script>
import { useI18n } from "vue-i18n";

export default {
  setup() {
    const { locale, availableLocales } = useI18n();

    const changeLocale = (e) => {
      localStorage.setItem("locale", e.target.value);
    };

    return {
      locale,
      availableLocales,
      changeLocale,
    };
  },
};
</script>

<style lang="scss" scoped>
select {
  color: var(--color-secondary);
  background-color: var(--input-background);
  height: 40px;
  border: none;
  font-size: 16px;
  box-sizing: border-box;
  padding: 6px;
  margin: 10px auto;
  border-radius: 5px;
  width: 50%;
}
</style>
