<template>
  <label :for="id">{{ title }}</label>
  <input :autocomplete="autocomplete" :type="type" :id="id" :placeholder="title" :value="modelValue" @input="updateValue">
</template>

<script>
export default {
  props: {
    autocomplete: {
      type: String,
      default: "on",
      validator: (value) => {
        return ['on', 'of', 'new-password'].indexOf(value) !== -1
      },
    },
    title: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    type: {
      validator: (value) => {
        return ['text', 'password', 'email'].indexOf(value) !== -1
      },
      type: String,
      required: true,
    },
    modelValue: String
  },
  setup(props, context) {

    function updateValue(event) {
      context.emit('update:modelValue', event.target.value);
    }

    return {
      updateValue
    }
  }
}
</script>

<style>
</style>