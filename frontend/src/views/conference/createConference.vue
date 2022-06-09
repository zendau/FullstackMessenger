<template>
  <section class="user__container">
    <h1 class="user__title">Create conference</h1>
    <alert />
    <form class="user__form" @submit="onSubmitForm">

      <form-input id="title" title="Conference title" type="text" v-model="title" />

      <select name="" id="conferenceType" v-model="type">
        <option disabled selected :value="null">Select conference type</option>
        <option :value="false">Audio</option>
        <option :value="true">Video</option>
      </select>
      <input type="submit" value="Create conference">
    </form>
  </section>
</template>

<script>

import FormInput from '../../components/UI/input.vue'
import Alert from '../../components/UI/alert.vue'

import { useStore } from 'vuex'

import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';
import { computed, inject, watch } from 'vue';

export default {
  components: { Alert, FormInput },
  setup() {
    const store = useStore()

    const adminId = computed(() => store.state.auth.user.id)

    const schema = yup.object({
      title: yup.string().required().min(6),
      type: yup.boolean().required().typeError('type must be selected')
    });

    const { handleSubmit } = useForm({
      validationSchema: schema,
    });

    const socket = inject('socket')

    const { value: title } = useField('title');
    const { value: type } = useField('type', {}, { initialValue: null,  });


    function onInvalidSubmit({ errors }) {

      console.log('errors', errors)

      let message = ''
 
      Object.keys(errors).forEach(item => message += `<span>${errors[item]}</span>`)
      console.log(message)
      store.commit('auth/setErrorMessage', message)
    }
    let formData = null

    const onSubmitForm = handleSubmit(value => {

      store.dispatch('chat/createChat', {
        adminId: adminId.value,
        users: [],
        groupName: `[Conference] - ${value.title}`,
      })
      formData = value

     
    }, onInvalidSubmit)

    watch(() => store.state.chat.chatData.id, (chatId) => {
       store.dispatch('conference/createConference', {
        title: formData.title,
        adminId: adminId.value,
        chatId,
        type: formData.type,
        socket
      })
    })

    return {
      onSubmitForm,
      title,
      type
    }

  }
}
</script>
