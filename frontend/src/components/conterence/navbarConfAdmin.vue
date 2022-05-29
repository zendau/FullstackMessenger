<template>
  <ul v-if="isConferenceAdmin">
    <li><a href="#">Edit conference</a></li>
    <li><a href="#">Delete conference</a></li>
    <li class="navbar__invaite">
      <a @click="showInvaitedUsers = !showInvaitedUsers" href="#">Invite user</a>
      <free-users v-show='showInvaitedUsers'/>
    </li>
  </ul>
</template>

<script>
import { inject, ref } from 'vue'
import FreeUsers from './freeUsers.vue'


export default {
    setup() {
        const isConferenceAdmin = inject("isConferenceAdmin");
        const showInvaitedUsers = ref(false);
        return {
            isConferenceAdmin,
            showInvaitedUsers
        };
    },
    components: { FreeUsers }
}

</script>

<style scoped>
  .navbar__invaite {
    position: relative;
  }
</style>