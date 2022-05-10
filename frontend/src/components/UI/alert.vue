<template>
  <div v-if="message.text" class="alert" :class="'alert__'+message.type">
    <p class="alert__text">{{message.text}}</p>
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
      height: 60px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 5px;
    
    &__danger {
      background-color: $dangerColor;
    }

    &__success {
      background-color: $successColor;
    }

    &__text {
      color: $textColor;
      text-align: center;
    }
}
</style>