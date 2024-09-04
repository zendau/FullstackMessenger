<template>
  <AudioContainer
    v-for="user in roomUsers"
    :key="user[1].userId"
    :ref="setItemRef"
    :is-muted="user[1].mute"
    :user-name="user[1].userLogin"
    :peer-id="user[1].peerId"
  />
</template>

<script>
import { useRoute } from "vue-router";
import { onUnmounted, ref, inject, watch, onBeforeUpdate, computed, reactive } from "vue";
import { useStore } from "vuex";
import Peer from "peerjs";

import { startRecordAudio } from "@/utils/audioRecorder";
import AudioContainer from "@/components/conference/AudioContainer.vue";

export default {
  components: { AudioContainer },
  setup() {

    const route = useRoute();
    const store = useStore();

    const roomUsers = ref([]);
    const roomId = route.params.id;
    const roomTitle = computed(() => store.state.conference.title);

    const userData = computed(() => store.state.auth.user);
    const peerId = ref(null);
    const peerConnected = ref(false);

    const peerSocket = inject("peerSocket");
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

    watch(
      [socketConnected, peerConnected],
      async ([socketStatus, peerStatus]) => {
        if (socketStatus && peerStatus) {
          mainStream.value = await initUserMedia();
          peerSocket.emit("join-room", {
            userId: userData.value.id,
            userLogin: userData.value.login,
            peerId: peerId.value,
            roomId,
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
      peerSocket.emit("userMute", {
        userId: userData.value.id,
        roomId,
      });
    });

    onUnmounted(() => {
      peerSocket.emit("exit-room", {
        userId: userData.value.id,
        roomId,
      });
      window.removeEventListener("keypress", muteEvent);
      peerSocket.removeAllListeners("getUsers");
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



    peerSocket.on("getUsers", (users) => {
      console.log("users", users);
      roomUsers.value = new Map(JSON.parse(users));
    });

    peerSocket.on("userJoinedRoom", (userId) => {
      connectToNewUser(userId, mainStream.value);
    });


    window.addEventListener("keypress", muteEvent);

    function muteEvent(event) {
      if (event.code === "KeyM") {
        isMuted.value = !isMuted.value;
      }
    }


    const peerConnect = new Peer({
      path: "/peer",
      host: "/",
      port: import.meta.env.VITE_PEER_PORT,
    });

    async function initUserMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        console.log("set mainStream");
        return stream;
      } catch (e) {
        store.commit("alert/setErrorMessage", "Could not start video source");
      }
    }

    peerConnect.on("call", async (call) => {
      const stream = await initUserMedia();
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
