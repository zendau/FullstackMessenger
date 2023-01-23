<template>
  <button @click="toggleTheme">
    Change theme
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
    };
  },
};
</script>

<style></style>
