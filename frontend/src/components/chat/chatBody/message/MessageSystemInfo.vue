<template>
  <div
    style="
      width: 100px;
      align-self: center;
      color: white;
      display: flex;
      justify-content: center;
      margin: 5px 10px;
      padding: 10px;
      background-color: var(--messageColor);
      border-radius: 5px;
      text-align: center;
    "
  >
    {{ getMessageAlert(messageType, messageText) }}
  </div>
</template>

<script>
import dateFormat from "@/utils/dateFormat";
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
    const { t } = useI18n();

    function getMessageAlert(messageType, messageText) {
      if (messageType === "date") {
        return dateFormat(messageText, "en");
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

<style></style>
