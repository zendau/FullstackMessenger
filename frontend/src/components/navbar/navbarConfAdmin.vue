<template>
  <ul v-if="isConferenceAdmin">
    <li>
      <router-link :to="`/edit/${roomId}`">
        Edit conference
      </router-link>
    </li>
    <li class="navbar__invaite">
      <a
        href="#"
        @click="showInvaitedUsers = !showInvaitedUsers"
      >Invite user</a>
      <free-users v-show="showInvaitedUsers" />
    </li>
    <li
      class="navbar__delete"
      @click="deleteConference"
    >
      Delete conference
    </li>
  </ul>
</template>

<script>
import { computed, inject, ref } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import FreeUsers from "@/components/chat/contacts/usersList/FreeUsersList.vue";

export default {
  components: { FreeUsers },
  setup() {
    console.log("navbar admin conf");
    const isConferenceAdmin = inject("isConferenceAdmin", null);
    const showInvaitedUsers = ref(false);

    const route = useRoute();
    const roomId = computed(() => route.params.id);

    const store = useStore();
    const conferenceId = computed(() => store.state.conference.id);
    const socket = inject("socket", null);

    async function deleteConference() {
      console.log("delete ", roomId, socket);
      store.dispatch("conference/deleteConference", conferenceId.value).then(() => {
        socket.emit("deleteRoom", roomId.value);
      });
    }

    return {
      isConferenceAdmin,
      showInvaitedUsers,
      roomId,
      deleteConference,
    };
  },
};
</script>

<style scoped lang="scss">
.navbar__invaite {
  position: relative;
}

.navbar__delete {
  color: var(--dangerColor);
  cursor: pointer;
  transition: 0.3s ease;

  &:hover {
    /* color: darken(var(--dangerColor), 10); */
    color: var(--dangerColor);
  }
}
</style>
