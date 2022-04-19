<template>
  
    <div>Room title - {{roomData.roomTitle}}</div>
    <div>Room author - {{roomData.adminLogin}}</div>
    <div>Room id - {{roomData.roomId}}</div>
    <ul>
        <li v-for="user in roomUsers" :key="user.userId">User - {{user.userId}}. Mute status - {{!!user.mute}}</li>
    </ul>
    <free-users :roomId='roomId' :users="testUser" />
    <chat-room-container/>
    <div ref="audioGroup"></div>
</template>

<script>
import { useRoute } from 'vue-router'
import {  reactive, onUnmounted, ref, inject, watch } from 'vue'


import $api from '../../axios'
import freeUsers from '../../components/freeUsers.vue'
import chatRoomContainer from '../../components/chatRoomContainer.vue'

import Peer from 'peerjs';
export default {
    components: { freeUsers, chatRoomContainer },
    async setup() {

        // ==== vars ==== //

        //const router = useRouter()
        const route = useRoute()

        const roomUsers = ref([])

        // user Data
        const roomId = route.params.id
        const userLogin = Date.now()
        const userId = ref(null)
        const peerId = ref(null)

        const testUser = ref([])

        const socket = inject('socket', undefined)
        const socketConnected = inject('connected', false)
        const peerConnected = ref(false)
        
        const audioGroup = ref(null)

        const mainStream = ref(null)
        const childStream = []
        const lastConnectedUserId = ref(null)

        // ==== hooks ==== //

        
       
        watch([socketConnected, peerConnected], ([socketStatus, peerStatus]) => {
            if (socketStatus && peerStatus) {
                userId.value = socket.id
                console.log('join to the room')
                socket.emit('join-room', { 
                    userId: userId.value,
                    peerId: peerId.value,
                    roomId: roomId,
                    userLogin
                })
                //connectToNewUser()
            }
        }, {
            immediate: true
        })

        // socket.on('connect', () =>{
        //     console.log('connected room')
        //     userId.value = socket.id

        //     socket.emit('join-room', { 
        //         userId: userId.value,
        //         roomId: roomData.roomId,
        //         userLogin
        //     })

        //     console.log( userId.value, roomData.roomId, userLogin)
        //     //Object.keys(socket).forEach(item => console.log(item + ' ' + socket[item]))
        // })


       
        onUnmounted(() => {
            socket.emit('exit-room', {
                userId: userId.value,
                roomId: roomId,
                userLogin
            })
            window.removeEventListener('keypress', muteEvent)
            socket.removeAllListeners('getUsers')
            mainStream.value.getTracks().forEach(t => {
                console.log(t)
                t.stop()
                console.log(t)
            })
            childStream.forEach(stream => {
               stream.getTracks().forEach(track => {
                track.stop()
            })
            })
        })


        // ==== socket ==== //

        socket.on('getUsers', (users) => {
            console.log('users', users);
            roomUsers.value = users

            users.forEach(item => {
                const audioELement = document.getElementById(item.peerId)
                console.log('mute', audioELement, item.mute)
                if (audioELement) audioELement.muted = item.mute
            });
            //socket.emit('message', { test: 'test' });
        });

        socket.on('getFreeUsers', (users) => {
           console.log('free users2', users)
           testUser.value = users
        })
        
        socket.on('userJoinedRoom', (userId) => {
            lastConnectedUserId.value = userId
            console.log('Connected user with id', lastConnectedUserId, mainStream)
            connectToNewUser(lastConnectedUserId.value, mainStream.value)
        })

        socket.on('UserLeave', (userId) => {
            console.log('disconnect', userId);
            const element = document.getElementById(userId)
            console.log(element)
            element.remove();
        })


        // socket.on('muteAudioStream', (userId) => {
        //     const audioElement = document.getElementById(userId)
        //     console.log('muted audio tag',audioElement, userId) 
        //     audioElement.muted = !audioElement.muted
        // })


        // ==== async ==== //

        const res = await $api.get('/room/get/'+roomId)
        const roomData = reactive(res.data)
        

        // socket.on('disconnect',function() {
        //     socket.emit('exit-room', {
        //         userId: userId.value,
        //         roomId,
        //         userLogin
        //     });
        // });

        

       

        // socket.on('join-room', () => {
        //     console.log('Connected');

        //     //
        // });




        // ==== events ==== //
        window.addEventListener('keypress', muteEvent)

        function muteEvent(event) {
          if (event.code === 'KeyM') {
            console.log('click M', userId.value)
            socket.emit('userMute', {
                userId: userId.value,
                roomId
            })
          }
        }


        // ==== peers ==== //

        const myPeer = new Peer({
            path: '/peer',
            host: '/',
            port: '9000'
        })


        const peers = {}

        const getUserMedia =
        navigator.mediaDevices.getUserMedia ||
        navigator.mediaDevices.webkitGetUserMedia ||
        navigator.mediaDevices.mozGetUserMedia;

        getUserMedia({
        audio: true
        }).then(stream => {
        //localStream.value = stream
        //console.log('localStream',localStream)
        mainStream.value = stream
        console.log('localStream',stream) // new - temp
        // socket.on('user-connected', userId => {
        //     // const audio = document.createElement('audio')
        //     // audio.id = userId;
        //     // document.body.append(audio)
        //     console.log('userConnetSOcker', userId)
        //     //connectToNewUser(userId, stream)
        // })          
        })


        myPeer.on('call', call => {
            console.log("answer")

            getUserMedia({
              audio: true
            }).then(stream => {
                childStream.push(stream)
              call.answer(stream)
              console.log('remoteStream', stream)
              const audio = document.createElement('audio')
              audio.id = call.peer
              //audio.muted = store.state.users.filter(item => item.id === call.peer)[0].mute
              call.on('stream', userVideoStream => {
                console.log('answer audio stream')
                addAudioStream(audio, userVideoStream)
              })
            })
          }
        )

        myPeer.on('open', id => {
          console.log('join peer server', id)
          peerConnected.value = true
          peerId.value = id
        //   socket.data.getConnect().emit('join-room', roomId, id, userLogin)

        //   //socket.data.createRoom(roomId, userLogin, id)
        //   socket.data.getUserId(userId, store)
        //   socket.data.getUsers(store)
        //   socket.data.resiveMessage(store, function () {
        //     return nextTick(() => {
        //     const elem = messagesRef.value
        //     elem.value.scrollTo(0, elem.value.scrollHeight)        
        //   })
        })

        // eslint-disable-next-line no-unused-vars
        function connectToNewUser(userId, stream) {
            console.log('conntected to new user. Call to '+userId, myPeer, stream)
            const call = myPeer.call(userId, stream)
            const audio = document.createElement('audio')
            audio.id = userId
            call.on('stream', userVideoStream => {
                console.log('connectToNewUser audio stream')
                addAudioStream(audio, userVideoStream)
            })
            call.on('close', () => {
                console.log('!!!! CLOSE CONNECT')
                audio.remove()
            })

            peers[userId] = call
        }

        function addAudioStream(audio, stream) {
            audio.srcObject = stream
            console.log(stream, 'stream')
            audio.addEventListener('loadedmetadata', () => {
                audio.play()
            })
            audioGroup.value.append(audio)
        }

        return {
            roomData,
            roomUsers,
            roomId,
            testUser,
            audioGroup
        }
    }
}
</script>

<style>

</style>