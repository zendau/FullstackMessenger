<template>
  <InitCall :is-caller="isCaller" />
  <ReceiveCall :is-caller="isAnswerer" />
  <!-- {{ callData }}
  {{ peerId }} -->
</template>

<script>
import InitCall from "@/components/conference/modals/InitCall.vue";
import ReceiveCall from "@/components/conference/modals/ReceiveCall.vue";
import { inject, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default {
  components: { InitCall, ReceiveCall },
  setup() {
    const store = useStore();
    const router = useRouter();
    const peerId = computed(() => store.state.auth.user.peerId);
    const peerSocket = inject("peerSocket");
    const callingData = inject("callingData");

    const rejectedAnswerers = [];

    const isCaller = computed(() => {
      if (!callingData.value || !peerId.value) return false;

      return callingData.value.from.peerId === peerId.value;
    });

    const isAnswerer = computed(() => !isCaller.value && !!callingData.value?.from);

    function clearCallingData() {
      callingData.value = null;
      rejectedAnswerers.length = 0;
    }

    peerSocket.on("receiveInviteCalling", (callData) => {
      console.log("receiveInviteCalling", callData);
      callingData.value = callData;
    });

    peerSocket.on("cancelInviteCalling", (callData) => {
      console.log("cancelInviteCalling", callData);
      clearCallingData();
    });

    peerSocket.on("acceptInviteCalling", (callData) => {
      console.log("acceptInviteCalling", callData);
      clearCallingData();
      router.push(`/conference/video/${callData.confrenceId}`);
    });

    peerSocket.on("rejectInviteCalling", (rejectedUser) => {
      console.log("rejectInviteCalling", rejectedUser);

      if (!callingData.value) return;

      rejectedAnswerers.push(rejectedUser);
      console.log(rejectedAnswerers, callingData.value, peerId.value);
      if (
        callingData.value.from.peerId === peerId.value &&
        callingData.value.users.length === rejectedAnswerers.length
      ) {
        console.log("ALL USERS REJECTED  CALL");
        clearCallingData();
      }
    });

    return {
      clearCallingData,
      isCaller,
      isAnswerer,
    };
  },
};
</script>

<style></style>
