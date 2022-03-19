<template>
  <div class="rooms-container">
       <div class="card" style="width: 18rem;" v-for="room in rooms" :key="room.id">
        <div class="card-body">
            <h5 class="card-title">{{room.roomTitle}}</h5>
            <router-link :to='room.roomId'  class="btn btn-primary">Enter room</router-link>
        </div>
        </div>
  </div>
</template>

<script>
import $api from '../axios'
import { ref } from 'vue'

export default {
    async setup() {
        const res = await $api.get('/room/getAll')
        const rooms = ref(res.data)
        console.log(rooms)
        return {
            rooms
        }
    }
}
</script>

<style>
    .rooms-container {
        display: flex;
        width: 800px;
        margin: 0 auto;
        margin-top: 80px;
    }
    .card {
        margin-right: 15px;
    }
</style>