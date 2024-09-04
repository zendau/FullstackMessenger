<template>
  <button @click="toggleUserTheme(theme)">
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
import { ref } from "vue";

import { getUserTheme, toggleTheme } from "@/utils/theme";

export default {
  setup() {
    const theme = ref(getUserTheme());

    function toggleUserTheme(value) {
      theme.value = toggleTheme(value);
    }

    return {
      toggleUserTheme,
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
