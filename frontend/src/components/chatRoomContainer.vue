<template>
    <button @click="showChat = !showChat">{{ showChat ? 'Hide' : 'Show' }}</button>
    <div v-if="showChat">
        <chat roomId="86efdadb-22a8-42ff-aef3-c9235c07962d"/>
    </div>
</template>

<script>

import { ref } from "vue"
import chat from "./chatComponent/chat.vue"

export default {
    components: { chat },
    setup() {
        const showChat = ref(true)


        return {
            showChat
        }

    }
}
</script>

<style>

</style>