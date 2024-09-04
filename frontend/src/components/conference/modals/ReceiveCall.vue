<template>
  <ModalWindow :is-show-c-t-x="isCaller">
    <div class="modal">
      <div class="container">
        <h2>
          {{ $t("conference.receiveCall.callFrom") }}
          {{ callingData.from.login }}
        </h2>
        <div class="modal__container-btn">
          <button
            class="modal__btn"
            @click="acceptCall"
          >
            {{ $t("conference.receiveCall.accept") }}
          </button>
          <button
            class="modal__btn"
            @click="rejectCall"
          >
            {{ $t("conference.receiveCall.reject") }}
          </button>
        </div>
      </div>
    </div>
  </ModalWindow>
</template>

<script>
import ModalWindow from "@/components/UI/ModalWindow.vue";
import { inject, onUpdated, ref } from "vue";
import { useRouter } from "vue-router";
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
    const peerSocket = inject("peerSocket");
    const callingTimer = ref(null);
    const router = useRouter();

    const audio = new Audio("/audio/call_ringing.mp3");
    audio.loop = true;

    onUpdated(() => {
      if (!callingData.value) {
        closeCTX();
        return;
      }

      audio.play();

      callingTimer.value = setTimeout(() => {
        rejectCall();
      }, 15000);
    });

    function acceptCall() {
      console.log("accept call", callingData.value);
      peerSocket.emit("acceptCalling", callingData.value);
      router.push(
        `/conference/${callingData.value.withVideo ? "video" : "audio"}/${
          callingData.value.confrenceId
        }`
      );
      closeCTX();
    }

    function rejectCall() {
      console.log("reject call");
      peerSocket.emit("rejectCalling", callingData.value);
      closeCTX();
    }

    function closeCTX() {
      audio.pause();
      audio.currentTime = 0;
      console.log("callingTimer.value", callingTimer.value);
      clearTimeout(callingTimer.value);
      callingData.value = null;
    }

    return {
      acceptCall,
      rejectCall,
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
