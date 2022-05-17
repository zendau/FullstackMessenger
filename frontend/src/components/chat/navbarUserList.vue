<template>
  <ul v-if="users?.length > 0"  class="chat__users" :class="{ 'chat__users--active': show }">
    <li 
      class="chat__user" 
      v-for="user in users" 
      :key="user.id" 
      @click="$emit('selectUser', user.id)">
      {{ user.login }}
    </li>
  </ul>
  <p v-else class="chat__users chat__users--message" :class="{ 'chat__users--active': show }">No users</p>
</template>


<script>

export default {
  props: ['users', 'show']
}

</script>

<style lang="scss" scoped>
.chat {
  &__users {
    list-style: none;
    display: none;
    position: absolute;
    top: 52px;
    left: 50%;
    transform: translateX(-50%);
    width: 150px;
    background-color: $bgcColor;
    border-top: 1px solid black;

    &--message {
      color: $textColor;
      padding: 10px;
      text-align: center;
    }

    &--active {
      display: block;
    }
  }

  &__user {
    padding: 10px;
    text-align: center;
    color: $textColor;
    cursor: pointer;
    &:hover {
      background-color: $btnHover;
    }
    
  }
}
</style>