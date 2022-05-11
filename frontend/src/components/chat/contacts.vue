<template>
  <div class="chat__contacts">
    <button class="btn--chat">Switch</button>
    <create-group/>
    <ul class="contacts__list">
      <li class="contact__item">
        <i class="bi bi-people"></i>
        <p>Group name</p>
      </li>
      <li class="contact__item">
        <i class="bi bi-person"></i>
        <p>Contact name</p>
      </li>
      <li class="contact__item">
        <i class="bi bi-people"></i>
        <p>Group name</p>
      </li>
      <li class="contact__item">
        <i class="bi bi-person"></i>
        <p>Contact name</p>
      </li>
      <li class="contact__item">
        <i class="bi bi-people"></i>
        <p>Group name</p>
      </li>
      <li class="contact__item">
        <i class="bi bi-person"></i>
        <input type="checkbox" />
        <p>Contact name</p>
      </li>
      <li class="contact__item">
        <i class="bi bi-people"></i>
        <p>Group name</p>
      </li>
      <li class="contact__item">
        <i class="bi bi-person"></i>
        <p>Contact name</p>
      </li>
      <li class="contact__item">
        <i class="bi bi-people"></i>
        <p>Group name</p>
      </li>
      <li class="contact__item">
        <i class="bi bi-person"></i>
        <p>Contact name</p>
      </li>
      <li class="contact__item">
        <i class="bi bi-people"></i>
        <p>Group name</p>
      </li>
      <li class="contact__item">
        <i class="bi bi-person"></i>
        <input type="checkbox" />
        <p>Contact name</p>
      </li>
      <li class="contact__item">
        <i class="bi bi-people"></i>
        <p>Group name</p>
      </li>
      <li class="contact__item">
        <i class="bi bi-person"></i>
        <p>Contact name</p>
      </li>
      <li class="contact__item">
        <i class="bi bi-people"></i>
        <p>Group name</p>
      </li>
      <li class="contact__item">
        <i class="bi bi-person"></i>
        <p>Contact name</p>
      </li>
      <li class="contact__item">
        <i class="bi bi-people"></i>
        <p>Group name</p>
      </li>
      <li class="contact__item">
        <i class="bi bi-person"></i>
        <input type="checkbox" />
        <p>Contact name</p>
      </li>
      <li class="contact__item">
        <i class="bi bi-people"></i>
        <p>Group name</p>
      </li>
      <li class="contact__item">
        <i class="bi bi-person"></i>
        <p>Contact name</p>
      </li>
      <li class="contact__item">
        <i class="bi bi-people"></i>
        <p>Group name</p>
      </li>
      <li class="contact__item">
        <i class="bi bi-person"></i>
        <p>Contact name</p>
      </li>
      <li class="contact__item">
        <i class="bi bi-people"></i>
        <p>Group name</p>
      </li>
      <li class="contact__item">
        <i class="bi bi-person"></i>
        <input type="checkbox" />
        <p>Contact name</p>
      </li>
    </ul>
  </div>
</template>

<script>

import createGroup from './createGroup.vue'

export default {
  components: { createGroup }
};
</script>

<style lang="scss" scoped>
.chat {
  &__contacts {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    max-height: 100vh;
    box-sizing: border-box;
    padding-top: 10px;
    background-color: $bgcColor;

    button {
      margin-bottom: 10px;
      width: 100px;
      align-self: center;
    }
  }
}

.contacts {
  &__list {
    overflow: auto;

    &::-webkit-scrollbar {
      width: 5px;
    }

    &::-webkit-scrollbar-track {
      background-color: #3f4750;
      border-radius: 100px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #9b9fa4;
      box-shadow: inset 2px 2px 5px 0 rgba(#fff, 0.5);
      border-radius: 10px;
    }
  }
}

.contact {
  &__item {
    display: flex;
    align-items: center;
    transition: 0.3s ease;
    cursor: pointer;
    padding: 5px 0;
    color: $textColor;

    &:hover {
      background-color: $itemColor;
    }

    input {
      margin: 0 5px;
    }

    i {
      margin: 0 10px;
      font-size: 26px;
    }
  }
}
</style>