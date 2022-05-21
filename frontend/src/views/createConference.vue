<template>
  <section class="user__container">
    <h1 class="user__title">Create conference</h1>
    <alert />
    <form class="user__form" @submit="onSubmitForm">

      <form-input id="title" title="Conference title" type="text" v-model="title" />

      <select name="" id="conferenceType">
        <option disabled selected>Select conference type</option>
        <option value="audio">Audio</option>
        <option value="video">Video</option>
        <input type="submit" value="Create conference">
      </select>
    </form>
  </section>
</template>

<script>

import FormInput from '../components/UI/input.vue'
import Alert from '../components/UI/alert.vue'

import { useStore } from 'vuex'

import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';

export default {
  components: { Alert, FormInput },
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

<style lang="scss" scoped>
.user {
  &__container {
    width: 600px;
    background-color: $bgcColor;
    margin: 50px auto;
    display: flex;
    flex-direction: column;
    color: $textColor;
    border-radius: 3px;
    padding: 15px 0;
  }

  &__title {
    text-align: center;
    margin: 25px 0;
    color: $textColor;
  }

  &__form {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
    margin-top: 20px;

    &::v-deep {
      label {
        margin-bottom: 5px;
        color: $textColor;
      }

      input {
        border: none;
        outline: none;
        color: $textColor;
        padding: 5px;
        font-size: 18px;
        margin-bottom: 20px;

        &::placeholder {
          color: $textColor;
        }
      }

      input[type='submit'] {
        background-color: $btnChat;
        transition: .3s ease;
        cursor: pointer;

        &:hover {
          background-color: $btnHover;
        }
      }

      select,
      input {
        width: 200px;
        font-size: 16px;
        background-color: #242f3d;
      }

      select {
        margin: 15px 0;

        border: none;
        outline: none;
        color: $textColor;
        border-radius: 0;
      }
    }


  }
}

@media (max-width: 720px) {


  .create {
    &__container {
      width: 90%;
      margin: 15px auto;
      box-sizing: border-box;
    }
  }

}
</style>