<template>
  <AlertNotification />
  <table class="table">
    <thead>
      <tr>
        <th>id</th>
        <th>Email</th>
        <th>Login</th>
        <th>Role</th>
        <th>Phone</th>
        <th>Details</th>
        <th>Last online</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="user in users"
        :key="user.id"
      >
        <td>{{ user.id }}</td>
        <td>{{ user.email }}</td>
        <td>{{ user.login }}</td>
        <td>
          <SelectUserRole
            :user-id="user.id"
            :user-role="user.role"
          />
        </td>
        <td>{{ user.info?.phone }}</td>
        <td>{{ user.info?.details }}</td>
        <td>{{ user.lastOnline }}</td>
        <!-- <td>{{ getStatus(user.isBanned) }}</td> -->
        <td v-if="!user.isBanned">
          <button
            class="btn"
            @click="banUser(user.id)"
          >
            Block
          </button>
        </td>
        <td v-else>
          <button
            class="btn"
            @click="unBlockUser(user.id)"
          >
            UnBlock
          </button>
        </td>
      </tr>
      ...
    </tbody>
  </table>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

import SelectUserRole from "@/components/admin/SelectUserRole.vue";
import AlertNotification from "@/components/UI/AlertNotification.vue";

export default {
  components: { AlertNotification, SelectUserRole },
  setup() {
    const store = useStore();

    const userId = store.state.auth.user.id;

    store.dispatch("admin/getRolesList");
    store.dispatch("admin/getUsersListPagination", userId);

    const users = computed(() => store.state.admin.userList);

    // onMounted(async () => {
    //   const res = await $api.get("/user/all");
    //   users.value = res.data;
    //   console.log(users.value);
    // });

    async function banUser(userId) {
      store.dispatch("admin/blockUser", userId);
    }

    async function unBlockUser(userId) {
      store.dispatch("admin/unBlockUser", userId);
    }

    return {
      banUser,
      unBlockUser,
      users,
    };
  },
};
</script>

<style lang="scss">
.table {
  width: 90%;
  margin: 10px auto;
  border: none;
  margin-bottom: 20px;
}

.table thead th {
  font-weight: bold;
  text-align: center;
  border: none;
  padding: 10px 15px;
  background: var(--activeBgcColor);
  color: var(--activeColor);
  font-size: 14px;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
}

.table tbody td {
  text-align: center;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  padding: 10px 15px;
  font-size: 14px;
  vertical-align: top;
  color: #fff;
}

.table thead tr th:first-child,
.table tbody tr td:first-child {
  border-left: none;
}

.table thead tr th:last-child,
.table tbody tr td:last-child {
  border-right: none;
}

.table tbody tr:nth-child(even) {
  background: var(--itemColor);
}

.table tbody tr:nth-child(odd) {
  background: var(--bgcColor);
}

@media (max-width: 720px) {
  .table tbody td {
    padding: 10px;
  }
}
</style>
