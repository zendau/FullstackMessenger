<template>
  <ModalWindow :is-show-c-t-x="isCaller">
    <div class="test">
      <h2>Call from {{ callingData.from.login }}</h2>
      <button @click="acceptCall">
        Accept
      </button>
      <button @click="rejectCall">
        Reject
      </button>
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

    onUpdated(() => {
      if (!callingData.value) return;

      callingTimer.value = setTimeout(() => {
        rejectCall();
      }, 15000);
    });

    function acceptCall() {
      console.log("accept call");
      peerSocket.emit("acceptCalling", callingData.value);
      router.push(`/conference/video/${callingData.value.confrenceId}`);
      closeCTX();
    }

    function rejectCall() {
      console.log("reject call");
      peerSocket.emit("rejectCalling", callingData.value);
      closeCTX();
    }

    function closeCTX() {
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

<style lang="scss">
.test {
  width: 400px;
  height: 400px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  background-color: var(--bgcColor);
  color: var(--textColor);
}

.close-btn {
  position: absolute;
  right: 32px;
  top: 32px;
  width: 32px;
  height: 32px;
  opacity: 0.3;

  &:hover {
    opacity: 1;
  }

  &:before,
  &:after {
    position: absolute;
    left: 15px;
    content: " ";
    height: 33px;
    width: 2px;
    background-color: #333;
  }

  &:before {
    transform: rotate(45deg);
  }
  &:after {
    transform: rotate(-45deg);
  }
}
</style>
