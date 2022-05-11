<template>
  <div class="chat__header">
    <!-- <h1 class="chat__title chat__title--private">title</h1> -->
    <h1 class="chat__title">title</h1>
    <p class="chat__count">3 peoples</p>
    <div class="chat__topbar">
      <button class="chat__show-users btn--chat">Group users</button>
      <!-- chat__users--active  -->
      <ul class="chat__users">
        <li class="chat__user">AdminAdminAdmin</li>
        <li class="chat__user">Admin</li>
        <li class="chat__user">Admin</li>
        <li class="chat__user">Admin</li>
      </ul>
      <button class="chat__add-group btn--chat">Add group</button>
    </div>
    <a class="chat__exit" href="#">Exit chat</a>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.chat {
  &__header {
    display: grid;
    height: 100%;
    background-color: $bgcColor;
    border-left: 1px solid black;

    grid-template:
      "title toolbar exit"
      "count toolbar exit";
  }

  &__title {
    color: $textColor;
    grid-area: title;

    &--private {
      grid-row: 1/3;
      align-self: center;
    }
  }

  &__title,
  &__count {
    text-align: center;
  }

  &__count {
    grid-area: count;
    font-size: 14px;
    color: $secondTextColor;
  }

  &__topbar {
    height: 100%;
    display: flex;
    grid-area: toolbar;
    justify-content: flex-end;
    align-items: center;
    position: relative;

    button {
      height: 40px;
      margin-right: 10px;
    }
  }

  &__exit {
    margin-right: 15px;
    text-decoration: none;
    grid-area: exit;
    align-self: center;
    justify-self: end;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: $dangerColor;
  }

  &__users {
    list-style: none;
    display: none;
    position: absolute;
    top: 50px;
    right: 50px;
    width: 150px;
    background-color: $bgcColor;
    border-top: 1px solid;

    &--active {
      display: block;
    }
  }

  &__user {
    padding: 10px;
    text-align: center;
    color: $textColor;
  }
}
</style>