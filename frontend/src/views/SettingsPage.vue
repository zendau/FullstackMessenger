<template>
  <section class="setting__container">
    <account />
    <hr class="user__hr">
    <h2 class="user__title">
      {{ $t("setting.settingPage.select") }}
    </h2>
    <language />
    <theme />
    <devices />
  </section>
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

<style lang="scss" scoped>
.setting {
  &__container {
    width: 600px;
    background-color: var(--color-background);
    margin: 50px auto;
    display: flex;
    flex-direction: column;
    color: var(--color-primary);
    border-radius: 3px;
    padding: 30px 0;
    height: fit-content;
  }
}

@media (max-width: 720px) {
  .setting {
    &__container {
      width: auto;
      margin: 10px;
      padding: 30px 5px;
    }
  }
}
</style>
