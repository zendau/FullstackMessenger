<template>
  <video-container-vue
    v-for="user in roomUsers"
    :key="user.userId"
    :ref="setItemRef"
    :is-muted="user.mute"
    :user-name="user.userLogin"
    :is-pause-video="user.pause"
  />
</template>

<script>
import { useRoute } from "vue-router";
import { onUnmounted, ref, inject, watch, onBeforeUpdate, reactive } from "vue";
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

    const userId = ref(null);
    const peerId = ref(null);
    const peerConnected = ref(false);

    const mediaError = inject("mediaError");
    const socket = inject("socket", undefined);
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

    // Change muted status
    watch(isMuted, () => {
      socket.emit("userMute", {
        userId: userId.value,
        roomId,
      });
    });

    // Change video pause status
    watch(isPauseVideo, () => {
      socket.emit("videoPause", {
        userId: userId.value,
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
      socket.emit("exit-room", {
        userId: userId.value,
        roomId: roomId,
      });
      window.removeEventListener("keypress", muteEvent);
      socket.removeAllListeners("getUsers");
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

    socket.on("getUsers", (users) => {
      console.log(users);
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

    // ==== peers ==== //

    const peerConnect = new Peer({
      path: "/peer",
      host: "/",
      port: import.meta.env.VUE_APP_PEER_PORT,
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
    });

    // connected to new user
    function connectToNewUser(userId, stream) {
      const call = peerConnect.call(userId, stream);
      streams.push(call);

      // connected user's stream
      call.on("stream", (userVideoStream) => {
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
