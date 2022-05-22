<template>
  <div class="audio__container">
    <div class="audio__info" :class="{
      'audio__info--active': isActive,
      'audio__info--admin': isAdmin
    }">
      <span class="mute">
        <i
          class="bi bi-mic-fill" 
          :class="isMuted ? 'bi-mic-mute-fill' : 'bi-mic-fill'"/>
      </span>
      <p>{{userName}}</p>
    </div>
    <audio></audio>
  </div>
</template>

<script>

export default {
  props: ['isActive', 'isAdmin', 'isMuted', 'userName']
}

</script>

<style lang="scss" scoped>
.audio {

  &__container {
    background-color: $messageColor;
  }

  &__info {
    display: flex;
    height: 30px;
    align-items: center;
    color: $textColor;

    .mute {
      border-right: 1px solid black;
      height: 30px;
      width: 30px;
      text-align: center;
      line-height: 30px;
      font-size: 18px;
    }

    p {
      text-align: center;
      padding: 15px;
    }

    &--active {
      border: 2px solid $activeColor;

      .mute {
        border-right: 2px solid $activeColor;
      }
    }

    &--admin {
      border: 2px solid $dangerColor;

      .mute {
        border-right: 2px solid $dangerColor;
      }
    }
  }

}

@media (max-width: 730px) {

  .audio {
    &__container {
      margin-bottom: 10px;
    }
  }
}
</style>