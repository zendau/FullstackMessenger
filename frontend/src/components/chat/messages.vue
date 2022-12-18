<template>
  <div class="chat__messages" :class="{'chat__messages--active' :isShowMobileMessages}">
    <chat-header v-if="chatData.title"/>
    <chat-body v-if="chatData.title"/>
    <chat-send v-if="chatData.title"/>
  </div>
</template>

<script>
import chatHeader from './chatHeader.vue'
import chatBody from './chatBody.vue'
import chatSend from './chatSend.vue'
import { computed, inject, provide, ref } from 'vue'
import { useStore } from 'vuex'

export default {
  components: { chatHeader, chatBody, chatSend },
  setup() {

    const store = useStore()

    const isShowMobileMessages = inject('isShowMobileMessages')

    const files = ref([])
    provide('files', files)

    const chatData = computed(() => store.state.chat.chatData)
    console.log('CHATDATA', chatData.value)
    return {
      isShowMobileMessages,
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
    background-color: var(--menuColor);
  }
</style>