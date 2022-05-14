<template>
  <div class="chat__messages">
    <chat-header v-if="chatData.title"/>
    <chat-body v-if="chatData.title"/>
    <chat-send v-if="chatData.title"/>
  </div>
</template>

<script>
import chatHeader from './chatHeader.vue'
import chatBody from './chatBody.vue'
import chatSend from './chatSend.vue'
import { computed, provide, ref } from 'vue'
import { useStore } from 'vuex'

export default {
  components: { chatHeader, chatBody, chatSend },
  setup() {

    const store = useStore()

    const files = ref([])
    provide('files', files)

    const chatData = computed(() => store.getters['chat/getChatData'])
    console.log('CHATDATA', chatData)
    return {
      chatData
    }
  }
}
</script>

<style lang='scss' scoped>
  .chat__messages {
    display: grid;
    max-height: 100vh;
    overflow: hidden;
    grid-template-rows: 58px 1fr;
    background-color: $menuColor;
  }
</style>