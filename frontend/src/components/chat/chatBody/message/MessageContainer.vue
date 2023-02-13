<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    class="message__container"
    :class="{ 'message__container--author': isAuthor, 'message__container--mini': isConferenceChat }"
    @contextmenu="openMessageCTXMenu"
  >
    <input
      v-if="isSelectMessagesMode"
      v-model="selectedMessages"
      :value="checboxData"
      type="checkbox"
      style="width: 25px; height: 25px"
    >
    <p class="message__author">
      {{ message.authorLogin }}
    </p>
    <div class="message__body">
      <p class="message__text">
        <span v-html="isLink(message.text)" />
      </p>
      <i
        v-if="isRead"
        class="bi bi-check-all"
      />
      <i
        v-else
        class="bi bi-check"
      />
      <p v-if="message.isEdited">
        {{ $t("chat.messageContainer.edited") }}
      </p>
      <!-- <a href="#" class="message__link">localhost.com</a> -->
      <div
        v-for="file in message.files"
        :key="file.id"
      >
        <p
          v-if="file.mimetype.includes('image')"
          style="display: flex; justify-content: center"
          @mousedown.right.prevent="null"
        >
          <img
            :src="`http://localhost:4000/storage/${file.foulder.path}/${file.fileTempName}`"
            height="200"
            :alt="file.fileName"
          >
        </p>
        <div v-else>
          <a
            class="message__file"
            :href="getDownloadLink(file.id)"
          >
            <i class="bi bi-file-earmark-arrow-down" />
            <p>{{ file.fileName }}</p>
          </a>
        </div>
      </div>
    </div>
    <span
      class="message__time"
      :title="messageDate"
    >
      {{ messageTime }}
    </span>
  </div>
  <div
    v-if="isFirstUnread"
    style="color: red"
  >
    {{ $t("chat.messageContainer.newMessage") }}
  </div>
</template>

<script>
import { computed, ref, inject, reactive } from "vue";
import isLink from "@/utils/isLink";
import dateFormat from "@/utils/dateFormat";

export default {
  props: {
    message: {
      type: Object,
      required: true,
    },
    isRead: {
      type: Boolean,
      required: true,
    },
    isFirstUnread: {
      type: Boolean,
      required: true,
    },
    userId: {
      type: Number,
      required: true,
    },
  },
  emits: ["open-ctx-menu"],
  setup(props, { emit }) {
    const messageDate = ref(null);
    const messageTime = ref(null);

    const checboxData = reactive({ id: props.message.id, isRead: props.isRead });

    const isConferenceChat = inject("isConferenceChat", false);

    function getDownloadLink(fileId) {
      return `${import.meta.env.VITE_STORAGE}/file/download/${fileId}`;
    }

    function convertDate(date) {
      const tempDate = dateFormat(date, "ru", true).split(",");
      [messageDate.value, messageTime.value] = tempDate;
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

      ctxPosition.x = e.pageX || e.clientX;
      ctxPosition.y = e.pageY || e.clientY;

      if (isSelectMessagesMode.value) {
        return;
      }

      if (isShowMessageCTX.value === props.message.id) {
        isShowMessageCTX.value = null;
      } else {
        isShowMessageCTX.value = props.message.id;
      }
      emit("open-ctx-menu", {
        position: ctxPosition,
        isAuthor: isAuthor.value,
        message: props.message,
        isRead: props.isRead,
      });
    }

    const isShowMessageCTX = inject("isShowMessageCTX");
    const selectedMessages = inject("selectedMessages");
    const isSelectMessagesMode = inject("isSelectMessagesMode");

    const ctxPosition = {
      x: 0,
      y: 0,
    };

    const isAuthor = computed(() => props.message.authorId === props.userId);

    return {
      isConferenceChat,
      checboxData,
      ctxPosition,
      isLink,
      messageDate,
      messageTime,
      getDownloadLink,
      openMessageCTXMenu,
      selectedMessages,
      isSelectMessagesMode,
      isAuthor,
    };
  },
};
</script>

<style lang="scss" scoped>
@mixin message__container--mini {
  width: 100%;
  margin: 6px 0;
  box-sizing: border-box;
}
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

    &--mini {
      @include message__container--mini;
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
      @include message__container--mini;
      &--author {
        align-self: center;
      }
    }
  }
}
</style>
