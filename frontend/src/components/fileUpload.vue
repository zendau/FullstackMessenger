<template>
    
    <div @dragover.prevent @drop.prevent>
        <div class="area" v-if='dragStatus'  @dragleave.prevent="dragLeave" @drop="dataDrop">
            Опустите файл(ы), для загрузки
        </div>
        <div v-else class="area2" @dragenter.prevent="dragStart">
            <slot/>
        </div>
    </div>
    <ul>
        <li v-for="(file, index) in files" :key="index" @click="removeFile(index)">{{file.name}}</li>
    </ul>
  
</template>

<script>

import { inject, ref } from 'vue'
export default {
    setup() {
        const dragStatus = ref(false)
        const files = inject('files')

        function dragStart(e) {
            console.log("START", e)
            dragStatus.value = true
        }

        function dragLeave(e) {
            console.log('LEAVE', e)
            dragStatus.value = false
        }

        function dataDrop(e) {
            files.value = [...e.dataTransfer.files];
            dragStatus.value = false
            console.log(files.value)
        }

        function removeFile(id) {
            files.value = Array.from(files.value).filter((_, index) => index !== id)
        }

        return {
            dragStatus,
            dragStart,
            dragLeave,
            dataDrop,
            files,
            removeFile
        }
    }
}
</script>

<style>
    .area {
        width: 600px;
        height: 300px;
        display: flex;
        border: 1px dashed black;
        align-items: center;
        justify-content: center;
    }

    .area2 {
        width: 600px;
        height: 300px;
    }
</style>