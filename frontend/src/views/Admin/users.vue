<template>
  <alert />
  <table class="table">
    <thead>
      <tr>
        <th>id</th>
        <th>Email</th>
        <th>Login</th>
        <th>Role</th>
        <th>Status</th>
        <th>Ban user</th>
        <th>UnBan user</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="user in users" :key="user.id">
        <td>{{ user.id }}</td>
        <td>{{ user.email }}</td>
        <td>{{ user.login }}</td>
        <td>{{ user.role }}</td>
        <td>{{ getStatus(user.isBanned) }}</td>
        <td><button @click="banUser(user.id)">Ban</button></td>
        <td><button @click="unBanUser(user.id)">UnBan</button></td>
      </tr>
      ...
    </tbody>
  </table>
</template>


<script>
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import $api from '../../axios'

import Alert from '../../components/UI/alert.vue'

export default {
  components: { Alert },
  setup() {
    const store = useStore()

    const users = ref(null)

    onMounted(async () => {
      const res = await $api.get('/user/all')
      users.value = res.data
      console.log(users.value)
    })

    async function banUser(userId) {

      try {
        await $api.patch('user/blockUser', {
          userId
        })
        users.value.forEach(user => {
          if (user.id === userId) {
            user.isBanned = 1
          }
          return user
        })
      } catch {
        store.commit('auth/setErrorMessage', 'error connection')
      }
    }

    async function unBanUser(userId) {
      try {
        await $api.patch('user/blockUser', {
          userId
        })
        users.value.forEach(user => {
          if (user.id === userId) {
            user.isBanned = 0
          }
          return user
        })
      } catch {
        store.commit('auth/setErrorMessage', 'error connection')
      }
    }

    function getStatus(id) {
      return id ? 'banned' : 'active'
    }

    return {
      banUser,
      unBanUser,
      getStatus,
      users,
    }

  }
}
</script>

<style>
.table {
  width: 100%;
  border: none;
  margin-bottom: 20px;
}

.table thead th {
  font-weight: bold;
  text-align: left;
  border: none;
  padding: 10px 15px;
  background: #d8d8d8;
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
  background: black;
}
</style>