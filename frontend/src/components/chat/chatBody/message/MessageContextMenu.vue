<template>
  <ModalWindow
    :is-show-c-t-x="isShowCTX"
    @close-context="closeCTX"
  >
    <ul
      ref="context"
      class="msg-context__container"
      :style="{
        left: position.x + 'px',
        top: position.y + 'px',
      }"
    >
      <li
        class="msg-context__item"
        @click="copyText"
      >
        <font-awesome-icon icon="fa-solid fa-copy" />
        <p>{{ $t("chat.messageContextMenu.copy") }}</p>
      </li>
      <li
        v-if="ctxMenuData.isAuthor"
        class="msg-context__item"
        @click="editMessage"
      >
        <font-awesome-icon icon="fa-solid fa-pen-to-square" />
        <p>{{ $t("chat.messageContextMenu.edit") }}</p>
      </li>
      <li
        class="msg-context__item"
        @click="selectMessageHandler"
      >
        <font-awesome-icon icon="fa-solid fa-circle-check" />
        <p>{{ $t("chat.messageContextMenu.select") }}</p>
      </li>
      <li
        class="msg-context__item"
        @click="deleteMessage"
      >
        <font-awesome-icon icon="fa-solid fa-trash" />
        <p>{{ $t("chat.messageContextMenu.delete") }}</p>
      </li>
    </ul>
  </ModalWindow>
</template>

<script>
import { inject, computed, ref, onUpdated, reactive } from "vue";
import ModalWindow from "@/components/UI/ModalWindow.vue";

export default {
  components: { ModalWindow },
  props: {
    ctxMenuData: {
      type: Object,
      required: true,
    },
  },
  emits: ["delete-messages"],
  setup(props, { emit }) {
    const isSelectMessagesMode = inject("isSelectMessagesMode");
    const selectedMessages = inject("selectedMessages");
    const editMessageData = inject("editMessageData");
    const isShowMessageCTX = inject("isShowMessageCTX");
    const position = reactive({ x: 0, y: 0 });

    onUpdated(() => {
      const el = context.value?.getBoundingClientRect();

      if (!el) return;

      if (props.ctxMenuData.position.y < window.innerHeight - el.height) {
        position.y = props.ctxMenuData.position.y;
      } else {
        position.y = props.ctxMenuData.position.y - el.height;
      }

      if (props.ctxMenuData.position.x < window.innerWidth - el.width) {
        position.x = props.ctxMenuData.position.x;
      } else {
        position.x = props.ctxMenuData.position.x - el.width;
      }
    });

    const context = ref(null);

    const isShowCTX = computed(
      () => isShowMessageCTX.value === props.ctxMenuData?.message?.id
    );

    const files = inject("files");
    function selectMessageHandler() {
      isSelectMessagesMode.value = !isSelectMessagesMode.value;

      selectedMessages.value.push({
        id: props.ctxMenuData.message.id,
        isRead: props.ctxMenuData.isRead,
      });
      isShowMessageCTX.value = null;
    }

    function copyText() {
      navigator.clipboard.writeText(props.ctxMenuData.message.text);
      isShowMessageCTX.value = null;
    }

    function editMessage() {
      editMessageData.value = props.ctxMenuData.message;

      isShowMessageCTX.value = null;
      files.value = [...props.ctxMenuData.message.files];
    }
    function deleteMessage() {
      emit("delete-messages", [
        { id: props.ctxMenuData.message.id, isRead: props.ctxMenuData.isRead },
      ]);
      isShowMessageCTX.value = null;
    }

    function closeCTX() {
      isShowMessageCTX.value = null;
    }

    return {
      selectMessageHandler,
      editMessage,
      deleteMessage,
      closeCTX,
      isShowCTX,
      context,
      position,
      copyText,
    };
  },
};
</script>

<style lang="scss" scoped>
.msg-context {
  &__container {
    position: absolute;
    z-index: 15;
    background-color: var(--color-background);
    color: var(--color-primary);
    list-style: none;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__item {
    width: 100%;
    cursor: pointer;
    transition: 0.3s ease;
    padding: 15px;
    box-sizing: border-box;
    display: flex;

    svg {
      margin-right: 10px;
    }

    &:hover {
      background-color: var(--color-background-hover);
    }
  }
}
</style>
