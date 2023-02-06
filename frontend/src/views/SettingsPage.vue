<template>
  <account />
  <language />
  <theme />
  <devices />
</template>

<script>
import account from "@/components/settings/settingAccount/SettingAccount.vue";
import language from "@/components/settings/SettingLanguage.vue";
import theme from "@/components/settings/SettingTheme.vue";
import devices from "@/components/settings/SettingDevices.vue";

export default {
  components: { account, language, theme, devices },
};
</script>

<style></style>
