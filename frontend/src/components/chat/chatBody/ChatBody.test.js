/* eslint-disable no-unused-vars */
import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { ref } from "vue";
import { mount, flushPromises, shallowMount } from "@vue/test-utils";
import ChatBody from "./ChatBody.vue";

import router from "@/router";
import store from "@/store";
import i18n from "@/locales";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import MessageContainer from "@/components/chat/chatBody/message/MessageContainer.vue";

let wrapper;
import isLink from "@/utils/isLink";

vi.mock("isLink");

const intersectionObserverMock = () => ({
  observe: () => vi.fn(),
});

window.IntersectionObserver = vi
  .fn()
  .mockImplementation(intersectionObserverMock);

beforeEach(() => {
  i18n.global.locale._setter("en");

  wrapper = mount(ChatBody, {
    global: {
      attachToDocument: true,
      plugins: [router, store, i18n],
      provide: {
        chatSocket: {
          on: () => vi.fn(),
        },
        chatId: ref(123),
        selectedMessages: ref([]),
        chatData: ref({}),
        isSelectMessagesMode: ref(false),
        files: ref([]),
        editMessageData: ref(null),
      },
      components: {
        "font-awesome-icon": FontAwesomeIcon,
        MessageContainer,
      },
      mocks: {
        isLink: isLink,
      },
    },
  });
});

afterEach(() => {
  wrapper.unmount();
});

describe("ChatBody component", () => {
  it("3 messages render", async () => {
    store.state.chat.messages = {
      123: [
        {
          id: 1,
          authorLogin: "admin",
          text: "text1",
          files: [],
          isEdited: false,
          created_at: "2023-05-26T12:58:58",
        },
        {
          id: 2,
          authorLogin: "admin",
          text: "test link http://ya.ru",
          files: [],
          isEdited: false,
          created_at: "2023-05-26T12:58:58",
        },
        {
          id: 3,
          authorLogin: "admin",
          text: "text3",
          files: [],
          isEdited: false,
          created_at: "2025-03-26T12:58:58",
        },
      ],
    };

    await flushPromises();
    const messages = wrapper.findAll(".message__container");

    expect(messages.length).toBe(3);
  });

  it("zero messages render", async () => {
    store.state.chat.messages = {};

    await flushPromises();
    const messages = wrapper.findAll(".message__container");

    expect(messages.length).toBe(0);
  });
});
