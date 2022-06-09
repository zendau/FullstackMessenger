<template>
    <navbar />
    <section class="user__container">
        <slot />
    </section>
</template>

<script>
import Navbar from "../components/navbar/navbar";

export default {
    components: { Navbar }
}
</script>

<style lang="scss" scoped>
header {
    height: 50px !important;
}

body {
    background-color: $menuColor;
}
</style>