<template>
  <li class="rooms__item">
    <h3 class="room__title">
      {{ roomData.title }}
    </h3>
    <p class="room__author">
      <span v-if="roomData.adminId">Group</span>
      <span v-else>Private</span>
    </p>
    <small
      v-if="roomData.conferenceWithVideo"
      class="room__type"
    ><i class="bi bi-camera-video-fill" /> Video conference</small>
    <small
      v-else
      class="room__type"
    ><i class="bi bi-mic-fill" /> Audio conference</small>
    <router-link
      class="room__link"
      :to="`/conference/${roomData.conferenceWithVideo ? 'video' : 'audio'}/${roomData.id}`"
    >
      Enter
    </router-link>
  </li>
</template>

<script>
export default {
  props: {
    roomData: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style></style>
