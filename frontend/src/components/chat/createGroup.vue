<template>
  <form
    class="contacts__group-create"
    @submit.prevent="createGroupChat"
  >
    <input
      v-model="groupName"
      type="text"
      placeholder="Group Name"
    >
    <button
      class="btn"
      :disabled="groupUsersLength"
    >
      Create group
    </button>
  </form>
</template>

<script>
import { useRouter } from "vue-router";
import $api from '../../axios'

import { computed, ref } from "vue";

export default {
  props: ['groupUsers', 'adminId'],
  setup(props) {

    const groupName = ref([])

    const router = useRouter()

    const groupUsersLength = computed(() => {
      if (props.groupUsers.length > 1 && groupName.value !== '') {
        return false;
      }

      return true;
    });

    async function createGroupChat() {
      const chatData = await $api.post("/chat/create", {
        adminId: props.adminId,
        groupName: groupName.value,
        users: props.groupUsers
      });

      if (chatData.data) {
        router.push(`/chat/${chatData.data.id}`);
      }
    }

    return {
      createGroupChat,
      groupName,
      groupUsersLength
    }

  }
}

</script>


<style lang="scss" scoped>
.contacts__group-create {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  margin-bottom: 10px;

  input {
    width: 85%;
    padding: 8px;
    font-size: 14px;
    background-color: #242f3d;
    color: var(--textColor);
    border: none;
    outline: none;
    border-radius: 5px;
  }

  button {
    margin-top: 10px;
  }

  button:disabled,
  button[disabled] {
    cursor: not-allowed;
  }
}
</style>