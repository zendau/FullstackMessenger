<template>
  <ModalWindow
    :is-show-c-t-x="contactData"
    @close-context="closeCTX"
  >
    <div class="test">
      <a
        class="close-btn"
        @click="closeCTX"
      />

      <div v-if="contactData.isBannedByContact">
        BLOCKED BY THIS USER
      </div>
      <div v-else>
        <p>{{ contactData.email }}</p>
        <p>{{ contactData.login }}</p>
        <p>{{ contactData.lastOnline }}</p>
        <div v-if="contactData.isConfirmRequest">
          <button @click="confirmContactRequest">
            Accept request
          </button>
          <button @click="cancelPendingRequest">
            Reject request
          </button>
        </div>
        <div v-else>
          <button
            v-if="contactData.isFriend"
            @click="deleteFromContacts"
          >
            Remove from contacts
          </button>
          <button
            v-else-if="contactData.isPendingRequest"
            @click="cancelOutgoingRequest"
          >
            Cancel contact request
          </button>
          <button
            v-else
            :disabled="contactData.isBanned"
            @click="addToContacts"
          >
            Add to contact
          </button>
          <button
            v-if="contactData.isBanned"
            @click="unblockUser"
          >
            Unblock user
          </button>
          <button
            v-else
            @click="blockUser"
          >
            Block user
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
    const contactData = computed(() => store.state.contact.users[contactId.value]);

    const chatSocket = inject("chatSocket");

    onUpdated(() => {
      if (!contactData.value && contactId.value) {
        store.dispatch("contact/getContactData", {
          userId: userId.value,
          contactId: contactId.value,
        });
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
      store.dispatch("contact/blockUser", {
        userId: userId.value,
        contactId: contactId.value,
      });

      const statusData = {
        operation: listTypes.BlockUser,
        contactId: contactId.value,
        userData: store.getters["auth/getUserContactData"],
      };

      chatSocket.emit("chatContactStatus", statusData);
      store.commit("contact/changeUserStatus", statusData);
    }

    async function unblockUser() {
      store.dispatch("contact/unblockUser", {
        userId: userId.value,
        contactId: contactId.value,
      });

      const statusData = {
        operation: listTypes.UnBlockUser,
        contactId: contactId.value,
        userData: store.getters["auth/getUserContactData"],
      };
      console.log("BLOCK WITHOUT SOCKET");
      chatSocket.emit("chatContactStatus", statusData);
      store.commit("contact/changeUserStatus", statusData);
    }

    async function deleteFromContacts() {
      store.dispatch("contact/deleteFromContacts", {
        userId: userId.value,
        contactId: contactId.value,
      });

      const statusData = {
        operation: listTypes.DeleteContact,
        contactId: contactId.value,
        userData: store.getters["auth/getUserContactData"],
      };

      chatSocket.emit("chatContactStatus", statusData);
      store.commit("contact/changeUserStatus", statusData);
    }

    async function addToContacts() {
      store.dispatch("contact/addToContacts", {
        userId: userId.value,
        contactId: contactId.value,
      });
      console.log("ASASASAS", {
        operation: listTypes.AddContact,
        contactId: contactId.value,
        userData: store.getters["auth/getUserContactData"],
      });

      const statusData = {
        operation: listTypes.AddContact,
        contactId: contactId.value,
        userData: store.getters["auth/getUserContactData"],
      };

      chatSocket.emit("chatContactStatus", statusData);
      store.commit("contact/changeUserStatus", statusData);
    }

    async function cancelOutgoingRequest() {
      store.dispatch("contact/cancelOutgoingRequest", {
        userId: userId.value,
        contactId: contactId.value,
      });

      const statusData = {
        operation: listTypes.OutgointCancel,
        contactId: contactId.value,
        userData: store.getters["auth/getUserContactData"],
      };

      chatSocket.emit("chatContactStatus", statusData);
      store.commit("contact/changeUserStatus", statusData);
    }

    async function confirmContactRequest() {
      store.dispatch("contact/confirmContactRequest", {
        userId: userId.value,
        contactId: contactId.value,
      });

      const statusData = {
        operation: listTypes.PendingAccept,
        contactId: contactId.value,
        userData: store.getters["auth/getUserContactData"],
      };

      chatSocket.emit("chatContactStatus", statusData);
      store.commit("contact/changeUserStatus", statusData);
    }

    async function cancelPendingRequest() {
      store.dispatch("contact/cancelPendingRequest", {
        userId: userId.value,
        contactId: contactId.value,
      });

      const statusData = {
        operation: listTypes.PendingReject,
        contactId: contactId.value,
        userData: store.getters["auth/getUserContactData"],
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

<style lang="scss">
.test {
  width: 400px;
  height: 400px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  background-color: var(--bgcColor);
  color: var(--textColor);
}

.close-btn {
  position: absolute;
  right: 32px;
  top: 32px;
  width: 32px;
  height: 32px;
  opacity: 0.3;

  &:hover {
    opacity: 1;
  }

  &:before,
  &:after {
    position: absolute;
    left: 15px;
    content: " ";
    height: 33px;
    width: 2px;
    background-color: #333;
  }

  &:before {
    transform: rotate(45deg);
  }
  &:after {
    transform: rotate(-45deg);
  }
}
</style>
