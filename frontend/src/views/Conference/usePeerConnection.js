import { ref, computed } from "vue";
import Peer from "peerjs";

const peerConnect = ref(null);

export function usePeerConnection() {
  const isConnected = computed(() => !!peerConnect.value);

  function connect() {
    peerConnect.value = new Peer({
      path: "/peer",
      host: "/",
      port: import.meta.env.VITE_PEER_PORT,
    });
  }

  if (!peerConnect.value) {
    connect();
  }

  return { peerConnect, isConnected, connect };
}
