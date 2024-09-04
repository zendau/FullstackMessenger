<template>
  <div class="message__info">
    {{ getMessageAlert(messageType, messageText) }}
  </div>
</template>

<script>
import { useI18n } from "vue-i18n";

export default {
  props: {
    messageType: {
      type: String,
      required: true,
    },
    messageText: {
      type: String,
      default: "",
    },
  },
  setup() {
    const { t, d } = useI18n();

    function getMessageAlert(messageType, messageText) {
      if (messageType === "date") {
        return d(new Date(messageText), "short");
      } else if (messageType === "add") {
        return `${t("chat.messageSystemInfo.added")} ${messageText}`;
      } else if (messageType === "remove") {
        return `${t("chat.messageSystemInfo.deleted")} ${messageText}`;
      } else if (messageType === "exit") {
        return `${t("chat.messageSystemInfo.exit")} ${messageText}`;
      } else if (messageType === "created") {
        return t("chat.messageSystemInfo.created");
      } else {
        return;
      }
    }

    return {
      getMessageAlert,
    };
  },
};
</script>

<style>
.message__info {
  width: 130px;
  align-self: center;
  color: var(--color-primary);
  display: flex;
  justify-content: center;
  margin: 5px 10px;
  padding: 10px;
  background-color: var(--color-message);
  border-radius: 5px;
  text-align: center;
}
</style>
