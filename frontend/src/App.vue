<template>
  <suspense>
    <auth-layout>
      <router-view/>
    </auth-layout>
  </suspense>
</template>

<script>

//import { useRouter } from 'vue-router'

import authLayout from './layouts/auth.layout.vue'

export default {
  components: {authLayout},
  setup() {
    //const router = useRouter()
    //router.push('/room/all')
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

