<template>
  <video-container-vue
    v-for="user in roomUsers"
    :key="user[1].userId"
    :ref="setItemRef"
    :is-muted="user[1].mute"
    :user-name="user[1].userLogin"
    :is-pause-video="user[1].pause"
    :is-admin="false"
    :peer-id="user[1].peerId"
  />
</template>

<script>
import { useRoute } from "vue-router";
import { onUnmounted, ref, inject, watch, onBeforeUpdate, reactive, computed } from "vue";
import { useStore } from "vuex";

import Peer from "peerjs";

import videoContainerVue from "@/components/conference/VideoContainer.vue";
import { startScreenRecorder, stopScreenRecorder } from "@/utils/screenRecorder";
import ScreenShare from "@/utils/screenShare";

export default {
  components: { videoContainerVue },
  setup() {
    // ==== state ==== //

    const route = useRoute();
    const store = useStore();

    const roomUsers = ref([]);
    const roomId = route.params.id;

    const userData = computed(() => store.state.auth.user);
    const peerId = ref(null);
    const peerConnected = ref(false);

    const mediaError = inject("mediaError");
    const peerSocket = inject("peerSocket");
    const socketConnected = inject("peerSocketConnected", false);
    const isMuted = inject("isMuted");
    const isPauseVideo = inject("isPauseVideo");
    const isShareScreen = inject("isShareScreen");
    const isRecordScreen = inject("isRecordScreen");

    const streams = reactive([]);
    const mainStream = ref(null);
    const childStream = [];

    const containersRefs = reactive([]);
    const setItemRef = (el) => {
      if (el) {
        containersRefs.push(el);
      }
    };

    const screenShare = new ScreenShare(streams, containersRefs, peerId, mainStream, isShareScreen, store);

    // ==== hooks ==== //

    // Wait socket connected and join to room
    watch(
      [socketConnected, peerConnected],
      ([socketStatus, peerStatus]) => {
        if (socketStatus && peerStatus) {
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

    // Change muted status
    watch(isMuted, () => {
      peerSocket.emit("userMute", {
        userId: userData.value.id,
        roomId,
      });
    });

    // Change video pause status
    watch(isPauseVideo, () => {
      peerSocket.emit("videoPause", {
        userId: userData.value.id,
        roomId,
      });
    });

    // Change share screen status
    watch(isShareScreen, (status) => {
      if (status) {
        screenShare.startShareScreen();
      } else {
        screenShare.stopShareScreen();
      }
    });

    // Change record screen status
    watch(isRecordScreen, (status) => {
      if (status) {
        startScreenRecorder(isRecordScreen);
      } else {
        stopScreenRecorder();
      }
    });

    // Exit from room and clear data
    onUnmounted(() => {
      peerSocket.emit("exit-room", {
        userId: userData.value.id,
        roomId: roomId,
      });
      window.removeEventListener("keypress", muteEvent);
      peerSocket.removeAllListeners("getUsers");
      mainStream?.value.getTracks().forEach((t) => {
        t.stop();
      });
      childStream?.forEach((stream) => {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      });
    });

    onBeforeUpdate(() => {
      containersRefs.length = 0;
    });

    // ==== socket ==== //

    peerSocket.on("getUsers", (users) => {
      roomUsers.value = new Map(JSON.parse(users));
      console.log("ROOM USERS", roomUsers.value, JSON.parse(users));
    });

    peerSocket.on("userJoinedRoom", (userId) => {
      connectToNewUser(userId, mainStream.value);
    });

    // ==== events ==== //
    window.addEventListener("keypress", muteEvent);

    function muteEvent(event) {
      if (event.code === "KeyM") {
        isMuted.value = !isMuted.value;
      }
    }

    // ==== peers ==== //

    const peerConnect = new Peer({
      path: "/peer",
      host: "/",
      port: import.meta.env.VITE_PEER_PORT,
    });

    const getUserMedia =
      navigator.mediaDevices.getUserMedia ||
      navigator.mediaDevices.webkitGetUserMedia ||
      navigator.mediaDevices.mozGetUserMedia;

    // User media stream
    getUserMedia({
      audio: true,
      video: { aspectRatio: 16 / 9 },
    })
      .then((stream) => {
        mediaError.value = false;
        mainStream.value = stream;
        containersRefs.forEach((item) => {
          if (item.peerId === peerId.value) {
            item.setStream(stream);
            item.muteYourSelf();
          }
        });
      })
      .catch(() => {
        mediaError.value = true;
        store.commit("alert/setErrorMessage", "Could not start video source");
      });

    // answer to call
    peerConnect.on("call", async (call) => {
      console.log("CALL FROM USER", call);
      try {
        streams.push(call);

        // Another user media stream
        const stream = await getUserMedia({
          audio: true,
          video: { aspectRatio: 16 / 9 },
        });

        childStream.push(stream);
        call.answer(stream);

        // answer to  stream
        call.on("stream", (userVideoStream) => {
          containersRefs.forEach((item) => {
            console.log("item.peerId === call.peer", item, item.peerId, call.peer);
            if (item.peerId === call.peer) {
              item.setStream(userVideoStream);
            }
          });
        });
      } catch {
        mediaError.value = true;
        store.commit("alert/setErrorMessage", "Could not start video source");
      }
    });

    // join to peer server
    peerConnect.on("open", (id) => {
      peerId.value = id;
      peerConnected.value = true;
      console.log("OPEN", peerConnected.value, peerId.value);
    });

    // connected to new user
    function connectToNewUser(userId, stream) {
      console.log("CALL TO USER", userId, stream);
      const call = peerConnect.call(userId, stream);
      streams.push(call);

      // connected user's stream
      call.on("stream", (userVideoStream) => {
        console.log("STREAM");
        containersRefs.forEach((item) => {
          if (item.peerId === userId) {
            item.setStream(userVideoStream);
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
