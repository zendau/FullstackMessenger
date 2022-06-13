<template>
  <div v-if="message.text" class="alert" :class="'alert__' + message.type">
    <p class="alert__text" v-html="message.text" />
  </div>
</template>

<script>

import { useStore } from 'vuex'
import { computed } from '@vue/runtime-core'

export default {
  setup() {

    const store = useStore()

    const message = computed(() => store.getters['auth/getAlertMessage'])

    return {
      message
    }

  }
}
</script>

<style lang='scss'>
.alert {

  width: 250px;
  height: auto;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  min-height: 50px;

  &__danger {
    background-color: $dangerColor;
  }

  &__success {
    background-color: $successColor;
  }

  &__text {
    color: $textColor;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>