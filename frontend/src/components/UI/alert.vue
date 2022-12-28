<template>
  <div v-if="alert.text" class="alert" :class="'alert__' + alert.type">
    <p class="alert__text" v-html="alert.text" />
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";
import { onBeforeRouteLeave } from "vue-router";

export default {
  setup() {
    const store = useStore();

    onBeforeRouteLeave(() => {
      store.commit("auth/clearAlert");
    });

    const alert = computed(() => store.state.auth.alert);

    return {
      alert,
    };
  },
};
</script>

<style lang="scss">
.alert {
  width: 250px;
  height: auto;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  min-height: 50px;
  align-self: center;

  &__danger {
    background-color: var(--dangerColor);
  }

  &__success {
    background-color: var(--successColor);
  }

  &__text {
    color: var(--textColor);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>
