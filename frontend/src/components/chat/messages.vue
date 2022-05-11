<template>
  <div class="chat__messages">
    <chat-header/>
    <chat-body/>
    <chat-send/>
  </div>
</template>

<script>
import chatHeader from './chatHeader.vue'
import chatBody from './chatBody.vue'
import chatSend from './chatSend.vue'

export default {
  components: { chatHeader, chatBody, chatSend },

}
</script>

<style scoped>
  .chat__messages {
    display: grid;
    max-height: 100vh;
    overflow: hidden;
    grid-template-rows: 50px 1fr;
  }
</style>