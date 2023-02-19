<template>
  <li class="rooms__item">
    <h3 class="room__title">
      {{ roomData.title }}
    </h3>
    <p class="room__author">
      <span v-if="roomData.adminId">{{ $t("conference.conferenceItem.group") }}</span>
      <span v-else>{{ $t("conference.conferenceItem.private") }}</span>
    </p>
    <small
      v-if="roomData.conferenceWithVideo"
      class="room__type"
    >
      <font-awesome-icon icon="fa-solid fa-video" />{{ $t("conference.conferenceItem.video") }}</small>
    <small
      v-else
      class="room__type"
    ><font-awesome-icon icon="fa-solid fa-microphone" /> {{ $t("conference.conferenceItem.audio") }}</small>
    <router-link
      class="room__link"
      :to="`/conference/${roomData.conferenceWithVideo ? 'video' : 'audio'}/${roomData.id}`"
    >
      {{ $t("conference.conferenceItem.enter") }}
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
