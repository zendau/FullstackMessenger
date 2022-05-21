<template>
  <div>
    <Chat />
  </div>
</template>

<script>

import Chat from '../views/Chat/chatTest.vue'

export default {
  components: { Chat }
}

</script>
<style scoped lang="scss">
div {
  display: grid;
  grid-template-columns: 80px 1fr;
  height: 102vh;
  max-height: 100vh;
}
</style>

<style lang="scss">
.btn {
  &--chat {
    background-color: $btnChat;
    border: none;
    color: $textColor;
    border-radius: 2px;
    padding: 5px 9px;
    cursor: pointer;
    transition: .3s ease;

    &:hover {
      background-color: $btnHover;
    }
  }
}
</style>