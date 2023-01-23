<template>
  <audio-container-vue
    v-for="user in roomUsers"
    :key="user.userId"
    :ref="setItemRef"
    :peer-id="user.peerId"
    :is-muted="user.mute"
    :user-name="user.userLogin"
  />
</template>

<script>
import { useRoute } from "vue-router";
import { onUnmounted, ref, inject, watch, onBeforeUpdate, computed, reactive } from "vue";
import { useStore } from "vuex";
import Peer from "peerjs";

import { startRecordAudio } from "@/utils/audioRecorderioRecorder";
import audioContainerVue from "@/components/conterence/audioContainer.vue";

export default {
  components: { audioContainerVue },
  setup() {
    // ==== state ==== //

    const route = useRoute();
    const store = useStore();

    const roomUsers = ref([]);
    const roomId = route.params.id;
    const roomTitle = computed(() => store.state.conference.title);

    const userId = ref(null);
    const peerId = ref(null);
    const peerConnected = ref(false);

    const socket = inject("socket", undefined);
    const socketConnected = inject("peerSocketConnected", false);

    const isRecord = inject("isRecord");
    const isMuted = inject("isMuted");

    const mainStream = ref(null);
    const childStream = [];
    const streams = reactive([]);

    let containersRefs = [];
    const setItemRef = (el) => {
      if (el) {
        containersRefs.push(el);
      }
    };

    let mediaRecorder = null;

    // ==== hooks ==== //

    watch(
      [socketConnected, peerConnected],
      ([socketStatus, peerStatus]) => {
        if (socketStatus && peerStatus) {
          userId.value = socket.id;
          socket.emit("join-room", {
            userId: userId.value,
            peerId: peerId.value,
            roomId: roomId,
          });
        }
      },
      {
        immediate: true,
      }
    );

    watch(isRecord, (newStatus) => {
      if (newStatus) {
        mediaRecorder = startRecordAudio(mainStream.value, streams, roomTitle.value);
      } else {
        mediaRecorder.stop();
      }
    });

    watch(isMuted, () => {
      socket.emit("userMute", {
        userId: userId.value,
        roomId,
      });
    });

    onUnmounted(() => {
      socket.emit("exit-room", {
        userId: userId.value,
        roomId: roomId,
      });
      window.removeEventListener("keypress", muteEvent);
      socket.removeAllListeners("getUsers");
      mainStream.value.getTracks().forEach((t) => {
        t.stop();
      });
      childStream?.forEach((stream) => {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      });
    });

    onBeforeUpdate(() => {
      containersRefs = [];
    });

    // ==== socket ==== //

    socket.on("getUsers", (users) => {
      roomUsers.value = users;
    });

    socket.on("userJoinedRoom", (userId) => {
      connectToNewUser(userId, mainStream.value);
    });

    // ==== events ==== //
    window.addEventListener("keypress", muteEvent);

    function muteEvent(event) {
      if (event.code === "KeyM") {
        isMuted.value = !isMuted.value;
      }
    }

    // ==== peer ==== //

    const peerConnect = new Peer({
      path: "/peer",
      host: "/",
      port: import.meta.env.VUE_APP_PEER_PORT,
    });

    const getUserMedia =
      navigator.mediaDevices.getUserMedia ||
      navigator.mediaDevices.webkitGetUserMedia ||
      navigator.mediaDevices.mozGetUserMedia;

    getUserMedia({
      audio: true,
    }).then((stream) => {
      mainStream.value = stream;
    });

    peerConnect.on("call", (call) => {
      getUserMedia({
        audio: true,
      }).then((stream) => {
        childStream.push(stream);
        call.answer(stream);
        call.on("stream", (userAudiotream) => {
          streams.push(userAudiotream);
          containersRefs.forEach((item) => {
            if (item.peerId === call.peer) {
              item.setStream(userAudiotream);
            }
          });
        });
      });
    });

    peerConnect.on("open", (id) => {
      peerId.value = id;
      peerConnected.value = true;
    });

    function connectToNewUser(userId, stream) {
      const call = peerConnect.call(userId, stream);

      call.on("stream", (userAudiotream) => {
        streams.push(userAudiotream);
        containersRefs.forEach((item) => {
          if (item.peerId === userId) {
            item.setStream(userAudiotream);
          }
        });
      });
    }

    return {
      roomUsers,
      setItemRef,
    };
  },
};
</script>
