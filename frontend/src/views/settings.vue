<template>
  <user-info />
  <language />
  <theme />
</template>

<script>
import userInfo from "../components/settings/userInfo.vue";
import language from "../components/settings/language.vue";
import theme from "../components/settings/theme.vue";

export default {
  components: { userInfo, language, theme },
};
</script>

<style></style>
