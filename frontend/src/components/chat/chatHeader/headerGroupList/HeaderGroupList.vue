<template>
  <div class="chat-group__container">
    <ul>
      <GroupListItem
        v-for="userData in chatData.users"
        :key="userData.id"
        :user-data="userData"
        :user-id="userId"
        :chat-data="chatData"
      />
    </ul>
    <GroupFreeContacts
      v-if="chatData.adminId === userId"
      :chat-data="chatData"
      :user-id="userId"
    />
  </div>
</template>

<script>
import GroupListItem from "./GroupListItem.vue";
import GroupFreeContacts from "./GroupFreeContacts.vue";

export default {
  components: { GroupListItem, GroupFreeContacts },
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
};
</script>

<style lang="scss">
.chat-group {
  &__container {
    height: min-content;
    padding: 10px;
    max-height: 400px;
    color: var(--color-primary);
    overflow: auto;
    background-color: var(--color-background);
    box-sizing: border-box;
    width: 100%;
    display: grid;
    justify-content: center;
    box-shadow: 0 0px 2px rgb(0 0 0 / 25%);

    ul {
      margin: 0;
      list-style: none;
    }
  }
}
</style>
