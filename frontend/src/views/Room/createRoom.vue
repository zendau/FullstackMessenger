<template>
  <form class="container form-container" @submit.prevent="addRoom">
   <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label">Room title</label>
    <input type="text" class="form-control" id="exampleInputEmail1" v-model.trim="roomTitle" placeholder="title">
    <select class="custom-select" v-model="roomType">
        <option value="null" disabled>Select type of room</option>
        <option :value="false">audio</option>
        <option :value="true">video</option>
    </select>
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>
</template>

<script>

import { ref } from "vue"
import $api from "../../axios"

export default {
    setup() {
        const roomTitle = ref('')
        const roomType = ref(null)

        async function addRoom() {
            const res = await $api.post('/room/add', {
                roomTitle: roomTitle.value,
                adminLogin: 'zendau',
                roomWithVideo: roomType.value
            })
            console.log('res', res)
        }

        return {
            roomTitle,
            addRoom,
            roomType
        }
    }
}
</script>

<style>
    .form-container {
        width: 600px !important;
        margin-top: 100px;
    }
</style>