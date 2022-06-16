<template>
  <audio-container-vue v-for='user in roomUsers' :key='user.userId' :peerId="user.peerId" :isMuted="user.mute"
    :userName='user.userLogin' :ref="setItemRef" />
  <button @click="test">TEST</button>
</template>


<script>


import { useRoute } from 'vue-router'
import { onUnmounted, ref, inject, watch, onBeforeUpdate } from 'vue'

import audioContainerVue from '../../components/conterence/audioContainer.vue'

import { saveAs } from 'file-saver';
//import { MultiStreamRecorder } from 'recordrtc'

import Peer from 'peerjs';
export default {
  components: { audioContainerVue },
  setup() {

    // ==== vars ==== //

    //const router = useRouter()
    const route = useRoute()

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
      mainStream?.getTracks().forEach(t => {
        t.stop()
      })
      childStream?.forEach(stream => {
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

    // let recordedData = [];
    // let recordedData2 = [];
    // let mediaRecorder = null

    const getUserMedia =
      navigator.mediaDevices.getUserMedia ||
      navigator.mediaDevices.webkitGetUserMedia ||
      navigator.mediaDevices.mozGetUserMedia;

    getUserMedia({
      audio: true
    }).then(stream => {
      //localStream.value = stream
      //console.log('localStream',localStream)

      // mediaRecorder = new MediaRecorder(stream);
      // mediaRecorder.ondataavailable = (event) => {
      //   recordedData.push(event.data)
      //   }

      // mediaRecorder.onstop = (e) => {
      //   console.log("record screen stopped", e);
      // };

      // mediaRecorder.start(1000);

      // setTimeout(() => {
      //   mediaRecorder.stop();
      //   console.log('recorded data', recordedData)
      //   const blob = new Blob(recordedData, {
      //     type: "audio/webm",
      //   });
      //   console.log('blob', blob)
      //   saveAs(blob, 'test.webm')
      //   // console.log("stopping", recordedData)
      //   // const file = new File([recordedData[0]], "yourfilename.webm", { type: "audio/webm" });
      //   // console.log('file', file)
      //   // var url = URL.createObjectURL(new Blob());
      //   // console.log('url', url)
      // }, 10000);

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

        // const tempMediaRecorder = new MediaRecorder(stream);
        // console.log('tempMediaRecorder', tempMediaRecorder)
        // tempMediaRecorder.start(1000);
        // tempMediaRecorder.ondataavailable = (event) => {
        //   recordedData2.push(event.data)
        // }
        //childStream.push(stream)
        call.answer(stream)
        console.log('remoteStream', stream)
        //audio.muted = store.state.users.filter(item => item.id === call.peer)[0].mute
        call.on('stream', userVideoStream => {
          console.log('answer audio stream')
          childStream.push(userVideoStream)
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
        childStream.push(userVideoStream)
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

    async function test() {


      const audioContext = new AudioContext();
      const dest = audioContext.createMediaStreamDestination();


      audioContext.createMediaStreamSource(mainStream).connect(dest)

      childStream.forEach(stream => {
        audioContext.createMediaStreamSource(stream).connect(dest)
      })




      var FinalStream = dest.stream;




   




      var mediaRecorder = new MediaRecorder(FinalStream);
      mediaRecorder.start();

      var chunks = [];

      mediaRecorder.ondataavailable = function (e) {
        chunks.push(e.data);
      }

      setTimeout(() => {
        mediaRecorder.stop();
      }, 10000)

      mediaRecorder.onstop = function () {
        var blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
        saveAs(blob, 'ttt.ogg')
      }

    }

    return {
      roomUsers,
      setItemRef,
      test
    }
  }
}
</script>

