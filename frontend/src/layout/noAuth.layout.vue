<template>
    <navbar />
    <section class="user__container">
        <slot />
    </section>
</template>

<script>

import navbar from '../components/navbar/navbar.vue'

export default {
    components: { navbar }
}
</script>

<style lang="scss" scoped>

body {
    background-color: $menuColor;
}
</style>