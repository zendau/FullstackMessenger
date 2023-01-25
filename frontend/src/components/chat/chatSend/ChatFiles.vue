<template>
  <ul
    v-if="files.length > 0"
    class="chat__files"
  >
    <li
      v-for="(file, index) in files"
      :key="index"
      class="chat__file"
      @click="deleteFileById(index, file)"
    >
      <i class="bi bi-file-earmark-arrow-down" />{{ file?.name ?? file?.fileName }}
    </li>
  </ul>
</template>

<script>
import { inject } from "vue";

export default {
  emits: ["delete-file"],
  setup(_, { emit }) {
    const files = inject("files");

    function deleteFileById(index, file) {
      emit("delete-file", index, file);
    }

    return {
      deleteFileById,
      files,
    };
  },
};
</script>

<style></style>
