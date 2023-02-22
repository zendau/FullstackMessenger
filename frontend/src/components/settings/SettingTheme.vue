<template>
  <button @click="toggleTheme">
    <font-awesome-icon
      v-if="theme === 'dark'"
      :title="$t('setting.settingTheme.change')"
      icon="fa-solid fa-moon"
    />
    <font-awesome-icon
      v-else
      :title="$t('setting.settingTheme.change')"
      icon="fa-solid fa-sun"
    />
  </button>
</template>

<script>
import { ref, watch } from "vue";

export default {
  setup() {
    const themes = {
      dark: "dark",
      light: "light",
    };

    const getUserTheme = () => {
      const theme = `${window?.localStorage?.getItem("theme")}`;
      if (Object.values(themes).includes(theme)) return theme;

      const userMedia = window.matchMedia("(prefers-color-scheme: light)");
      if (userMedia.matches) return themes.light;

      return themes.dark;
    };

    const theme = ref(getUserTheme());

    watch(
      theme,
      (themeValue) => {
        document.documentElement.dataset.theme = themeValue;
        localStorage.setItem("theme", themeValue);
      },
      {
        immediate: true,
      }
    );

    const toggleTheme = () => {
      if (theme.value === themes.dark) {
        theme.value = themes.light;
        return;
      }
      if (theme.value === themes.light) {
        theme.value = themes.dark;
        return;
      }
    };

    return {
      toggleTheme,
      theme,
    };
  },
};
</script>

<style lang="scss" scoped>
button {
  border: none;
  background-color: inherit;
}

svg {
  height: 25px;
  width: 25px;
  cursor: pointer;
  color: var(--color-icon);
}
</style>
