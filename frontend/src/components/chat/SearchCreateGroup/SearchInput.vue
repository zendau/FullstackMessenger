<template>
  <div class="search__container">
    <input
      :placeholder="$t('chat.searchInput.placeholder')"
      type="text"
      class="search__input"
      @input="searchByPattern"
    >
    <font-awesome-icon
      class="search__icon"
      icon="fa-solid fa-magnifying-glass"
    />
  </div>
</template>

<script>
import debounce from "@/utils/debounce";

export default {
  emits: ["search-pattern"],
  setup(_, { emit }) {
    const searchByPattern = debounce((el) => {
      const pattern = el.target.value;
      emit("search-pattern", pattern);
    }, 500);
    return {
      searchByPattern,
    };
  },
};
</script>

<style lang="scss" scoped>
.search {
  &__container {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
  }

  &__input {
    color: var(--color-primary);
    background-color: var(--input-background);
    width: 100%;
    height: 40px;
    border: none;
    padding: 6px 45px;
    margin: 11px;
    border-radius: 50px;
    font-size: 16px;
    box-sizing: border-box;
  }

  &__icon {
    color: var(--color-icon);
    left: 30px;
    position: absolute;
    top: 22px;
  }
}
</style>
