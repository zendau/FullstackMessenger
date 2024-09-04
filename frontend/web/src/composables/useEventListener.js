import { onMounted, onUnmounted } from "vue";

export function useEventListener(event, handler, target = window) {
  onMounted(() => {
    target.addEventListener(event, handler);
  });

  onUnmounted(() => {
    target.removeEventListener(event, handler);
  });
}
