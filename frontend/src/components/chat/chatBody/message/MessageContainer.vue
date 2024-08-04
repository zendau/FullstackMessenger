<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    class="message__container"
    :class="{ 'message__container--author': isAuthor, 'message__container--mini': isConferenceChat }"
    @contextmenu="openMessageCTXMenu"
  >
    <label
      v-if="isSelectMessagesMode"
      class="message__select"
    >
      <input
        v-model="selectedMessages"
        :value="checboxData"
        type="checkbox"
      >
    </label>

    <p class="message__author">
      {{ message.authorLogin }}
    </p>
    <div class="message__body">
      <p class="message__text">
        <span v-html="isLink(message.text)" />
      </p>
      <ul class="message__files-container">
        <li
          v-for="file in message.files"
          :key="file.id"
          class="message__file-item"
        >
          <a
            v-if="file.mimetype.includes('image')"
            target="_blank"
            :href="`${storageURL}/storage/${file.foulder.path}/${file.fileTempName}`"
          >
            <img
              :src="`${storageURL}/storage/${file.foulder.path}/${file.fileTempName}`"
              :alt="file.fileName"
              @mousedown.right.prevent="null"
            >
          </a>

          <video
            v-else-if="file.mimetype.includes('video')"
            controls
            :src="`${storageURL}/storage/${file.foulder.path}/${file.fileTempName}`"
          />

          <template v-else>
            <a
              class="message__file"
              :href="getDownloadLink(file.id)"
            >
              <font-awesome-icon icon="fa-solid fa-file" />
              <p>{{ file.fileName }}</p>
              <span>{{ formatBytes(file.size) }}</span>
            </a>
          </template>
        </li>
      </ul>
    </div>
    <font-awesome-icon
      v-if="isRead"
      class="message__is-read"
      icon="fa-solid fa-check-double"
    />
    <font-awesome-icon
      v-else
      class="message__is-read"
      icon="fa-solid fa-check"
    />
    <p
      v-if="message.isEdited"
      class="message__edited"
    >
      {{ $t("chat.messageContainer.edited") }}
    </p>
    <span
      class="message__time"
      :title="messageDate"
    >
      {{ messageTime }}
    </span>
  </div>
  <div
    v-if="isFirstUnread"
    class="message__unread"
  >
    {{ $t("chat.messageContainer.newMessage") }}
  </div>
</template>

<script>
import { computed, ref, inject, reactive } from "vue";
import isLink from "@/utils/isLink";
import { useI18n } from "vue-i18n";

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

    const storageURL = import.meta.env.VITE_STORAGE;

    const { d } = useI18n();

    const checboxData = reactive({ id: props.message.id, isRead: props.isRead });

    const isConferenceChat = inject("isConferenceChat", false);

    function getDownloadLink(fileId) {
      return `${import.meta.env.VITE_STORAGE}/file/download/${fileId}`;
    }

    function convertDate(date) {
      const tempDate = d(date, "long").split(",");

      if (tempDate.length === 3) {
        messageDate.value = `${tempDate[0]}, ${tempDate[1]}`;
      } else {
        [messageDate.value] = tempDate;
      }
      messageTime.value = tempDate.at(-1);
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

    function formatBytes(bytes, decimals = 2) {
      if (!+bytes) return "0 Bytes";

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    }

    const isAuthor = computed(() => props.message.authorId === props.userId);

    function toFullScreen(e) {
      const media = e.target;

      if (!media) return;

      if (media.requestFullscreen) {
        media.requestFullscreen();
      } else if (media.mozRequestFullScreen) {
        media.mozRequestFullScreen();
      } else if (media.webkitRequestFullscreen) {
        media.webkitRequestFullscreen();
      } else if (media.msRequestFullscreen) {
        media.msRequestFullscreen();
      }
      console.log("e", e);
    }

    return {
      toFullScreen,
      formatBytes,
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
      storageURL,
    };
  },
};
</script>

<style>
.message__link {
  color: var(--color-links-active);
  text-decoration: none;
}
</style>

<style lang="scss" scoped>
img {
  width: 100%;
}

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
    grid-template-columns: 1fr 70px 80px 40px;
    align-items: end;
    padding: 7px;
    background-color: var(--color-message);
    border-radius: 5px;
    gap: 2px;
    position: relative;

    video {
      width: 100%;
    }

    &:has(label input:checked) {
      background-color: var(--button-chat-hover);
    }

    &--author {
      align-self: flex-end;
    }

    &--mini {
      @include message__container--mini;
    }
  }

  &__select {
    position: absolute;
    width: 100%;
    height: 100%;

    input {
      display: none;
    }
  }

  &__unread {
    color: var(--color-danger);
  }

  &__files-container {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    justify-content: space-around;
    margin-top: 7px;
  }

  &__file-item {
    margin: 5px;
  }

  &__file {
    color: var(--color-links-active);
  }

  &__file {
    display: grid;
    grid-template-columns: 50px 1fr;
    grid-template-rows: 1fr 1fr;
    align-items: center;
    justify-items: center;
    width: fit-content;
    font-size: 16px;
    text-decoration: none;

    svg {
      grid-column: 1/1;
      grid-row: 1/3;
      height: 28px;
      width: 28px;
      color: var(--button-primary);
    }

    span {
      font-size: 14px;
      color: var(--color-icon);
    }
  }

  &__author {
    justify-self: start;
    margin-left: 10px;
    color: var(--color-links);
    align-self: baseline;
  }

  &__time {
    text-align: center;
    color: var(--color-secondary);
    grid-column: 3/4;
    grid-row: 1/2;
  }

  &__text {
    text-align: left;
    color: var(--color-primary);
  }

  &__edited {
    grid-column: 2/3;
    grid-row: 1/2;
    text-align: center;
    color: var(--color-secondary);
    font-size: 14px;
  }

  &__body {
    grid-row: 2/3;
    grid-column: 1/5;
  }

  &__is-read {
    justify-self: center;
    align-self: end;
    color: var(--color-links);
    grid-row: 1/2;
    grid-column: 4/5;
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
