<template>
  <section class="user__container">
    <h1 class="user__title">
      Edit conference
    </h1>
    <AlertNotification />
    <form
      class="user__form"
      @submit="onSubmitForm"
    >
      <form-input
        id="title"
        v-model="title"
        title="Conference title"
        type="text"
      />

      <select
        id="conferenceType"
        v-model="type"
        name=""
      >
        <option
          disabled
          selected
        >
          Select conference type
        </option>
        <option :value="false">
          Audio
        </option>
        <option :value="true">
          Video
        </option>
      </select>
      <input
        type="submit"
        value="Edit conference data"
      >
    </form>
  </section>
</template>

<script>

import FormInput from '../../components/UI/input.vue'
import AlertNotification from '../../components/UI/alertNotification.vue'

import { useStore } from 'vuex'

import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';
import { computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  components: { AlertNotification, FormInput },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const roomId = computed(() => route.params.id)

    const adminId = computed(() => store.state.conference.adminId)
    const userId = computed(() => store.state.auth.user.id)

    let confirmedAdmin = null

    const schema = yup.object({
      title: yup.string().required().min(6),
      type: yup.boolean().required()
    });

    const { handleSubmit } = useForm({
      validationSchema: schema,
    });

    onMounted(() => {
      store.dispatch('conference/getConferenceData', roomId.value)
    })



    const { value: title } = useField('title')
    const { value: type } = useField('type')


    function onInvalidSubmit({ errors }) {

      console.log('errors', errors)

      let message = ''

      Object.keys(errors).forEach((item) => message += `<span>${errors[item]}</span>`)
      console.log(message)
      store.commit('alert/setErrorMessage', message)
    }
    const onSubmitForm = handleSubmit((value) => {
      console.log(confirmedAdmin)
      if (confirmedAdmin) {
        store.dispatch('conference/editConference', {
          title: value.title,
          type: value.type,
          id: roomId.value
        })
      }


    }, onInvalidSubmit)

    watch([adminId, userId], ([adminIdVal, userIdVal]) => {
      if (adminIdVal === userIdVal) {
        confirmedAdmin = true
      } else {
        router.push('/conferences')

      }
    }, {
      immediate: true
    })


    watch(() => store.state.conference, (roomData) => {
      title.value = roomData.title
      type.value = roomData.type
    }, {
      immediate: true,
      deep: true
    })

    // watch(() => store.state.chat.chatData.id, (chatId) => {
    //    store.dispatch('conference/createConference', {
    //     title: formData.title,
    //     adminId: adminId.value,
    //     chatId,
    //     type: formData.type
    //   })
    // })

    return {
      onSubmitForm,
      title,
      type
    }

  }
}
</script>