<template>
  <ul class="contacts__list">
    <li
      class="contact__item"
      v-for="(user, index) in listData"
      :key="user.id"
      @click="openUserChat(user.id)"
      :ref="(el) => setObserver(el, index)"
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
    const listData = computed(() => store.state.contact.freeUsers);
    const userId = computed(() => store.state.auth.user.id);
    const observer = new IntersectionObserver(async (entries) => {
      console.log("free", entries[0]);
      if (entries[0].isIntersecting) {
        store.dispatch("contact/getFreeUsersList", userId.value);
      }
    });


    onMounted(() => {
      if (listData.value.length !== 0) return;
      store.dispatch("contact/getFreeUsersList", userId.value);
    });

    function setObserver(el, index) {
      if (index !== listData.value.length - 1) return;
      if (!el) return;
      observer.observe(el);
    }

    return {
      listData,
      setObserver,
    };
  },
};
</script>

<style></style>
