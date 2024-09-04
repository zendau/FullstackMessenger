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
import { inject, watch, computed } from "vue";
import { useStore } from "vuex";


import videoContainerVue from "@/components/conference/VideoContainer.vue";
import { startScreenRecorder, stopScreenRecorder } from "@/utils/screenRecorder";
import ScreenShare from "@/utils/screenShare";
import { usePeerConference } from "./usePeerConference";

export default {
  components: { videoContainerVue },
  setup() {


    const route = useRoute();
    const store = useStore();

    const roomUsers = inject('roomUsers', []);
    const roomId = route.params.id;

    const roomData = computed(() => store.getters["chat/selectedChat"](roomId));

    const userData = computed(() => store.state.auth.user);

    const peerSocket = inject("peerSocket");

    const isPauseVideo = inject("isPauseVideo");
    const isShareScreen = inject("isShareScreen");
    const isRecordScreen = inject("isRecordScreen");
    const localeStream = inject('localeStream')




    const {containersRefs, streams, peerId } = usePeerConference()


    const setItemRef = (el) => {
      if (el) {
        containersRefs.push(el);
        if (el.peerId === peerId.value && localeStream.value) {
          el.setStream(localeStream.value);
          el.muteYourSelf();
        }
      }
    };

    const screenShare = new ScreenShare(streams, containersRefs, peerId, localeStream, isShareScreen, store);

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

    return {
      roomUsers,
      setItemRef,
      roomData,
    };
  },
};
</script>
