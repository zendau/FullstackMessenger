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
      <font-awesome-icon icon="fa-solid fa-file" />
      <p>{{ file?.name ?? file?.fileName }}</p>
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

<style lang="scss" scoped>
.chat {
  &__file {
    cursor: pointer;
    margin: 3px 8px;
    display: flex;

    svg {
      margin-right: 5px;
    }
  }
}
</style>
