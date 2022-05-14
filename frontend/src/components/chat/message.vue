<template>
  <div
    class="message__container"
    :class="author === message.authorLogin ? 'message__container--author' : ''"
  >
    <p class="message__author">{{ message.authorLogin }}</p>
    <div class="message__body">
      <p class="message__text"><span v-html="isLink(message.text)" /></p>
      <!-- <a href="#" class="message__link">localhost.com</a> -->
      <a
        class="message__file"
        v-for="file in message.files"
        :key="file.id"
        :href="`http://localhost:3000/file/download/${file.id}`"
      >
        <i class="bi bi-file-earmark-arrow-down"></i>{{ file.fileName }}</a
      >
    </div>
    <span class="message__time">
      <p v-for="(date, index) in convertDate(message.created_at)" :key="index">
        {{ date }}
      </p>
    </span>
  </div>
</template>

<script>
import { isLink } from "./isLink";

export default {
  props: ["message", "author"],
  setup() {
    function convertDate(date) {
      const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
      return new Intl.DateTimeFormat("ru-RU", options)
        .format(Date.parse(date))
        .split(",");
    }

    return {
      isLink,
      convertDate,
    };
  },
};
</script>

<style lang="scss" scoped>
.message {
  &__container {
    width: 500px;
    align-items: flex-start;
    margin: 5px 10px;
    display: grid;
    grid-template-columns: 1fr 80px;
    align-items: end;
    padding: 7px;
    background-color: $messageColor;
    border-radius: 5px;

    &--author {
      align-self: flex-end;
    }
  }

  &__link,
  &__file {
    color: $activeColor;
  }

  &__author {
    justify-self: start;
    margin-left: 10px;
    color: $activeColor;
    align-self: baseline;
  }

  &__time {
    text-align: center;
    color: $secondTextColor;
  }

  &__text {
    text-align: left;
    color: $textColor;
  }

  &__body {
    grid-row: 2/3;
    grid-column: 1/3;
  }

  &__time {
    grid-column: 2/3;
  }
}

@media (max-width: 960px) {
  .message {
    &__container {
      width: 100%;
      margin: 6px 0;
      box-sizing: border-box;

      &--author {
        align-self: center;
      }
    }
  }
}
</style>