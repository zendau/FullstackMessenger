<template>
  <Modal :isShowCTX="true">
    <div class="test" v-if="contactData">
      <a class="close-btn"></a>

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
import { ref, inject, computed } from "vue";
import { useStore } from "vuex";
import $api from "../../axios";

export default {
  components: { Modal },
  setup() {
    const store = useStore();

    const contactData = ref(null);
    const userId = computed(() => store.state.auth.user.id);

    const chatSocket = inject("chatSocket");

    chatSocket.emit("getContactData", {
      userId: userId.value,
      contactId: 3,
    });

    chatSocket.on("contactData", (data) => {
      console.log("!!!!!!1", data);
      contactData.value = data;
    });

    async function blockUser() {
      console.log("block user by id ", contactData.value.id);
      const res = await $api.patch("/contact/block", {
        userId: userId.value,
        contactId: contactData.value.id,
      });
      console.log("res", res);
    }

    async function unblockUser() {
      console.log("unblock user by id ", contactData.value.id);
      const res = await $api.patch("/contact/unBlock", {
        userId: userId.value,
        contactId: contactData.value.id,
      });
      console.log("res", res);
    }

    async function deleteFromContacts() {
      console.log(
        "delete user with id ",
        contactData.value.id,
        "userId - ",
        userId.value
      );
      const res = await $api.delete("/contact/delete", {
        data: {
          userId: userId.value,
          contactId: contactData.value.id,
        },
      });
    }

    async function addToContacts() {
      console.log(
        "add user with id ",
        contactData.value.id,
        "userId - ",
        userId.value
      );
      const res = await $api.post("/contact/sendRequest", {
        userId: userId.value,
        contactId: contactData.value.id,
      });
    }

    async function cancelOutgoingRequest() {
      console.log(
        "cancel user request with id ",
        contactData.value.id,
        "userId - ",
        userId.value
      );
      const res = await $api.post("/contact/reject", {
        userId: userId.value,
        contactId: contactData.value.id,
      });
    }

    async function confirmContactRequest() {
      console.log(
        "confirm user request with id ",
        contactData.value.id,
        "userId - ",
        userId.value
      );
      const res = await $api.post("/contact/confirm", {
        userId: userId.value,
        contactId: contactData.value.id,
      });
      console.log("res", res);
    }

    async function cancelPendingRequest() {
      console.log(
        "reject pending user request with id ",
        contactData.value.id,
        "userId - ",
        userId.value
      );
      const res = await $api.post("/contact/reject", {
        userId: contactData.value.id,
        contactId: userId.value,
      });
      console.log("res", res);
    }

    return {
      contactData,
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
  position: absolute;
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
