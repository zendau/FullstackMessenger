<template>
  <Modal :isShowCTX="contactData" @closeCTX="closeCTX">
    <div class="test">
      <a class="close-btn" @click="closeCTX"></a>

      <div v-if="contactData.isBannedByContact">BLOCKED BY THIS USER</div>
      <div v-else>
        <p>{{ contactData.email }}</p>
        <p>{{ contactData.login }}</p>
        <p>{{ contactData.lastOnline }}</p>
        <div v-if="contactData.isConfirmRequest">
          <button @click="confirmContactRequest">Accept request</button>
          <button @click="cancelPendingRequest">Reject request</button>
        </div>
        <div v-else>
          <button v-if="contactData.isFriend" @click="deleteFromContacts">
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
          <button v-if="contactData.isBanned" @click="unblockUser">
            Unblock user
          </button>
          <button v-else @click="blockUser">Block user</button>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from "../UI/Modal.vue";
import { ref, inject, computed, watch, onUpdated, onMounted } from "vue";
import { useStore } from "vuex";
import $api from "../../axios";

export default {
  components: { Modal },
  setup() {
    const store = useStore();

    const userId = computed(() => store.state.auth.user.id);
    const contactId = inject("modalUserId");
    const contactData = computed(
      () => store.state.contact.users[contactId.value]
    );

    const chatSocket = inject("chatSocket");

    onUpdated(() => {
      if (!contactData.value && contactId.value) {
        chatSocket.emit("getContactData", {
          userId: userId.value,
          contactId: contactId.value,
        });
      }
    });

    chatSocket.on("contactData", (data) => {
      console.log("get data", data);
      store.commit("contact/setContactData", data);
    });

    async function blockUser() {
      store.dispatch("contact/blockUser", {
        userId: userId.value,
        contactId: contactId.value,
      });
    }

    async function unblockUser() {
      store.dispatch("contact/unblockUser", {
        userId: userId.value,
        contactId: contactId.value,
      });
    }

    async function deleteFromContacts() {
      store.dispatch("contact/deleteFromContacts", {
        userId: userId.value,
        contactId: contactId.value,
      });
    }

    async function addToContacts() {
      store.dispatch("contact/addToContacts", {
        userId: userId.value,
        contactId: contactId.value,
      });
    }

    async function cancelOutgoingRequest() {
      store.dispatch("contact/cancelOutgoingRequest", {
        userId: userId.value,
        contactId: contactId.value,
      });
    }

    async function confirmContactRequest() {
      store.dispatch("contact/confirmContactRequest", {
        userId: userId.value,
        contactId: contactId.value,
      });
    }

    async function cancelPendingRequest() {
      store.dispatch("contact/cancelPendingRequest", {
        userId: userId.value,
        contactId: contactId.value,
      });
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
