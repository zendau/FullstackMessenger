<template>
  <form class="contacts__group-create">
    <input type="text" placeholder="Group Name" />
    <button class="btn--chat">Create group</button>
  </form>
</template>


<style lang="scss" scoped>
.contacts__group-create {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  margin-bottom: 10px;

  input {
    width: 85%;
    padding: 8px;
    font-size: 14px;
    background-color: #242f3d;
    color: $textColor;
    border: none;
    outline: none;
    border-radius: 5px;
  }

  button {
    margin-top: 10px;
  }
}
</style>