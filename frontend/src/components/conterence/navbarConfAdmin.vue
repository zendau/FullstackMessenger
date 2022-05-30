<template>
  <ul v-if="isConferenceAdmin">
    <li>
      <router-link :to="`/edit/${roomId}`">Edit conference</router-link>
    </li>
    <li class="navbar__invaite">
      <a @click="showInvaitedUsers = !showInvaitedUsers" href="#">Invite user</a>
      <free-users v-show='showInvaitedUsers' />
    </li>
    <li class="navbar__delete" @click="deleteConference">Delete conference</li>
  </ul>
</template>

<script>
import { computed, inject, ref } from 'vue'
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import FreeUsers from './freeUsers.vue'


export default {
  setup() {
    const isConferenceAdmin = inject("isConferenceAdmin");
    const showInvaitedUsers = ref(false);

    const route = useRoute()
    const roomId = computed(() => route.params.id)

    const store = useStore()
    const conferenceId = computed(() => store.state.conference.id)
    const socket = inject('socket')

    async function deleteConference() {
      console.log('delete ', roomId, socket)
      store.dispatch('conference/deleteConference', conferenceId.value).then(() => {
        socket.emit('deleteRoom', {
          roomId: roomId.value
        })
      })
    }

    return {
      isConferenceAdmin,
      showInvaitedUsers,
      roomId,
      deleteConference

    };
  },
  components: { FreeUsers }
}

</script>

<style scoped lang="scss">
.navbar__invaite {
  position: relative;
}

.navbar__delete {
  color: $dangerColor;
  cursor: pointer;
  transition: .3s ease;

  &:hover {
    color: darken($dangerColor, 10);
  }
}
</style>