<template>
  <Navbar />
  <slot />
</template>

<script>
import { provide, ref } from "vue";

import Navbar from "@/components/navbar/MainNavbar.vue";
export default {
  components: { Navbar },
  setup() {
    const isConferenceAdmin = ref(false);
    provide("isConferenceAdmin", isConferenceAdmin);

    const modalUserId = ref(null);
    provide("modalUserId", modalUserId);
  },
};
</script>
