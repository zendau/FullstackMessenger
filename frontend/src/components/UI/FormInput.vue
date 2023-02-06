<template>
  <label :for="id">{{ title }}</label>
  <input
    :id="id"
    :autocomplete="autocomplete"
    :type="type"
    :placeholder="title"
    :value="modelValue"
    @input="updateValue"
  >
</template>

<script>
export default {
  props: {
    autocomplete: {
      type: String,
      default: "on",
      validator: (value) => {
        return ["on", "of", "new-password"].indexOf(value) !== -1;
      },
    },
    title: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    type: {
      validator: (value) => {
        return ["text", "password", "email"].indexOf(value) !== -1;
      },
      type: String,
      required: true,
    },
    modelValue: {
      type: String,
      default: null,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    function updateValue(event) {
      emit("update:modelValue", event.target.value.trim());
    }

    return {
      updateValue,
    };
  },
};
</script>

<style></style>
