<template>
  <div>
    <Chat />
  </div>
</template>

<script>

import Chat from '../views/Chat/chatTest.vue'

export default {
  components: { Chat }
}

</script>
<style scoped lang="scss">
div {
  display: grid;
  grid-template-columns: 80px 1fr;
  height: 102vh;
  max-height: 100vh;
}
</style>
