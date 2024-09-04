<template>
  <div>
    <slot />
  </div>
</template>

<style scoped lang="scss">
div {
  display: grid;
  grid-template-columns: 90px 1fr;
  height: 102vh;
  max-height: 100vh;
}
</style>
