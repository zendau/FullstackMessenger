<template>
  <div class="video__container" :class="{
    'video__container--active': isActive,
    'video__container--admin': isAdmin
  }">
    <div class="video__info">
       <span class="mute">
        <i
          class="bi" 
          :class="isMuted ? 'bi-mic-mute-fill' : 'bi-mic-fill'"/>
      </span>
      <p>{{userName}}</p>
    </div>
    <div v-if="isOffVideo" class="video__placeholder"><i class="bi bi-camera-video-off"></i></div>
    <video></video>
  </div>
</template>

<script>

export default {
  props: ['isActive', 'isAdmin', 'isMuted', 'isOffVideo', 'userName']
}

</script>

<style lang="scss" scoped>
.video {
  &__container {
    display: block;
    width: 100%;
    position: relative;
    aspect-ratio: 16/9;
    background-color: $messageColor;
    border-radius: 3px;

    &--active {
      border: 2px solid $activeColor;
    }

    &--admin {
      border: 2px solid $dangerColor;
    }
  }

  &__info {
    position: absolute;
    display: flex;
    bottom: 10px;
    left: 5px;
    color: $textColor;
  }

  &__placeholder {
    position: absolute;
    font-size: 70px;
    color: $textColor;
    background-color: $messageColor;
    width: 100%;
    height: 100%;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

video {
  width: 100%;
  height: 100%;
}
</style>