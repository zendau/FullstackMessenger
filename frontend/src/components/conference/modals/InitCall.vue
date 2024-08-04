<template>
  <ModalWindow :is-show-c-t-x="isCaller">
    <div class="modal">
      <div class="container">
        <h2>{{ $t("conference.initCall.callTo") }} {{ callingData.chatTitle }}</h2>
        <button
          class="modal__btn"
          @click="cancelCalling"
        >
          {{ $t("conference.initCall.cancel") }}
        </button>
      </div>
    </div>
  </ModalWindow>
</template>

<script>
import ModalWindow from "@/components/UI/ModalWindow.vue";
import { inject, onUpdated, ref } from "vue";

export default {
  components: { ModalWindow },
  props: {
    isCaller: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const callingData = inject("callingData");
    const callingTimer = ref(null);

    const peerSocket = inject("peerSocket");
    const audio = new Audio("/audio/call_calling.mp3");
    audio.loop = true;

    onUpdated(() => {
      if (!callingData.value) {
        closeCTX();
        return;
      }

      audio.play();

      peerSocket.emit("initInviteCalling", callingData.value);
    });

    function cancelCalling() {
      peerSocket.emit("cancelCalling", callingData.value);
      closeCTX();
    }

    function closeCTX() {
      audio.pause();
      audio.currentTime = 0;
      clearTimeout(callingTimer.value);
      callingData.value = null;
    }

    return {
      cancelCalling,
      callingData,
      closeCTX,
    };
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 90%;
  align-items: center;

  h2 {
    margin-bottom: 30px;
  }
}
</style>
