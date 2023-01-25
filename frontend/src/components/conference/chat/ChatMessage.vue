<!-- eslint-disable vue/no-v-html -->
<template>
  <li class="chat__message">
    <h4>{{ message.authorLogin }}</h4>
    <div class="message__body">
      <p v-html="isLink(message.text)" />
      <div class="message__files">
        <a
          v-for="file in message.files"
          :key="file.id"
          class="message__file"
          :href="`${import.meta.env.VUE_APP_API}/file/download/${file.id}`"
        >
          <i class="bi bi-file-earmark-arrow-down" />{{ file.fileName }}
        </a>
      </div>
    </div>
    <span>{{ messageTime }}</span>
  </li>
</template>

<script>
import { ref } from "vue";
import isLink from "@/utils/isLink";

export default {
  props: {
    message: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const messageDate = ref(null);
    const messageTime = ref(null);

    function convertDate(date) {
      const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
      const tempDate = new Intl.DateTimeFormat("ru-RU", options).format(Date.parse(date)).split(",");

      [messageDate.value, messageTime.value] = tempDate;
    }

    convertDate(props.message.created_at);

    return {
      isLink,
      messageDate,
      messageTime,
    };
  },
};
</script>

<style lang="scss" scoped>
.chat__message {
  display: grid;
  grid-template-columns: 1fr 30px;
  grid-template-rows: 25px 1fr;
  margin: 0 7px 7px;
  background-color: var(--messageColor);
  padding: 6px;
  border-radius: 5px;

  h4 {
    max-width: 100px;
    grid-column: 1/2;
    color: var(--activeColor);
  }

  span {
    align-self: flex-end;
    max-width: 50px;
    grid-column: 2/3;
    justify-self: end;
    color: var(--secondTextColor);
  }
}

.message {
  &__body {
    grid-row: 2/3;
    grid-column: 1/3;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    padding: 5px;
    justify-content: flex-start;
    box-sizing: border-box;

    p {
      text-align: justify;
      grid-row: 2/3;
      grid-column: 1/3;
      color: var(--textColor);
      margin-right: 15px;
    }
  }

  &__link,
  &__file {
    color: var(--activeColor);
  }

  &__file {
    margin-bottom: 4px;
  }

  &__files {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
  }
}
</style>
