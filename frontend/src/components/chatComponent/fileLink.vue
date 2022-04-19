<template>
  <span v-if="files">
    <a 
        style="display: block;" 
        v-for="file in files" 
        :key="file.id" 
        :href='`http://localhost:3000/file/download/${file.id}`'
        >
        ICON - {{file.fileName}}
    </a>
  </span>
</template>

<script>
export default {
  props: ['files']
}
</script>

<style>

</style>