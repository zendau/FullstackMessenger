<template>
  <div class="box">
      <ul>
          <li v-for="user in contacts" :key=user.id>
              <p>{{user.id}}</p>
              <p>{{user.login}}</p>
              <div class="form-check" v-if="groupType">
                <input class="form-check-input" type="checkbox" :value="user.id" id="flexCheckDefault" v-model="clients">
                <label class="form-check-label" for="flexCheckDefault">
                    Add to group
                </label>
            </div>
            <button v-else @click="openUserChat(user.id)" class="btn btn-primary">Enter to chat</button>
          </li>
      </ul>
  </div>
</template>

<script>
//import { ref } from "vue";
// import $api from '../axios';

// import { useRouter } from 'vue-router'

// import { computed, ref } from 'vue'

export default {
    async setup() {


        return {
        }
    }
}
</script>

<style scoped>
    .box {
        min-height: 10px;
        min-width: 10px;
        border: 1px solid red;
        padding: 10px;
        position: absolute;
        right: 300px;
    }
</style>