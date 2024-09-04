<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    v-if="alert.text"
    class="alert"
    :class="'alert__' + alert.type"
  >
    <p
      class="alert__text"
      v-html="alert.text"
    />
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
      store.commit("alert/clearAlert");
    });

    const alert = computed(() => store.state.alert);

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
  margin: 10px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  min-height: 50px;
  align-self: center;
  border-radius: 2px;

  &__danger {
    background-color: var(--color-danger);
  }

  &__success {
    background-color: var(--color-success);
  }

  &__text {
    color: var(--color-primary);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>
