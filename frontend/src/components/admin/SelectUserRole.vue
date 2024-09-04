<template>
  <select
    v-model="selectedRole"
    @change="changeRole"
  >
    <option
      v-for="role in rolesList"
      :key="role"
    >
      {{ role }}
    </option>
  </select>
</template>

<script>
import { useStore } from "vuex";
import { computed, ref } from "vue";

export default {
  props: {
    userRole: {
      type: String,
      required: true,
    },
    userId: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const selectedRole = ref(props.userRole);

    const rolesList = computed(() => store.state.admin.rolesList);

    function changeRole(e) {
      store.dispatch("admin/setUserRole", {
        userId: props.userId,
        role: e.target.value,
      });
    }

    return {
      changeRole,
      selectedRole,
      rolesList,
    };
  },
};
</script>

<style></style>
