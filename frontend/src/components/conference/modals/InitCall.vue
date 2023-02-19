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

    onUpdated(() => {
      if (!callingData.value) {
        closeCTX();
        return;
      }

      peerSocket.emit("initInviteCalling", callingData.value);

      // callingTimer.value = setTimeout(() => {
      //   cancelCalling();
      // }, 15000);
    });

    function cancelCalling() {
      console.log("cancelCalling");
      peerSocket.emit("cancelCalling", callingData.value);
      closeCTX();
    }

    function closeCTX() {
      console.log("callingTimer.value", callingTimer.value);
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
