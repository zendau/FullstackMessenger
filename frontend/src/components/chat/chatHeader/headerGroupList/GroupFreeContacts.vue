<template>
  <button
    class="group-free__load-btn"
    @click="getFreeChatUsersHandler"
  >
    {{ $t("chat.groupFreeContacts.invite") }}
  </button>
  <ul>
    <GroupListItem
      v-for="userData in freeUsersList"
      :key="userData.id"
      :user-data="userData"
      :chat-data="chatData"
      :user-id="userId"
      :is-added-type="true"
    />
  </ul>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

import GroupListItem from "@/components/chat/chatHeader/headerGroupList/GroupListItem.vue";

export default {
  components: { GroupListItem },
  props: {
    chatData: {
      type: Object,
      required: true,
    },
    userId: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();

    const freeUsersList = computed(() => store.state.chat.freeChatUsers);

    function getFreeChatUsersHandler() {
      store.dispatch("chat/getFreeChatUsers", {
        userId: props.userId,
        chatId: props.chatData.id,
        users: Object.keys(props.chatData.users),
      });
    }

    return {
      freeUsersList,
      getFreeChatUsersHandler,
    };
  },
};
</script>

<style lang="scss" scoped>
.group-free {
  &__load-btn {
    background-color: var(--color-links);
    transition: 0.3s ease;
    cursor: pointer;
    border: none;
    padding: 8px 5px;
    color: var(--color-primary);
    border-radius: 2px;
    width: 250px;
    margin: 12px auto;

    &:hover {
      background-color: var(--color-links-active);
    }
  }
}
</style>
