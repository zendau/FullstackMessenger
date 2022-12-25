<template>
  <ul class="contacts__list">
    <li
      class="contact__item"
      v-for="user in listData"
      :key="user.id"
      @click="openUserChat(user.id)"
    >
      <i class="bi bi-person"></i>
      <!-- <input
        v-if="groupType"
        v-model="groupUsers"
        :value="user.id"
        type="checkbox"
      /> -->
      <p>{{ user.login }}</p>
      <p>{{ user.lastOnline }}</p>
    </li>
  </ul>
</template>

<script>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const listData = computed(() => store.state.contact.blockedUsers);
    const userId = computed(() => store.state.auth.user.id);

    onMounted(() => {
      if (listData.value.length !== 0) return;
      store.dispatch("contact/getBlockedUsers", userId.value);
    });

    return {
      listData,
    };
  },
};
</script>

<style></style>
