<template>
  <audio-container-vue v-for='i in 10' :key='i' userName='test'/>
</template>

<script>
  
  import audioContainerVue from '../../components/conterence/audioContainer.vue'

  export default {
    components: { audioContainerVue }

  }
</script>


