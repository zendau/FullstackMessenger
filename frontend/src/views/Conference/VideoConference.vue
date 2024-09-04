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
import { onUnmounted, ref, inject, watch, computed, onBeforeUpdate } from "vue";
import { useStore } from "vuex";


import videoContainerVue from "@/components/conference/VideoContainer.vue";
import { startScreenRecorder, stopScreenRecorder } from "@/utils/screenRecorder";
import ScreenShare from "@/utils/screenShare";
import { usePeerConnection } from "./usePeerConference";
import { useMediaDevices } from "./useMediaDevices";
import { useEventListener } from "./useEventListener";

export default {
  components: { videoContainerVue },
  setup() {


    const route = useRoute();
    const store = useStore();

    const roomUsers = ref([]);
    const roomId = route.params.id;

    const roomData = computed(() => store.getters["chat/selectedChat"](roomId));

    const userData = computed(() => store.state.auth.user);

    const peerSocket = inject("peerSocket");
    const socketConnected = inject("peerSocketConnected", false);
    const isMuted = inject("isMuted");
    const isPauseVideo = inject("isPauseVideo");
    const isShareScreen = inject("isShareScreen");
    const isRecordScreen = inject("isRecordScreen");


    const mainStream = ref(null);


    const {containersRefs, streams, connectToNewUser, peerConnected, peerId, childStream} = usePeerConnection()

    const setItemRef = (el) => {
      if (el) {
        containersRefs.push(el);
        if (el.peerId === peerId.value && mainStream.value) {
          el.setStream(mainStream.value);
          el.muteYourSelf();
        }
      }
    };

    const screenShare = new ScreenShare(streams, containersRefs, peerId, mainStream, isShareScreen, store);
    const isReadyToJoin = computed(() => socketConnected.value && peerConnected.value);

    watch(
      isReadyToJoin,
      async (ready) => {
        if (ready) {
          const {stream} = await useMediaDevices(true);
          mainStream.value = stream


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



    peerSocket.on("getUsers", (users) => {
      roomUsers.value = new Map(JSON.parse(users));
    });

    peerSocket.on("userJoinedRoom", (userId) => {
      connectToNewUser(userId, mainStream.value);
    });

    useEventListener("keypress", muteEvent)


    function muteEvent(event) {
      if (event.code === "KeyM") {
        isMuted.value = !isMuted.value;
      }
    }

    return {
      roomUsers,
      setItemRef,
      roomData,
    };
  },
};
</script>
