<template>
  <div>
    <router-view/>
  </div>
</template>

<script>

import {onMounted, provide} from "vue"
import {Socket} from "./Socket"

export default {
  setup() {
    onMounted(() => {
      const SocketClass = new Socket()
      provide("SocketClass", SocketClass)
    })
  },
}
</script>

<style lang="scss">

@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap');
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");

body {
  background-color: #dddddd;
  margin: 0;
}
</style>

