<template>
  <input
    :placeholder="$t('chat.searchInput.placeholder')"
    type="text"
    @input="searchByPattern"
  >
</template>

<script>
import debounce from "@/utils/debounce";

export default {
  emits: ["search-pattern"],
  setup(_, { emit }) {
    const searchByPattern = debounce((el) => {
      const pattern = el.target.value;
      emit("search-pattern", pattern);
    });
    return {
      searchByPattern,
    };
  },
};
</script>

<style></style>
