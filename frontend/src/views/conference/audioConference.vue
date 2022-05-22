<template>
  <audio-container-vue v-for='user in roomUsers' :key='user.userId' :peerId="user.peerId" :isMuted="user.mute" :userName='user.userLogin' :ref="setItemRef"/>
</template>


<script>
import { useRoute } from 'vue-router'
import { onUnmounted, ref, inject, watch, onMounted, onBeforeUpdate } from 'vue'


import $api from '../../axios'
import audioContainerVue from '../../components/conterence/audioContainer.vue'

import Peer from 'peerjs';
export default {
    components: { audioContainerVue },
    setup() {

        // ==== vars ==== //

        //const router = useRouter()
        const route = useRoute()

        const roomUsers = ref([])
        const roomData = ref(null)

        // user Data
        const roomId = route.params.id
        const userLogin = Date.now()
        const userId = ref(null)
        const peerId = ref(null)

        const testUser = ref([])

        const socket = inject('socket', undefined)
        const socketConnected = inject('peerSocketConnected', false)
        const peerConnected = ref(false)
        
        const audioGroup = ref(null)

        const mainStream = ref(null)
        const childStream = []
        const lastConnectedUserId = ref(null)


        // new

        let containersRefs = []
        const setItemRef = el => {
          if (el) {
            containersRefs.push(el)
          }
        }

        onBeforeUpdate(() => {
          containersRefs = []
        })


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
            }
        }, {
            immediate: true
        })

     
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

            // containersRefs.forEach(item => {
            //     const audioELement = document.getElementById(item.peerId)
            //     console.log('mute', audioELement, item.mute)
            //     if (audioELement) audioELement.muted = item.mute
            // });
        });

        socket.on('getFreeUsers', (users) => {
           console.log('free users2', users)
           testUser.value = users
        })
        
        socket.on('userJoinedRoom', (userId) => {
            console.log('containersRefs', containersRefs)
            lastConnectedUserId.value = userId
            console.log('Connected user with id', lastConnectedUserId.value, mainStream.value)
            connectToNewUser(lastConnectedUserId.value, mainStream.value)
        })

        socket.on('UserLeave', (userId) => {
            console.log('disconnect', userId);
            const element = document.getElementById(userId)
            console.log(element)
            //element.remove();
        })


        // socket.on('muteAudioStream', (userId) => {
        //     const audioElement = document.getElementById(userId)
        //     console.log('muted audio tag',audioElement, userId) 
        //     audioElement.muted = !audioElement.muted
        // })



        onMounted(async () => {
          const res = await $api.get('/room/get/'+roomId)
          roomData.value = res.data
        })
        

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
              //audio.muted = store.state.users.filter(item => item.id === call.peer)[0].mute
              call.on('stream', userVideoStream => {
                console.log('answer audio stream')
                containersRefs.forEach(item => {
                  if (item.peerId === call.peer) {
                    item.setStream(userVideoStream)
                  }
                })
        
              })
            })
          }
        )

        myPeer.on('open', id => {
          console.log('join peer server', id)
          peerId.value = id
          peerConnected.value = true
        })

        function connectToNewUser(userId, stream) {
            console.log('conntected to new user. Call to '+userId, myPeer, stream, roomUsers.value)
            const call = myPeer.call(userId, stream)
          

            call.on('stream', userVideoStream => {
                console.log('connectToNewUser audio stream')
                containersRefs.forEach(item => {
                  if (item.peerId === userId) {
                    item.setStream(userVideoStream)
                  }
                })
                //addAudioStream(audio, userVideoStream)
            })
            call.on('close', () => {
                console.log('!!!! CLOSE CONNECT')
                //audio.remove()
            })

            peers[userId] = call
        }

        return {
            roomData,
            roomUsers,
            roomId,
            testUser,
            audioGroup,
            setItemRef
        }
    }
}
</script>

