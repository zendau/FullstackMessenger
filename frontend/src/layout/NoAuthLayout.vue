<template>
  <Navbar />
  <section class="user__container">
    <slot />
  </section>
</template>

<script>
import Navbar from "@/components/navbar/MainNavbar.vue";

export default {
  components: { Navbar },
};
</script>

<style lang="scss" scoped>
body {
  background-color: var(--menuColor);
}
</style>
