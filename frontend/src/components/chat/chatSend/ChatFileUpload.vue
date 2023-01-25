<template>
  <div
    v-if="fileUploadPercent > 0"
    style="background-color: #20201f; border-radius: 20px; padding: 4px"
  >
    <div
      style="background-color: #f7901e; height: 16px; border-radius: 10px"
      :style="{ width: fileUploadPercent + '%' }"
    />
  </div>
</template>

<script>
export default {
  props: {
    fileUploadPercent: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style></style>
