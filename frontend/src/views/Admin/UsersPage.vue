<template>
  <AlertNotification />
  <table class="table">
    <thead>
      <tr>
        <th>id</th>
        <th>Email</th>
        <th>Login</th>
        <th>Role</th>
        <th>Status</th>
        <th>Block user</th>
        <th>UnBlock user</th>
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
        <td>{{ user.role }}</td>
        <td>{{ getStatus(user.isBanned) }}</td>
        <td>
          <button
            class="btn"
            @click="banUser(user.id)"
          >
            Block
          </button>
        </td>
        <td>
          <button
            class="btn"
            @click="unBanUser(user.id)"
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
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import $api from "../../axios";

import AlertNotification from "../../components/UI/AlertNotification.vue";

export default {
  components: { AlertNotification },
  setup() {
    const store = useStore();

    const users = ref(null);

    onMounted(async () => {
      const res = await $api.get("/user/all");
      users.value = res.data;
      console.log(users.value);
    });

    async function banUser(userId) {
      try {
        await $api.patch("user/blockUser", {
          userId,
        });
        users.value.forEach((user) => {
          if (user.id === userId) {
            user.isBanned = 1;
          }
          return user;
        });
      } catch {
        store.commit("alert/setErrorMessage", "error connection");
      }
    }

    async function unBanUser(userId) {
      try {
        await $api.patch("user/unBlockUser", {
          userId,
        });
        users.value.forEach((user) => {
          if (user.id === userId) {
            user.isBanned = 0;
          }
          return user;
        });
      } catch {
        store.commit("alert/setErrorMessage", "error connection");
      }
    }

    function getStatus(id) {
      return id ? "banned" : "active";
    }

    return {
      banUser,
      unBanUser,
      getStatus,
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
