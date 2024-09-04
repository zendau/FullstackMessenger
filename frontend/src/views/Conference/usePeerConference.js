import { ref, reactive } from "vue";
import Peer from "peerjs";
import { useMediaDevices } from "./useMediaDevices";
import { useStore } from "vuex";

const peerConnect = ref(null);

function connectToPeer() {
  peerConnect.value = new Peer({
    path: "/peer",
    host: "/",
    port: import.meta.env.VITE_PEER_PORT,
  });
}

export function usePeerConnection() {
  const containersRefs = reactive([]);
  const peerId = ref(null);
  const peerConnected = ref(false);
  const streams = reactive([]);
  const childStream = [];
  console.log("init refs");

  const store = useStore();

  if (!peerConnect.value) {
    connectToPeer();
  }

  // answer to call
  peerConnect.value.on("call", async (call) => {
    console.log("CALL FROM USER", call);
    try {
      streams.push(call);

      // Another user media stream
      const { stream } = await useMediaDevices(true);
      // eslint-disable-next-line no-debugger
      debugger;
      childStream.push(stream);
      call.answer(stream);

      // answer to  stream
      call.on("stream", (userVideoStream) => {
        console.log("answer stream", userVideoStream);
        console.log("refs", containersRefs);
        containersRefs.forEach((item) => {
          console.log(
            "item.peerId === call.peer",
            item,
            item.peerId,
            call.peer
          );
          // eslint-disable-next-line no-debugger
          debugger;
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
  peerConnect.value.on("open", (id) => {
    peerId.value = id;
    peerConnected.value = true;
    console.log("OPEN", peerConnected.value, peerId.value);
  });

  // connected to new user
  function connectToNewUser(userId, stream) {
    // eslint-disable-next-line no-debugger
    debugger;
    const call = peerConnect.value.call(userId, stream);
    streams.push(call);

    // connected user's stream
    call.on("stream", (userVideoStream) => {
      console.log("STREAM123", userVideoStream);
      console.log("refs", containersRefs);
      containersRefs.forEach((item) => {
        // eslint-disable-next-line no-debugger
        debugger;
        if (item.peerId === userId) {
          console.log("3");
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
  };
}
