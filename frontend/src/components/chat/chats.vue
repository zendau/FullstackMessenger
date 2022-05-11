<template>
  <div class="chat__contacts">
    <ul class="contacts__list">
      <li
        class="contact__item"
        v-for="room in roomData" 
        :key="room.id"
      >
        <router-link 
          :to="'/chat/'+room.chatId">
          <i class="bi bi-people" v-if="room.groupType">></i>
          <i class="bi bi-person" v-else></i>
          {{room.groupName}} 
        </router-link>
      </li>
    </ul>
  </div>
</template>


<script>
//import { ref } from "vue";
import $api from "../../axios";

import { computed, onMounted, reactive } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const userData = computed(() => store.getters["auth/getUserData"]);

    const roomData = reactive([])
        onMounted(async () => {

            const userId = userData.value.id

            const res = await $api.get(`/chat/getByUser/${userId}`)
            console.log('resSS', res)
            roomData.push(...res.data)
        })

        return {
            roomData,
        }
  },
};
</script>

<style lang="scss" scoped>
.chat {
  &__contacts {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    max-height: 100vh;
    box-sizing: border-box;
    background-color: $bgcColor;

    button {
      margin-bottom: 10px;
      width: 100px;
      align-self: center;
    }
  }
}

.contacts {
  &__list {
    overflow: auto;

    &::-webkit-scrollbar {
      width: 5px;
    }

    &::-webkit-scrollbar-track {
      background-color: #3f4750;
      border-radius: 100px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #9b9fa4;
      box-shadow: inset 2px 2px 5px 0 rgba(#fff, 0.5);
      border-radius: 10px;
    }
  }
}

.contact {
  &__item {
    display: flex;
    align-items: center;
    transition: 0.3s ease;
    cursor: pointer;
    color: $textColor;
    a {
      color: inherit;
      text-decoration: none;
      width: 100%;
      height: 100%;
      padding: 14.5px 0;
    }
   
     &:hover {
      background-color: $itemColor;
    }
    input {
      margin: 0 5px;
    }

    i {
      margin: 0 10px;
      font-size: 26px;
    }
  }
}

.router-link-active {
  background-color: #2B5278;
}

</style>