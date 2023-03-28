<template>
  <div class="chat__header">
    <HeaderMessages
      v-if="selectedMessages.length"
      @delete-messages="deleteMessages"
    />
    <div
      v-else
      class="chat__header-data"
    >
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
        :private-user-id="privateUserId"
        :user-id="userData.id"
      />
    </div>
    <HeaderChatMenu
      v-if="!selectedMessages.length"
      :user-id="userData.id"
      :peer-id="userData.peerId"
      :user-login="userData.login"
      :admin-id="chatData?.adminId"
      :chat-users="chatData?.users"
      :chat-title="chatData.title"
      :is-private-banned="isPrivateBanned"
      :with-video="chatData.conferenceWithVideo"
    />
  </div>
  <HeaderGroupList
    v-if="isShowUsersList"
    :chat-data="chatData"
    :user-id="userData.id"
  />
</template>

<script>
import { computed, inject, watch, ref } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

import HeaderMessages from "@/components/chat/chatHeader/HeaderMessages.vue";
import HeaderGroup from "@/components/chat/chatHeader/HeaderGroup.vue";
import HeaderPrivate from "@/components/chat/chatHeader/HeaderPrivate.vue";
import HeaderChatMenu from "@/components/chat/chatHeader/HeaderChatMenu.vue";
import HeaderGroupList from "@/components/chat/chatHeader/headerGroupList/HeaderGroupList.vue";

export default {
  components: { HeaderMessages, HeaderGroup, HeaderPrivate, HeaderChatMenu, HeaderGroupList },
  props: {
    isPrivateBanned: {
      type: [String, Boolean],
      required: true,
    },
  },
  emits: ["delete-messages"],
  setup(_, { emit }) {
    const store = useStore();
    const chatData = inject("chatData");
    const userData = computed(() => store.state.auth.user);
    const router = useRoute();
    const chatId = computed(() => router.params.id);
    const selectedMessages = inject("selectedMessages");

    const privateChatOnlineStatus = computed(() => {
      if (!chatData.value?.users) return chatData.value.lastOnline;

      const [userId] = Object.keys(chatData.value.users);
      return chatData.value.users[userId].lastOnline;
    });

    const privateUserId = computed(() => {
      if (!chatData.value?.users) return chatData.value.id;
      return Object.values(chatData.value.users)[0]?.id;
    });

    const chatGroupMembersCount = computed(() => Object.keys(chatData.value.users).length);

    const isShowUsersList = ref(false);

    function toggleUsersList() {
      isShowUsersList.value = !isShowUsersList.value;
    }

    watch(chatId, () => {
      if (isShowUsersList.value) toggleUsersList();
    });

    function deleteMessages() {
      emit("delete-messages");
    }

    return {
      privateUserId,
      chatData,
      privateChatOnlineStatus,
      isShowUsersList,
      chatGroupMembersCount,
      deleteMessages,
      userData,
      toggleUsersList,
      selectedMessages,
    };
  },
};
</script>

<style lang="scss">
.chat {
  &__header {
    display: grid;
    height: 100%;
    background-color: var(--color-background);
    border-left: 1px solid rgba(0, 0, 0, 0.2);

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
    color: var(--color-primary);

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
    cursor: pointer;
  }

  &__status {
    color: var(--color-secondary);
  }

  &__user-group {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
  }

  &__count {
    font-size: 14px;
    color: var(--color-secondary);
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
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr;

      &-data {
        width: auto;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
      }
    }
  }
}
</style>
