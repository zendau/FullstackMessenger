<template>
  <div v-if="createGroupUsers.length > 0">
    <input
      v-model="chatTitle"
      type="text"
      placeholder="Enter a chat name"
    >
    <select v-model="conferenceType">
      <option
        disabled
        selected
        :value="null"
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
  </div>

  <SearchInput @search-pattern="searchByPattern" />
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
import { inject, computed } from "vue";
import { useStore } from "vuex";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";

import AlertNotification from "@/components/UI/AlertNotification.vue";
import SearchInput from "@/components/chat/SearchCreateGroup/SearchInput.vue";

export default {
  components: { AlertNotification, SearchInput },
  emits: ["search-pattern"],
  setup(_, { emit }) {
    const store = useStore();
    const userId = store.state.auth.user.id;

    const chatSocket = inject("chatSocket");

    const createGroupUsers = inject("createGroupUsers");
    const showChats = inject("showChats", false);

    function searchByPattern(pattern) {
      emit("search-pattern", pattern);
    }

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
      conferenceType: yup.boolean().required().typeError("type must be selected"),
    });

    const { handleSubmit } = useForm({
      validationSchema: schema,
    });

    const { value: conferenceType } = useField("conferenceType", {}, { initialValue: null });
    const { value: chatTitle } = useField("chatTitle");

    function onInvalidSubmit({ errors }) {
      const errorMessage = Object.keys(errors)
        .map((error) => `<span>${errors[error]}</span>`)
        .join("");
      store.commit("alert/setErrorMessage", errorMessage);
      console.log("ERRORS", errors);
    }

    const onCreateChat = handleSubmit((formData) => {
      console.log("CREATE GROUP");
      if (isValidGroupUsersLength.value.data) return;

      chatSocket.emit("createChat", {
        adminId: userId,
        users: createGroupUsers.value,
        groupName: formData.chatTitle,
        conferenceType: formData.conferenceType,
      });
      cancelCreateGroup();
    }, onInvalidSubmit);

    const isValidGroupUsersLength = computed(() => createGroupUsers.value.length < 3);

    return {
      isValidGroupUsersLength,
      chatTitle,
      onCreateChat,
      searchByPattern,
      createGroupUsers,
      startCreateGroup,
      cancelCreateGroup,
      conferenceType,
    };
  },
};
</script>

<style></style>
