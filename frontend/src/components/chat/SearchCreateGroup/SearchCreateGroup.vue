<template>
  <div class="searchCreate__container">
    <font-awesome-icon
      v-if="createGroupUsers.length === 0"
      icon="fa-solid fa-pen-to-square"
      class="searchCreate__icon"
      @click="startCreateGroup"
    />
    <div v-else>
      <font-awesome-icon
        icon="fa-solid fa-xmark"
        class="searchCreate__icon"
        @click="cancelCreateGroup"
      />
    </div>
    <SearchInput @search-pattern="searchByPattern" />
  </div>
  <AlertNotification />
  <div
    v-if="createGroupUsers.length > 0"
    class="searchCreate__create-container"
  >
    <input
      v-model="chatTitle"
      type="text"
      class="searchCreate__input"
      :placeholder="$t('chat.searchCreateGroup.inputPlaceholder')"
    >
    <select
      v-model="conferenceType"
      class="searchCreate__input"
    >
      <option
        disabled
        selected
        :value="null"
      >
        {{ $t("chat.searchCreateGroup.selectType") }}
      </option>
      <option :value="false">
        {{ $t("chat.searchCreateGroup.type.audio") }}
      </option>
      <option :value="true">
        {{ $t("chat.searchCreateGroup.type.video") }}
      </option>
    </select>
    <button
      :disabled="isValidGroupUsersLength"
      class="searchCreate__create"
      @click="onCreateChat"
    >
      {{ $t("chat.searchCreateGroup.create") }}
    </button>
  </div>
</template>

<script>
import { inject, computed } from "vue";
import { useStore } from "vuex";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import onInvalidSubmit from "@/utils/onInvalidSubmit";

import AlertNotification from "@/components/UI/AlertNotification.vue";
import SearchInput from "@/components/chat/SearchCreateGroup/SearchInput.vue";

import { useI18n } from "vue-i18n";

export default {
  components: { AlertNotification, SearchInput },
  emits: ["search-pattern"],
  setup(_, { emit }) {
    const store = useStore();
    const userId = store.state.auth.user.id;

    const { t } = useI18n();

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
      chatTitle: yup.string().required().min(4).label(t("chat.searchCreateGroup.inputPlaceholder")),
      conferenceType: yup
        .boolean()
        .required()
        .typeError(t("chat.searchCreateGroup.typeError"))
        .label(t("chat.searchCreateGroup.selectType")),
    });

    const { handleSubmit } = useForm({
      validationSchema: schema,
    });

    const { value: conferenceType } = useField("conferenceType", {}, { initialValue: null });
    const { value: chatTitle } = useField("chatTitle");

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

<style lang="scss" scoped>
.searchCreate {
  &__container {
    box-shadow: 0 2px 2px rgb(0 0 0 / 25%);
    display: grid;
    grid-template-columns: 35px 1fr;
    align-items: center;
  }

  &__create-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: rgb(0 0 0 / 25%) 0px 2px 2px;
    margin-bottom: 5px;
    padding: 5px 0;
  }

  &__icon {
    color: var(--color-primary);
    width: 25px;
    height: 25px;
    padding: 10px;
    cursor: pointer;
  }

  &__input {
    color: var(--color-secondary);
    background-color: var(--input-background);
    width: 90%;
    height: 40px;
    border: none;
    font-size: 16px;
    box-sizing: border-box;
    padding: 6px;
    margin: 5px;
    border-radius: 5px;
  }

  &__create {
    background-color: var(--button-chat-color);
    transition: 0.3s ease;
    cursor: pointer;
    border: none;
    outline: none;
    color: var(--color-primary);
    padding: 10px 15px;
    border-radius: 5px;

    &:hover {
      background-color: var(--button-chat-hover);
    }

    &:disabled,
    &[disabled] {
      cursor: not-allowed;
    }
  }
}
</style>
