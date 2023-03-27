<template>
  <ModalWindow
    :is-show-c-t-x="contactData"
    @close-context="closeCTX"
  >
    <div class="modal">
      <a
        class="close-btn"
        @click="closeCTX"
      />
      <div
        v-if="contactStatus?.isBannedByContact"
        class="user-modal__blocked"
      >
        {{ $t("chat.userModal.blockedByUsers") }}
      </div>
      <div
        v-else
        class="user-modal__container"
      >
        <div class="user-modal__content">
          <div class="user-modal__main">
            <p>{{ contactData.login }}</p>
            <p>{{ contactData.lastOnline }}</p>
          </div>

          <p class="user-modal__data">
            <font-awesome-icon icon="fa-solid fa-envelope" /> {{ contactData.email }}
          </p>
          <p class="info user-modal__data">
            <font-awesome-icon icon="fa-solid fa-info" /> {{ contactData.info?.details }}
          </p>
          <p class="user-modal__data">
            <font-awesome-icon icon="fa-solid fa-phone" /> {{ contactData.info?.phone }}
          </p>
        </div>

        <div
          v-if="contactStatus?.isConfirmRequest"
          class="modal__container-btn"
        >
          <button
            class="modal__btn"
            @click="confirmContactRequest"
          >
            {{ $t("chat.userModal.accept") }}
          </button>
          <button
            class="modal__btn"
            @click="cancelPendingRequest"
          >
            {{ $t("chat.userModal.reject") }}
          </button>
        </div>
        <div
          v-else
          class="modal__container-btn"
        >
          <button
            v-if="contactStatus?.isFriend"
            class="modal__btn"
            @click="deleteFromContacts"
          >
            {{ $t("chat.userModal.remove") }}
          </button>
          <button
            v-else-if="contactStatus?.isPendingRequest"
            class="modal__btn"
            @click="cancelOutgoingRequest"
          >
            {{ $t("chat.userModal.cancel") }}
          </button>
          <button
            v-else
            class="modal__btn"
            :disabled="contactStatus?.isBanned"
            @click="addToContacts"
          >
            {{ $t("chat.userModal.add") }}
          </button>
          <button
            v-if="contactStatus?.isBanned"
            class="modal__btn"
            @click="unblockUser"
          >
            {{ $t("chat.userModal.unBlock") }}
          </button>
          <button
            v-else
            class="modal__btn"
            @click="blockUser"
          >
            {{ $t("chat.userModal.block") }}
          </button>
        </div>
      </div>
    </div>
  </ModalWindow>
</template>

<script>
import ModalWindow from "@/components/UI/ModalWindow.vue";
import { inject, computed, onUpdated } from "vue";
import { useStore } from "vuex";

export default {
  components: { ModalWindow },
  setup() {
    const store = useStore();

    const userId = computed(() => store.state.auth.user.id);
    const contactId = inject("modalUserId");
    const contactData = computed(() => store.state.users.usersList.get(contactId.value));
    const contactStatus = computed(() => store.state.contact.contactStatutes[contactId.value]);

    const chatSocket = inject("chatSocket");

    onUpdated(() => {
      if (!contactStatus.value && contactId.value) {
        store.dispatch("contact/getContactStatutesData", contactId.value);
      }
    });

    const listTypes = {
      AddContact: "AddContact",
      PendingAccept: "PendingAccept",
      PendingReject: "PendingReject",
      OutgointCancel: "OutgointCancel",
      DeleteContact: "DeleteContact",
      BlockUser: "BlockUser",
      UnBlockUser: "UnBlockUser",
    };

    async function blockUser() {
      store.dispatch("contact/blockUser", contactId.value);

      const statusData = {
        operation: listTypes.BlockUser,
        contactId: contactId.value,
        userId: userId.value,
      };

      chatSocket.emit("chatContactStatus", statusData);
      store.commit("contact/changeUserStatus", statusData);
    }

    async function unblockUser() {
      store.dispatch("contact/unblockUser", contactId.value);

      const userData = store.getters["auth/getUserContactData"];

      const statusData = {
        operation: listTypes.UnBlockUser,
        contactId: contactId.value,
        userId: userData.id,
        userData,
      };
      chatSocket.emit("chatContactStatus", statusData);
      store.commit("contact/changeUserStatus", statusData);
    }

    async function deleteFromContacts() {
      store.dispatch("contact/deleteFromContacts", contactId.value);

      const statusData = {
        operation: listTypes.DeleteContact,
        contactId: contactId.value,
        userId: userId.value,
      };

      chatSocket.emit("chatContactStatus", statusData);
      store.commit("contact/changeUserStatus", statusData);
    }

    async function addToContacts() {
      store.dispatch("contact/addToContacts", contactId.value);

      const statusData = {
        operation: listTypes.AddContact,
        contactId: contactId.value,
        userId: userId.value,
      };

      chatSocket.emit("chatContactStatus", statusData);
      store.commit("contact/changeUserStatus", statusData);
    }

    async function cancelOutgoingRequest() {
      store.dispatch("contact/cancelOutgoingRequest", {
        contactId: contactId.value,
      });

      const statusData = {
        operation: listTypes.OutgointCancel,
        contactId: contactId.value,
        userId: userId.value,
      };

      chatSocket.emit("chatContactStatus", statusData);
      store.commit("contact/changeUserStatus", statusData);
    }

    async function confirmContactRequest() {
      store.dispatch("contact/confirmContactRequest", contactId.value);

      const statusData = {
        operation: listTypes.PendingAccept,
        contactId: contactId.value,
        userId: userId.value,
      };

      chatSocket.emit("chatContactStatus", statusData);
      store.commit("contact/changeUserStatus", statusData);
    }

    async function cancelPendingRequest() {
      store.dispatch("contact/cancelPendingRequest", {
        userId: contactId.value,
        contactId: userId.value,
      });

      const statusData = {
        operation: listTypes.PendingReject,
        contactId: contactId.value,
        userId: userId.value,
      };

      chatSocket.emit("chatContactStatus", statusData);
      store.commit("contact/changeUserStatus", statusData);
    }

    function closeCTX() {
      contactId.value = null;
    }

    return {
      contactId,
      contactData,
      contactStatus,
      closeCTX,
      blockUser,
      unblockUser,
      deleteFromContacts,
      addToContacts,
      cancelOutgoingRequest,
      confirmContactRequest,
      cancelPendingRequest,
    };
  },
};
</script>

<style lang="scss" scoped>
.user-modal {
  &__container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  &__content {
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 100%;
  }

  &__blocked {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  &__main {
    width: 80%;
    border-bottom: 1px solid rgb(0 0 0 / 40%);
    margin-bottom: 30px;
    padding: 15px;

    p:nth-child(1) {
      font-weight: bold;
    }
    p:nth-child(2) {
      color: var(--color-secondary);
    }
  }

  &__data {
    display: grid;
    width: 100%;
    grid-template-columns: 50px 1fr;
    justify-items: center;
    margin: 5px;

    svg {
      color: var(--color-icon);
    }
  }
}
</style>
