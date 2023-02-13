<template>
  <div
    class="drag__container"
    @dragover.prevent
    @drop.prevent
  >
    <div
      v-if="dragStatus"
      class="area"
      @dragleave.prevent="dragLeave"
      @drop="dataDrop"
    >
      {{ $t("chat.fileUpload.message") }}
    </div>
    <div
      v-else
      class="area2"
      @dragenter.prevent="dragStart"
    >
      <slot />
    </div>
  </div>
</template>

<script>
import { inject, ref } from "vue";
export default {
  setup() {
    const dragStatus = ref(false);
    const files = inject("files");

    function dragStart() {
      dragStatus.value = true;
    }

    function dragLeave() {
      dragStatus.value = false;
    }

    function dataDrop(e) {
      files.value.push(...e.dataTransfer.files);
      dragStatus.value = false;
      console.log(files.value);
    }

    return {
      files,
      dragStatus,
      dragStart,
      dragLeave,
      dataDrop,
    };
  },
};
</script>

<style lang="scss" scoped>
.area {
  width: 100%;
  height: 100%;
  display: flex;
  border: 1px dashed black;
  align-items: center;
  justify-content: center;
  color: var(--activeColor);
  background-color: var(--activeBgcColor);
}

.drag__container {
  overflow: hidden;
  height: 100%;
}

.area2 {
  overflow: hidden;
  height: 100%;
}
</style>
