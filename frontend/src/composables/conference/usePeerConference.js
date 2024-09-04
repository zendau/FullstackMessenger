import { ref, reactive } from "vue";

import { useMediaDevices } from "./useMediaDevices";
import { useStore } from "vuex";
import { usePeerConnection } from "./usePeerConnection";

const containersRefs = reactive([]);
const streams = reactive([]);
const childStream = [];
const peerId = ref(null);
const peerConnected = ref(false);

export function usePeerConference() {
  const { peerConnect } = usePeerConnection();
  const store = useStore();

  function initPeerListeners(withVideo = false) {
    // answer to call
    peerConnect.value.on("call", async (call) => {
      try {
        streams.push(call);

        // Another user media stream
        const { stream } = await useMediaDevices(withVideo);

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
        store.commit("alert/setErrorMessage", "Could not start video source");
      }
    });

    // join to peer server
    peerConnect.value.on("open", (id) => {
      peerId.value = id;
      peerConnected.value = true;
    });
  }

  // connected to new user
  function connectToNewUser(userId, stream) {
    const call = peerConnect.value.call(userId, stream);
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
    peerId,
    streams,
    childStream,
    peerConnected,
    containersRefs,
    connectToNewUser,
    initPeerListeners,
  };
}
