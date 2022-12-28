<template>
  <account />
  <language />
  <theme />
  <devices />
</template>

<script>
import account from "../components/settings/account.vue";
import language from "../components/settings/language.vue";
import theme from "../components/settings/theme.vue";
import devices from "../components/settings/devices.vue";

export default {
  components: { account, language, theme, devices },
};
</script>

<style></style>
