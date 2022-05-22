<template>
  <video-container-vue v-for='i in 10' :key="i" userName='test' />
</template>

<script>

import videoContainerVue from '../../components/conterence/videoContainer.vue'

export default {
  components: {videoContainerVue}
}

</script>
