<template >
  <div class="drag__container" @dragover.prevent @drop.prevent>
    <div
      class="area"
      v-if="dragStatus"
      @dragleave.prevent="dragLeave"
      @drop="dataDrop"
    >
      Опустите файл(ы), для загрузки
    </div>
    <div v-else class="area2" @dragenter.prevent="dragStart">
      <slot />
    </div>
  </div>
</template>

<script>
import { inject, ref } from "vue";
//import { useStore } from 'vuex'
export default {
  setup() {

    //const store = useStore()

    const dragStatus = ref(false);
    const files = inject('files')

    function dragStart(e) {
      console.log("START", e);
      dragStatus.value = true;
    }

    function dragLeave(e) {
      console.log("LEAVE", e);
      dragStatus.value = false;
    }

    function dataDrop(e) {
      files.value.push(...e.dataTransfer.files);
      dragStatus.value = false;
      console.log(files.value);
    }

    return {
      dragStatus,
      dragStart,
      dragLeave,
      dataDrop,
      files,
    };
  },
};
</script>

<style lang='scss' scoped>
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