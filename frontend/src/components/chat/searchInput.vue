<template>
  <input
    v-if="createGroupUsers.length > 0"
    v-model="chatTitle"
    type="text"
    placeholder="Enter a chat name"
  >
  <input
    placeholder="search"
    type="text"
    @input="searchByPattern"
  >
  <AlertNotification />
  <font-awesome-icon
    v-if="createGroupUsers.length === 0"
    icon="fa-solid fa-pen-to-square"
    color="white"
    @click="startCreateGroup"
  />
  <div v-else>
    <font-awesome-icon
      icon="fa-solid fa-xmark"
      color="white"
      @click="cancelCreateGroup"
    />
    <button
      :disabled="isValidGroupUsersLength"
      @click="onCreateChat"
    >
      create
    </button>
  </div>
</template>

<script>
import debounce from "../../utils/debounce";

import { inject, computed } from "vue";
import { useStore } from "vuex";
import AlertNotification from "../UI/alertNotification.vue";

import { useField, useForm } from "vee-validate";
import * as yup from "yup";

export default {
  components: { AlertNotification },
  emits: ["searchByPattern"],
  setup(_, { emit }) {
    const store = useStore();
    const userId = store.state.auth.user.id;

    const chatSocket = inject("chatSocket");

    const createGroupUsers = inject("createGroupUsers");
    const showChats = inject("showChats");

    const searchByPattern = debounce((el) => {
      const pattern = el.target.value;
      emit("searchByPattern", pattern);
    });

    function startCreateGroup() {
      createGroupUsers.value.push(userId);
      showChats.value = false;
    }

    function cancelCreateGroup() {
      createGroupUsers.value.length = 0;
    }

    const schema = yup.object({
      chatTitle: yup.string().required().min(4),
      groupUsers: yup.string().min(2),
    });

    const { handleSubmit } = useForm({
      validationSchema: schema,
    });

    const { value: chatTitle } = useField("chatTitle");

    function onInvalidSubmit({ errors }) {
      const errorMessage = Object.keys(errors)
        .map((error) => `<span>${errors[error]}</span>`)
        .join("");
      store.commit("alert/setErrorMessage", errorMessage);
      console.log("ERRORS", errors);
    }

    const onCreateChat = handleSubmit((data) => {
      console.log("CREATE GROUP");
      if (isValidGroupUsersLength.value.data) return;

      chatSocket.emit("createChat", {
        adminId: userId,
        users: createGroupUsers.value,
        groupName: data.chatTitle,
      });
      cancelCreateGroup();

      // store.commit("alert/clearAlert");
      // store.dispatch("auth/login", {
      //   email: value.email,
      //   password: value.password,
      // });
    }, onInvalidSubmit);

    const isValidGroupUsersLength = computed(
      () => createGroupUsers.value.length < 3
    );

    return {
      isValidGroupUsersLength,
      chatTitle,
      onCreateChat,
      searchByPattern,
      createGroupUsers,
      startCreateGroup,
      cancelCreateGroup,
    };
  },
};
</script>

<style></style>
