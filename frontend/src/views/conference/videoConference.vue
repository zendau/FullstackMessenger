<template>
  <video-container-vue
    v-for="user in roomUsers"
    :key="user[1].userId"
    :ref="setItemRef"
    :is-muted="user[1].mute"
    :user-name="user[1].userLogin"
    :is-pause-video="user[1].pause"
    :is-admin="roomData.adminId === user[0]"
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

    const roomData = computed(() => store.getters["chat/selectedChat"](roomId));

    const userData = computed(() => store.state.auth.user);
    const peerId = ref(null);
    const peerConnected = ref(false);

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
        console.log("set el");
        containersRefs.push(el);

        if (el.peerId === peerId.value && mainStream.value) {
          console.log("1", mainStream.value);
          el.setStream(mainStream.value);
          el.muteYourSelf();
        }
      }
    };

    const screenShare = new ScreenShare(streams, containersRefs, peerId, mainStream, isShareScreen, store);

    // ==== hooks ==== //

    // Wait socket connected and join to room
    watch(
      [socketConnected, peerConnected],
      async ([socketStatus, peerStatus]) => {
        console.log("JOIN TO ROOM", socketStatus, peerStatus);
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
    watch(isShareScreen, async (status) => {
      if (status) {
        const res = await screenShare.startShareScreen();
        if (!res) isShareScreen.value = false;
      } else {
        screenShare.stopShareScreen();
      }
    });

    // Change record screen status
    watch(isRecordScreen, async (status) => {
      if (status) {
        const res = await startScreenRecorder(isRecordScreen);
        if (!res) isRecordScreen.value = false;
      } else {
        stopScreenRecorder();
      }
    });

    // Exit from room and clear data
    onUnmounted(() => {
      peerSocket.emit("exit-room", {
        userId: userData.value.id,
        roomId,
      });
      window.removeEventListener("keypress", muteEvent);
      peerSocket.removeAllListeners("getUsers");
      mainStream?.value?.getTracks().forEach((t) => {
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
      console.log("userJoinedRoom", userId, new Date().getTime());
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

    console.log("navigator.mediaDevices", navigator.mediaDevices);

    // User media stream

    async function initUserMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: { aspectRatio: 16 / 9, facingMode: "user" },
        });

        console.log("set mainStream");
        return stream;
      } catch (e) {
        store.commit("alert/setErrorMessage", "Could not start video source");
      }

      // .then((stream) => {

      // })
      // .catch((e) => {
      //   console.log("!!!!!!!!!!!!!!!!!1e", e);
      //   store.commit("alert/setErrorMessage", "Could not start video source");
      // });
    }

    // answer to call
    peerConnect.on("call", async (call) => {
      console.log("CALL FROM USER", call);
      try {
        streams.push(call);

        // Another user media stream
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: { aspectRatio: 16 / 9, facingMode: "user" },
        });

        childStream.push(stream);
        call.answer(stream);

        // answer to  stream
        call.on("stream", (userVideoStream) => {
          containersRefs.forEach((item) => {
            console.log("item.peerId === call.peer", item, item.peerId, call.peer);
            if (item.peerId === call.peer) {
              console.log("2");
              item.setStream(userVideoStream);
            }
          });
        });
      } catch {
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
      const call = peerConnect.call(userId, stream);
      streams.push(call);

      // connected user's stream
      call.on("stream", (userVideoStream) => {
        console.log("STREAM");
        containersRefs.forEach((item) => {
          if (item.peerId === userId) {
            console.log("3");
            item.setStream(userVideoStream);
          }
        });
      });
    }

    return {
      roomUsers,
      setItemRef,
      roomData,
    };
  },
};
</script>
