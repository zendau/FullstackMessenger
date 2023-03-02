<template>
  <Navbar />
  <div class="setting-container">
    <SettingLanguage />
    <SettingTheme />
  </div>
  <section class="user__container">
    <slot />
  </section>
</template>

<script>
import Navbar from "@/components/navbar/MainNavbar.vue";
import SettingLanguage from "@/components/settings/SettingLanguage.vue";
import SettingTheme from "@/components/settings/SettingTheme.vue";

export default {
  components: { Navbar, SettingLanguage, SettingTheme },
};
</script>

<style lang="scss" scoped>
body {
  background-color: var(--color-background-secondary);
}

.setting-container {
  width: 150px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  position: absolute;
  right: 10px;
}

:deep(.nav__menu) {
  justify-content: center;
}
</style>
