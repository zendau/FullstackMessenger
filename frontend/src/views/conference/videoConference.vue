<template>
  <video-container-vue v-for='user in roomUsers' :key='user.userId' :peerId="user.peerId" :isMuted="user.mute"
    :userName='user.userLogin' :isPauseVideo="user.pause" :ref="setItemRef" />
</template>

<script>

import { useRoute } from 'vue-router'
import { onUnmounted, ref, inject, watch, onBeforeUpdate, reactive } from 'vue'
import Peer from 'peerjs'

import videoContainerVue from '../../components/conterence/videoContainer.vue'
import { useStore } from 'vuex'

import { startScreenRecorder, stopScreenRecorder } from './screenRecorder'
import ScreenShare from './screenShare'

export default {
  components: { videoContainerVue },
  setup() {

    // ==== vars ==== //

    const mediaError = inject('mediaError')

    //const router = useRouter()
    const route = useRoute()

    const store = useStore()

    // room data
    const roomUsers = ref([])

    // user data
    const roomId = route.params.id
    const userId = ref(null)
    const peerId = ref(null)

    const socket = inject('socket', undefined)
    const socketConnected = inject('peerSocketConnected', false)
    const peerConnected = ref(false)

    const isMuted = inject('isMuted')
    const isPauseVideo = inject('isPauseVideo')
    const isShareScreen = inject('isShareScreen')
    const isRecordScreen = inject('isRecordScreen')

    const streams = reactive([])

    const mainStream = ref(null)
    const childStream = []


    let containersRefs = reactive([])
    const setItemRef = el => {
      if (el) {
        containersRefs.push(el)
      }
    }

    const screenShare = new ScreenShare(streams, containersRefs, peerId, mainStream, isShareScreen, store)
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
      mainStream?.value.getTracks().forEach(t => {
        t.stop()
      })
      childStream?.forEach(stream => {
        stream.getTracks().forEach(track => {
          track.stop()
        })
      })
    })


    onBeforeUpdate(() => {
      containersRefs.length = 0
    })


    // ==== socket ==== //

    socket.on('getUsers', (users) => {
      console.log('users', users);
      roomUsers.value = users
    });



    socket.on('userJoinedRoom', (userId) => {
      console.log('containersRefs', containersRefs)
      console.log('Connected user with id', userId, mainStream.value)
      connectToNewUser(userId, mainStream.value)
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

    watch(isPauseVideo, () => {
      socket.emit('videoPause', {
        userId: userId.value,
        roomId
      })
    })

    watch(isShareScreen, (status) => {
      if (status) {
        screenShare.startShareScreen()
      } else {
        screenShare.stopShareScreen()
      }
    })

    watch(isRecordScreen, (status) => {
      if (status) {
        startScreenRecorder(isRecordScreen)
      } else {
        stopScreenRecorder()
      }
    })

    // ==== peers ==== //

    const myPeer = new Peer({
      path: '/peer',
      host: '/',
      port: process.env.VUE_APP_PEER_PORT
    })


    const getUserMedia =
      navigator.mediaDevices.getUserMedia ||
      navigator.mediaDevices.webkitGetUserMedia ||
      navigator.mediaDevices.mozGetUserMedia;

    getUserMedia({
      audio: true,
      video: { aspectRatio: 16 / 9 }
    }).then(stream => {
      mediaError.value = false
      //localStream.value = stream
      //console.log('localStream',localStream)
      mainStream.value = stream
      console.log('localStream', stream) // new - temp    
      containersRefs.forEach(item => {
        if (item.peerId === peerId.value) {
          item.setStream(stream)
          item.muteYourSelf()
        }
      })

      stream.addEventListener('addtrack', (event) => {
        console.log(`New ${event.track.kind} track added`);
      });

    }).catch((e) => {
      mediaError.value = true
      console.log('e',e)
      store.commit('auth/setErrorMessage', 'Could not start video source')
    })


    myPeer.on('call', call => {
      console.log("answer")
      streams.push(call)
      getUserMedia({
        audio: true,
        video: { aspectRatio: 16 / 9 }
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
      streams.push(call);

      call.on('stream', userVideoStream => {
        console.log('connectToNewUser audio stream')
        containersRefs.forEach(item => {
          if (item.peerId === userId) {
            item.setStream(userVideoStream)
          }
        })
      })
      call.on('close', () => {
        console.log('CLOSE CONNECT')
      })
    }

    return {
      roomUsers,
      setItemRef
    }
  }
}

</script>
