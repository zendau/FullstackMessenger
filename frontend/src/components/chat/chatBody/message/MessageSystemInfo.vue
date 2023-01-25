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

export default {
  props: {
    messageType: {
      type: String,
      required: true,
    },
    messageText: {
      type: String,
      required: true,
    },
  },
  setup() {
    function getMessageAlert(messageType, messageText) {
      if (messageType === "date") {
        return dateFormat(messageText, "en");
      } else if (messageType === "add") {
        return `Added ${messageText}`;
      } else if (messageType === "remove") {
        return `Deleted ${messageText}`;
      } else if (messageType === "exit") {
        return `Exit ${messageText}`;
      } else if (messageType === "created") {
        return "Created";
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
