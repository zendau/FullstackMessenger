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
    <span class="message__time" :title="messageDate" >
      {{messageTime}}
    </span>
  </div>
</template>

<script>
import { ref } from "vue";
import { isLink } from "./isLink";


export default {
  props: ["message", "author"],
  setup(props) {

    const messageDate = ref(null)
    const messageTime = ref(null)


    function convertDate(date) {
      const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
      const tempDate = new Intl.DateTimeFormat("ru-RU", options)
        .format(Date.parse(date))
        .split(",");

      messageDate.value = tempDate[0]
      messageTime.value = tempDate[1]
    }

    convertDate(props.message.created_at)

    return {
      isLink,
      messageDate,
      messageTime
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