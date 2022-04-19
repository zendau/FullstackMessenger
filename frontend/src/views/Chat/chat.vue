<template>
  roomId - {{roomId}}
    
    <h1>Messages</h1>
    <file-upload>
        <div class="messages-container" ref='scrollArea'>
            <p v-if='messages.length === 0'>Messages not found</p>
            <p v-for="message in messages" :key="message.id">
                {{message.authorLogin}} - <span v-html="isLink(message.text)"/> - {{convertDate(message.created_at)}}
                <span v-if="message.files">
                    <a 
                        style="display: block;" 
                        v-for="file in message.files" 
                        :key="file.id" 
                        :href='`http://localhost:3000/file/download/${file.id}`'
                        >
                        ICON - {{file.fileName}}
                    </a>
                </span>
            </p>
            <div ref='scrollEnd'></div>
        </div>
     </file-upload>
    <input type="text" placeholder="message" v-model="message">
   
    <button @click="sendMessage">Send message</button>

    <button @click="$router.back()">back</button>

    <div v-if="isGroup">
        <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" v-model="invateStatus">
                <label class="form-check-label" for="flexSwitchCheckDefault">Invate</label>
        </div>
        <button @click="exitGroup">Exit group</button>
        <keep-alive>
            <invaited-users v-if="invateStatus"/>
            <group-users v-else/>
        </keep-alive>
    </div>
  

</template>

<script>
import { reactive } from '@vue/reactivity'
import { ref } from 'vue'
import {useRoute, useRouter} from "vue-router"
import { inject, onMounted, provide } from '@vue/runtime-core'
import $api from '../../axios'
import groupUsers from '../../components/groupUsers.vue'
import InvaitedUsers from '../../components/invaitedUsers.vue'
import FileUpload from '../../components/fileUpload.vue'

export default {
  components: { groupUsers, InvaitedUsers, FileUpload },
    setup() {
        console.log('provide')
        const groupUsers = reactive([])
        provide('groupUsers', groupUsers)
        const route = useRoute()
        const router = useRouter()
        const userLogin = localStorage.getItem('login')

        const message = ref('')
        const files = ref(null)
        provide('files', files)
        
        const invateStatus = ref(false)
        const socket = inject('socket', undefined)
        const userId = localStorage.getItem('id')
        const messages = reactive([])
        const scrollEnd = ref(null)
        const roomId = route.params.id
        provide('roomId', roomId)
        const chatId = ref(null)
        const isGroup = ref(null)
        const scrollArea = ref(null)
        const page = ref(0)
        const limit = ref(10)
        const hasMore = ref(true)
        const isLoadedMessages = ref(false)
        onMounted(async () => {
            const res =  await $api.get(`/chat/checkId/${roomId}`)
            chatId.value = res.data.id
            if (res.data.status === false) {
                router.push('/chat/all')
            }
            if (res.data.groupName === null) {
                isGroup.value = false
            } else {
                isGroup.value = true
            }
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
            console.log('test')
            
           
        })
        const observer = new IntersectionObserver(async (entries) => {
            if( entries[0].isIntersecting && hasMore.value) {
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
        
        console.log('join to the room')
        socket.emit('join-room', { 
            userId: socket.id,
            roomId,
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

            formData.append('path', roomId)
            formData.append('userId', userId)
            files.value.forEach(file => {
                 formData.append('files', file)
            })
             // TODO: исправить axios на $api при переносе на микросервисы

            const resUpload = await $api.post('file/add', formData)
            filesUpload = resUpload.data
            
            }

            socket.emit('sendMessage', {
                authorLogin: userLogin,
                text: message.value,
                chatId: roomId,
                files: filesUpload
            })
            message.value = ''
            files.value = null
            
        }
        async function exitGroup() {
            console.log('exit user with id ',userId)
            const res = await $api.delete('/chat/exitUser', {
               params: {
                chatId: chatId.value,
                userId,
               }
            })
            if (res.data) {
                router.push('/chat/all')
            }
        }
        function convertDate(date) {
            const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'}
            return new Intl.DateTimeFormat('ru-RU', options).format(Date.parse(date));
        }
        function isLink(text) {
            const expression = /(?:(?:https?|ftp):\/\/|\b(?:[a-z\d]+\.))(?:(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))?\))+(?:\((?:[^\s()<>]+|(?:\(?:[^\s()<>]+\)))?\)|[^\s`!()[\]{};:'".,<>?«»“”‘’]))?/ig;
            const regex = new RegExp(expression);
            let result = ''
            let restText = text
            const res = text.match(regex)
            if (res) {
                res.forEach(link => {
                    const testLink = link.split('.')
                    if (testLink[1] == '' || testLink[1].charAt(0) === testLink[1].charAt(0).toUpperCase()) {
                        return link
                    }
                    const exp = /(http|https):\/\/([\w.]+\/?)\S*/ig
                    const reg = new RegExp(exp);
                    
                    let url = null
                    if (!link.match(reg)) {
                        url = `http://${link}`
                    } else {
                        url = link
                    }
                    const temp = restText.replace(link, `<a target='_blank' href='${url}'>$&</a>`).split('</a>')
                    result += temp[0] + '</a>'
                    restText = temp[1]
                });
                return result + restText
            } else {
                return text
            }
        }
        return {
            roomId,
            messages,
            message,
            sendMessage,
            invateStatus,
            exitGroup,
            isGroup,
            scrollEnd,
            scrollArea,
            convertDate,
            isLink
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