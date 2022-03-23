<template>
  <form class="container form-container" @submit.prevent="addRoom">
   <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label">Room title</label>
    <input type="text" class="form-control" id="exampleInputEmail1" v-model.trim="roomTitle" placeholder="title">
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

        async function addRoom() {
            const res = await $api.post('/room/add', {
                roomTitle: roomTitle.value,
                adminLogin: 'zendau'
            })
            console.log('res', res)
        }

        return {
            roomTitle,
            addRoom
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