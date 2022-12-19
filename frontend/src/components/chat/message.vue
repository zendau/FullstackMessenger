<template>
  <div v-if="isFirstUnread" style="color: red">New message</div>
  <MessageContexMenu
    :isShowCTX="isShowCTX"
    :ctxPosition="ctxPosition"
    :isAuthor="isAuthor"
    :messageId="message.id"
  />
  <div
    @contextmenu="openMessageCTXMenu"
    class="message__container"
    :class="isAuthor ? 'message__container--author' : ''"
    @click="closeMessageCTX"
  >
    <input
      v-model="selectedMessages"
      :value="message.id"
      v-if="isSelectMessagesMode"
      type="checkbox"
      style="width: 25px; height: 25px"
    />

    <p class="message__author">{{ message.authorLogin }}</p>
    <div class="message__body">
      <p class="message__text"><span v-html="isLink(message.text)" /></p>
      <i v-if="isRead" class="bi bi-check-all"></i>
      <i v-else class="bi bi-check"></i>
      <p>is edit {{ message.isEdited }}</p>
      <!-- <a href="#" class="message__link">localhost.com</a> -->
      <div v-for="file in message.files" :key="file.id">
        <p
          style="display: flex; justify-content: center"
          v-if="file.mimetype.includes('image')"
          @mousedown.right.prevent="null"
        >
          <img
            :src="`http://localhost:4000/storage/${file.foulder.path}/${file.fileTempName}`"
            height="200"
            alt=""
          />
        </p>
        <div v-else>
          <a class="message__file" :href="getDownloadLink(file.id)">
            <i class="bi bi-file-earmark-arrow-down" />
            <p>{{ file.fileName }}</p>
          </a>
        </div>
      </div>
    </div>
    <span class="message__time" :title="messageDate">
      {{ messageTime }}
    </span>
  </div>
</template>

<script>
import { computed, ref, inject, reactive } from "vue";
import { isLink } from "./isLink";
import MessageContexMenu from "./messageContextMenu.vue";

export default {
  props: ["message", "author", "isRead", "isFirstUnread", "userId"],
  components: { MessageContexMenu },
  setup(props) {
    const messageDate = ref(null);
    const messageTime = ref(null);

    function getDownloadLink(fileId) {
      return `${import.meta.env.VITE_STORAGE}/download/${fileId}`;
    }

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

      messageDate.value = tempDate[0];
      messageTime.value = tempDate[1];
    }

    convertDate(props.message.created_at);

    function openMessageCTXMenu(e) {
      if (e.target.tagName === "IMG") {
        if (isShowMessageCTX.value === props.message.id) {
          e.preventDefault();
          isShowMessageCTX.value = null;
        }
        return;
      }

      e.preventDefault();

      const rect = e.target.getBoundingClientRect();
      ctxPosition.x = e.pageX || e.clientX;
      ctxPosition.y = e.pageY || e.clientY;
      console.log("TARGET", ctxPosition);
      // ctxPosition.x = Math.round(e.clientX - rect.left);
      //  = Math.round(e.clientY - rect.top);

      if (isSelectMessagesMode.value) {
        return;
      }

      if (isShowMessageCTX.value === props.message.id) {
        isShowMessageCTX.value = null;
      } else {
        isShowMessageCTX.value = props.message.id;
      }
    }

    const isShowMessageCTX = inject("isShowMessageCTX");
    const selectedMessages = inject("selectedMessages");
    const isSelectMessagesMode = inject("isSelectMessagesMode");

    const ctxPosition = reactive({
      x: 0,
      y: 0,
    });

    const isShowCTX = computed(
      () => isShowMessageCTX.value === props.message.id
    );

    const isAuthor = computed(() => props.message.authorId === props.userId);

    function closeMessageCTX() {
      isShowMessageCTX.value = null;
    }

    return {
      isShowCTX,
      ctxPosition,
      isLink,
      messageDate,
      messageTime,
      getDownloadLink,
      openMessageCTXMenu,
      selectedMessages,
      isSelectMessagesMode,
      isAuthor,
      closeMessageCTX,
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
    background-color: var(--messageColor);
    border-radius: 5px;

    &--author {
      align-self: flex-end;
    }
  }

  &__link,
  &__file {
    color: var(--activeColor);
  }

  &__author {
    justify-self: start;
    margin-left: 10px;
    color: var(--activeColor);
    align-self: baseline;
  }

  &__time {
    text-align: center;
    color: var(--secondTextColor);
  }

  &__text {
    text-align: left;
    color: var(--textColor);
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
