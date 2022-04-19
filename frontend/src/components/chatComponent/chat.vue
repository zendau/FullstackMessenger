<template>    
  <h1>Messages</h1>
  <file-upload>
    <div class="messages-container" ref='scrollArea'>
      <p v-if='messages.length === 0'>Messages not found</p>
      <p v-for="message in messages" :key="message.id">
          <userMessage :message='message'/>
          <file-link :files = 'message.files'/>
      </p>
      <div ref='scrollEnd'></div>
    </div>
  </file-upload>
  <input type="text" placeholder="message" v-model="message">

  <button @click="sendMessage">Send message</button>

</template>

<script>

import { ref, reactive, inject, onMounted, provide} from 'vue'
import $api from '../../axios'

import FileUpload from '../fileUpload.vue'
import userMessage from '../chatComponent/userMessage.vue'
import fileLink from '../chatComponent/fileLink.vue'


export default {
  components: { FileUpload, userMessage, fileLink },
  props: ['roomId'],
  setup(props) {

      const userLogin = localStorage.getItem('login')
      const message = ref('')
      const files = ref(null)
      const socket = inject('socket', undefined)
      const userId = localStorage.getItem('id')
      const messages = reactive([])
      const scrollEnd = ref(null)
      const chatId = ref(null)
      
      const scrollArea = ref(null)
      const page = ref(0)
      const limit = ref(10)
      const hasMore = ref(true)
      const isLoadedMessages = ref(false)

      provide('files', files)
      provide('roomId', props.roomId)

      onMounted(async () => {
          const res =  await $api.get(`/chat/checkId/${props.roomId}`)
          chatId.value = res.data.id
          if (res.data.status === false) {
              console.error("router error")
          }
          // TODO: Попробовать удалить это и посмотреть будет ли observer загружать первые сообщения
          const messagesRes =  await $api.get(`/message/getAllChat/${chatId.value}`, {
              params: {
                  page: page.value,
                  limit: limit.value
              }
          })
        
          console.log('messagesRes', messagesRes)
          if (messagesRes.data.status !== false) {
              messages.push(...messagesRes.data)
              console.log('!!!!', messages)
              //scrollArea.value.scrollTo(0, scrollArea.value.scrollHeight)  
              observer.observe(scrollEnd.value)
          }
          
          console.log('test', scrollEnd, scrollEnd.value)
      })

      const observer = new IntersectionObserver(async (entries) => {
          if(entries[0].isIntersecting && hasMore.value) {
              page.value++
              isLoadedMessages.value = true
              const messagesRes =  await $api.get(`/message/getAllChat/${chatId.value}`, {
                  params: {
                      page: page.value,
                      limit: limit.value
                  }
              })
              if (messagesRes.data.length === 0) {
                  hasMore.value = false
              }
              messages.push(...messagesRes.data)
              console.log('messagesRes', messagesRes)
              isLoadedMessages.value = false
              
          }
      })
      
      socket.emit('join-room', { 
          userId: socket.id,
          roomId: props.roomId,
      })
      socket.on('newMessage', (messageData) => {
          console.log('NEEEEW', messageData)
          messages.unshift(messageData)
      })

      async function sendMessage() {
          console.log(message)
          let filesUpload = null
          if (files.value !== null) {
            const formData = new FormData()
            formData.append('path', props.roomId)
            formData.append('userId', userId)
            files.value.forEach(file => {
              formData.append('files', file)
            })

            const resUpload = await $api.post('file/add', formData)
            filesUpload = resUpload.data
          
          }
            socket.emit('sendMessage', {
                authorLogin: userLogin,
                text: message.value,
                chatId: props.roomId,
                files: filesUpload
            })
            message.value = ''
            files.value = null
          
      }


      
      return {
          messages,
          message,
          sendMessage,
          scrollEnd,
          scrollArea,
      }
    }
}
</script>

<style>
    .messages-container {
        display: flex;
        flex-direction: column-reverse;
        overflow:scroll; 
        height: 300px;
        width: 600px;
    }
</style>