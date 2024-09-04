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
import { inject, watch, computed } from "vue";
import { useStore } from "vuex";

import { startRecordAudio } from "@/utils/audioRecorder";
import AudioContainer from "@/components/conference/AudioContainer.vue";
import { usePeerConference } from "./usePeerConference";

export default {
  components: { AudioContainer },
  setup() {
    const store = useStore();

    const roomUsers = inject("roomUsers", []);
    const roomTitle = computed(() => store.state.conference.title);

    const isRecord = inject("isRecord");

    const localeStream = inject("localeStream");
    const { containersRefs, streams } = usePeerConference();

    const setItemRef = (el) => {
      if (el) {
        containersRefs.push(el);
      }
    };

    let mediaRecorder = null;

    watch(isRecord, (newStatus) => {
      if (newStatus) {
        mediaRecorder = startRecordAudio(
          localeStream.value,
          streams,
          roomTitle.value
        );
      } else {
        mediaRecorder.stop();
      }
    });

    return {
      roomUsers,
      setItemRef,
    };
  },
};
</script>
