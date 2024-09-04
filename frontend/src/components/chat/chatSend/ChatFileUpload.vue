<template>
  <div
    v-if="fileUploadPercent"
    class="chat-progress__container"
  >
    <div
      class="chat-progress__body"
      :style="{ width: fileUploadPercent + '%' }"
    />
    <p class="chat-progress__info">
      {{ fileUploadPercent + "%" }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    fileUploadPercent: {
      type: Number,
      required: false,
      default: 0,
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-progress {
  &__container {
    background-color: var(--color-background-item);
    border-radius: 20px;
    padding: 4px;
    grid-column: 1/3;
    position: relative;
    grid-row: 4/5;
  }

  &__body {
    background-color: var(--button-primary);
    height: 16px;
    border-radius: 10px;
  }

  &__info {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
