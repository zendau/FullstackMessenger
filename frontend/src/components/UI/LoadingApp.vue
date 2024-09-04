<template>
  <Teleport to="#app">
    <div class="container">
      <span class="loader"></span>
    </div>
  </Teleport>
</template>


<style scoped>

.container {
  position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.loader {
  width: 138px;
  height: 138px;
  display: inline-block;
  position: relative;
}
.loader::after,
.loader::before {
  content: '';
  box-sizing: border-box;
  width: 138px;
  height: 138px;
  border-radius: 50%;
  border: 2px solid #FFF;
  position: absolute;
  left: 0;
  top: 0;
  animation: animloader 2s linear infinite;
}
.loader::after {
  animation-delay: 1s;
}

@keyframes animloader {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

</style>
