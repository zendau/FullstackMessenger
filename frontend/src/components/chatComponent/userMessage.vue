<template>
  <div>
      {{message.authorLogin}} - <span v-html="isLink(message.text)"/> - {{convertDate(message.created_at)}}
  </div>
</template>

<script>

import { isLink } from "./isLink"

export default {
    props: ['message'],
    setup() {
        
        function convertDate(date) {
          const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'}
          return new Intl.DateTimeFormat('ru-RU', options).format(Date.parse(date));
        }

        return {
            isLink,
            convertDate
        }
    }
}
</script>

<style>

</style>