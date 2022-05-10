<template>
  <h1 class="user__title">Create conference</h1>
  <alert/>
  <form class="user__form" @submit="onSubmitForm">

    <form-input id="title" title="Conference title" type="text" v-model="title"/>

    <select name="" id="conferenceType">
        <option disabled selected>Select conference type</option>
        <option value="audio">Audio</option>
        <option value="video">Video</option>
        <input type="submit" value="Create conference">
    </select>
  </form>
</template>

<script>

import FormInput from '../components/UI/input.vue'
import Alert from '../components/UI/alert.vue'

import { useStore } from 'vuex'

import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';

export default {
  components: {Alert, FormInput},
  setup() {
    const store = useStore()

      
    const schema = yup.object({
        title: yup.string().required().min(6)
    });

    const { handleSubmit } = useForm({
        validationSchema: schema,
    });


    const { value: title } = useField('title');


    function onInvalidSubmit({ errors }) {
      
      console.log('errors', errors)

      let message = ''

      if (errors.title) message += errors.title

      store.commit('auth/setErrorMessage', message)
    }

    const onSubmitForm = handleSubmit(value => {

      store.dispatch('auth', {
        title: value.title,
      })
    }, onInvalidSubmit)

    return {
          onSubmitForm,
          title
      }

  }
}
</script>

<style>

</style>