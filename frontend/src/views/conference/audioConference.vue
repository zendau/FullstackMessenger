<template>
  <audio-container-vue v-for='user in roomUsers' :key='user.userId' :peerId="user.peerId" :isMuted="user.mute"
    :userName='user.userLogin' :ref="setItemRef" />
</template>


<script>
import { useRoute } from 'vue-router'
import { onUnmounted, ref, inject, watch, onBeforeUpdate } from 'vue'

import audioContainerVue from '../../components/conterence/audioContainer.vue'

import Peer from 'peerjs';
export default {
  components: { audioContainerVue },
  setup() {

    // ==== vars ==== //

    //const router = useRouter()
    const route = useRoute()

    // room data
    const roomUsers = ref([])
    const freeUsers = ref([])

    // user data
    const roomId = route.params.id
    const userId = ref(null)
    const peerId = ref(null)

    const socket = inject('socket', undefined)
    const socketConnected = inject('peerSocketConnected', false)
    const peerConnected = ref(false)

    const isMuted = inject('isMuted')


    let mainStream = null
    const childStream = []


    let containersRefs = []
    const setItemRef = el => {
      if (el) {
        containersRefs.push(el)
      }
    }

    // ==== hooks ==== //

    watch([socketConnected, peerConnected], ([socketStatus, peerStatus]) => {
      if (socketStatus && peerStatus) {
        userId.value = socket.id
        console.log('join to the room')
        socket.emit('join-room', {
          userId: userId.value,
          peerId: peerId.value,
          roomId: roomId
        })
      }
    }, {
      immediate: true
    })




    onUnmounted(() => {
      socket.emit('exit-room', {
        userId: userId.value,
        roomId: roomId
      })
      window.removeEventListener('keypress', muteEvent)
      socket.removeAllListeners('getUsers')
      mainStream.getTracks().forEach(t => {
        t.stop()
      })
      childStream.forEach(stream => {
        stream.getTracks().forEach(track => {
          track.stop()
        })
      })
    })


    onBeforeUpdate(() => {
      containersRefs = []
    })


    // ==== socket ==== //

    socket.on('getUsers', (users) => {
      console.log('users', users);
      roomUsers.value = users
    });

    socket.on('getFreeUsers', (users) => {
      console.log('free users', users)
      freeUsers.value = users
    })

    socket.on('userJoinedRoom', (userId) => {
      console.log('containersRefs', containersRefs)
      console.log('Connected user with id', userId, mainStream)
      connectToNewUser(userId, mainStream)
    })

    // socket.on('UserLeave', (userId) => {
    //     console.log('disconnect', userId);
    //     const element = document.getElementById(userId)
    //     console.log(element)
    // })




    // ==== events ==== //
    window.addEventListener('keypress', muteEvent)

    function muteEvent(event) {
      if (event.code === 'KeyM') {
        console.log('click M', userId.value)
        isMuted.value = !isMuted.value
      }
    }

    watch(isMuted, () => {
      socket.emit('userMute', {
          userId: userId.value,
          roomId
        })
    })

    // ==== peers ==== //

    const myPeer = new Peer({
      path: '/peer',
      host: '/',
      port: '9000'
    })


    const getUserMedia =
      navigator.mediaDevices.getUserMedia ||
      navigator.mediaDevices.webkitGetUserMedia ||
      navigator.mediaDevices.mozGetUserMedia;

    getUserMedia({
      audio: true
    }).then(stream => {
      //localStream.value = stream
      //console.log('localStream',localStream)
      mainStream = stream
      console.log('localStream', stream) // new - temp
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
      console.log('conntected to new user. Call to ' + userId, myPeer, stream, roomUsers.value)
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
        console.log('CLOSE CONNECT')
        //audio.remove()
      })
    }

    return {
      roomUsers,
      freeUsers,
      setItemRef
    }
  }
}
</script>

