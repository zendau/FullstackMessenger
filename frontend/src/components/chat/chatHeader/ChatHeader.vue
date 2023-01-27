<template>
  <div class="chat__header">
    <HeaderMessages @delete-messages="deleteMessages" />
    <div class="chat__header-data">
      <HeaderGroup
        v-if="chatData?.adminId"
        :chat-title="chatData.title"
        :members-count="chatGroupMembersCount"
        @toggle-list="toggleUsersList"
      />
      <HeaderPrivate
        v-else
        :chat-title="chatData.title"
        :private-chat-online-status="privateChatOnlineStatus"
        :private-user-id="chatData.users[0].id"
        :user-id="userId"
      />
    </div>
    <HeaderChatMenu
      v-if="chatData?.adminId"
      :user-id="userId"
      :admin-id="chatData?.adminId"
      :chat-users="chatData?.users"
    />
    <!-- TODO: Проверить что это, если не надо , удалить -->
    <!-- <div
      v-if="isChatAdmin"
      class="chat__topbar"
    /> -->
  </div>
  <HeaderGroupList
    v-if="isShowUsersList"
    :chat-data="chatData"
    :user-id="userId"
  />
</template>

<script>
import { computed, inject, ref } from "vue";
import { useStore } from "vuex";

import HeaderMessages from "@/components/chat/chatHeader/HeaderMessages.vue";
import HeaderGroup from "@/components/chat/chatHeader/HeaderGroup.vue";
import HeaderPrivate from "@/components/chat/chatHeader/HeaderPrivate.vue";
import HeaderChatMenu from "@/components/chat/chatHeader/HeaderChatMenu.vue";
import HeaderGroupList from "@/components/chat/chatHeader/headerGroupList/HeaderGroupList.vue";

export default {
  components: { HeaderMessages, HeaderGroup, HeaderPrivate, HeaderChatMenu, HeaderGroupList },
  emits: ["delete-messages"],
  setup(_, { emit }) {
    const store = useStore();
    const chatData = inject("chatData");
    const userId = computed(() => store.state.auth.user.id);

    const showUsers = ref(false);

    const privateChatOnlineStatus = computed(() => {
      if (!chatData.value?.users) return chatData.value.lastOnline;

      const [userId] = Object.keys(chatData.value.users);
      return chatData.value.users[userId].lastOnline;
    });

    const chatGroupMembersCount = computed(() => Object.keys(chatData.value.users).length);

    const isShowUsersList = ref(false);

    function toggleUsersList() {
      isShowUsersList.value = !isShowUsersList.value;
    }

    function deleteMessages() {
      emit("delete-messages");
    }

    return {
      chatData,
      showUsers,
      privateChatOnlineStatus,
      isShowUsersList,
      chatGroupMembersCount,
      deleteMessages,
      userId,
      toggleUsersList,
    };
  },
};
</script>

<style lang="scss">
.chat {
  &__header {
    display: grid;
    height: 100%;
    background-color: var(--bgcColor);
    border-left: 1px solid black;

    grid-template-columns: 1fr 300px;
    justify-items: baseline;
    align-content: center;
    padding-left: 30px;

    &-data {
      height: 100%;
      grid-column: 1/2;
      position: relative;
    }
  }

  &__title {
    color: var(--textColor);

    &--private {
      grid-row: 1/3;
      width: 100%;
      align-self: center;
    }
  }

  &__title,
  &__count {
    text-align: center;
    display: flex;
    justify-content: center;
  }

  &__user-group {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
  }

  &__count {
    font-size: 14px;
    color: var(--secondTextColor);
    cursor: pointer;
    user-select: none;
  }

  &__topbar {
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: relative;
    grid-column: 2/3;
    justify-self: center;

    button {
      height: 40px;
      margin-right: 10px;
    }
  }

  &__exit {
    margin-right: 15px;
    text-decoration: none;
    align-self: center;
    justify-self: end;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: var(--dangerColor);
    grid-column: 3/4;
  }
}

@media (max-width: 720px) {
  .chat {
    &__header {
      grid-template-columns: auto;

      &-data {
        width: auto;
      }
    }
  }
}
</style>
