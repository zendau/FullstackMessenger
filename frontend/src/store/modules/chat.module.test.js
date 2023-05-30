/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import {
  describe,
  it,
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  expect,
  vi,
} from "vitest";
import { flushPromises } from "@vue/test-utils";
import store from "@/store";

import { defaultState, resetStateData } from "@/utils/test/store";

import { rest } from "msw";
import { setupServer } from "msw/node";
const API_URL = import.meta.env.VITE_API;

import i18n from "@/locales/index";
const { t: $t } = i18n.global;

const server = setupServer(
  rest.get(`${API_URL}/chat/byId`, (req, res, ctx) => {
    if (!req.url.searchParams.get("chatId")) {
      return res(ctx.json({ message: "test error" }), ctx.status(401));
    }
    return res(
      ctx.json({
        id: 1,
        title: "test chat room",
        userUnread: 0,
        chatUnread: 0,
      })
    );
  }),
  rest.get(`${API_URL}/message/listPagination`, (req, res, ctx) => {
    if (!req.url.searchParams.get("chatId")) {
      return res(ctx.json({ message: "test error" }), ctx.status(401));
    }

    return res(
      ctx.json({
        hasMore: true,
        page: parseInt(req.url.searchParams.get("page")) + 1,
        limit: parseInt(req.url.searchParams.get("limit")),
        inMemory: false,
        messages: [
          {
            id: 1,
            text: "test",
            roomId: 1,
          },
          {
            id: 2,
            text: "test2",
            roomId: 1,
          },
        ],
      })
    );
  }),
  rest.get(`${API_URL}/chat/listPagination`, (req, res, ctx) => {
    return res(
      ctx.json({
        hasMore: true,
        page: parseInt(req.url.searchParams.get("page")) + 1,
        inMemory: false,
        currentTempChatData: {
          id: 3,
          title: "test chat room 3",
          userUnread: 3,
          chatUnread: 3,
        },
        roomsData: [
          [
            1,
            {
              id: 1,
              title: "test chat room 1",
              userUnread: 0,
              chatUnread: 0,
              users: [{ id: 1 }, { id: 2 }],
            },
          ],
          [
            2,
            {
              id: 2,
              title: "test chat room 2",
              userUnread: 1,
              chatUnread: 2,
              users: [{ id: 1 }, { id: 3 }],
            },
          ],
        ],
      })
    );
  }),
  rest.get(`${API_URL}/chat/serch`, (req, res, ctx) => {
    if (!req.url.searchParams.get("pattern")) {
      return res(ctx.json({ message: "test error" }), ctx.status(401));
    }

    return res(
      ctx.json([
        [
          1,
          {
            id: 1,
            title: "test chat room 1",
            userUnread: 0,
            chatUnread: 0,
            users: [{ id: 1 }, { id: 2 }],
          },
        ],
        [
          2,
          {
            id: 2,
            title: "test chat room 2",
            userUnread: 1,
            chatUnread: 2,
            users: [{ id: 1 }, { id: 3 }],
          },
        ],
      ])
    );
  }),
  rest.get(`${API_URL}/chat/freeUsers`, (req, res, ctx) => {
    if (
      !req.url.searchParams.get("userId") ||
      !req.url.searchParams.get("chatId")
    ) {
      return res(ctx.json({ message: "test error" }), ctx.status(401));
    }

    return res(ctx.json([{ id: 1 }, { id: 2 }, { id: 3 }]));
  }),
  rest.get(`${API_URL}/chat/checkPrivate`, (req, res, ctx) => {
    if (req.url.searchParams.get("contactId") == 1) {
      return res(ctx.json(123));
    } else {
      return res(ctx.json(null));
    }
  })
);

beforeAll(() => server.listen());

beforeEach(resetStateData);

afterEach(() => {
  server.resetHandlers();
});
afterAll(() => server.close());

describe("Contact store module", () => {
  it("Module exist", async () => {
    expect(store.state.chat).toStrictEqual(defaultState.chat);
  });

  // newChatMessage action

  it("Action newChatMessage success", async () => {
    store.state.chat.chats = new Map();

    await store.dispatch("chat/newChatMessage", {
      messagesData: { id: 1, text: "test", roomId: 1 },
      userId: 2,
    });
    await flushPromises();

    const chatData = store.state.chat.chats.get(1);
    const [messageData] = store.state.chat.messages["1"];

    expect(chatData.userUnread).toBe(1);
    expect(chatData.chatUnread).toBe(1);
    expect(chatData.title).toBe("test chat room");
    expect(chatData.lastMessage).toEqual(messageData);

    expect(messageData.text).toBe("test");
  });

  it("Action newChatMessage server error", async () => {
    store.state.chat.chats = new Map();

    await store.dispatch("chat/newChatMessage", {
      messagesData: { id: 1, text: "test", roomId: null },
      userId: 2,
    });
    await flushPromises();

    expect(store.state.alert.type).toBe("danger");
    expect(store.state.alert.text).toBe("test error");
  });

  // getChatMessages action

  it("Action getChatMessages success", async () => {
    store.state.chat.chats = new Map();

    await store.dispatch("chat/getChatMessages", 1);
    await flushPromises();

    const chatData = store.state.chat.chats.get(1);
    const messagesData = store.state.chat.messages["1"];

    expect(chatData.loadMessagesPagination.page).toBe(1);
    expect(chatData.loadMessagesPagination.inMemory).toBe(false);

    expect(messagesData.length).toBe(2);
  });

  it("Action newChatMessage server error", async () => {
    store.state.chat.chats = new Map();

    await store.dispatch("chat/getChatMessages", null);
    await flushPromises();

    expect(store.state.alert.type).toBe("danger");
    expect(store.state.alert.text).toBe("test error");
  });

  it("Action editChatMesssage success", () => {
    store.state.chat.messages = {
      1: [
        {
          id: 1,
          text: "test",
          roomId: 1,
        },
        {
          id: 2,
          text: "test2",
          roomId: 1,
          files: [{ id: 1 }, { id: 2 }, { id: 3 }],
        },
      ],
      2: [],
    };

    store.dispatch("chat/editChatMesssage", {
      roomId: 1,
      messageId: 2,
      updatedText: "updated",
      deletedFiles: [2],
      files: [{ id: 4 }],
    });

    // eslint-disable-next-line prefer-destructuring
    const messagesData = store.state.chat.messages["1"][1];

    expect(messagesData.text).toBe("updated");
    expect(messagesData.isEdited).toBe(true);

    expect(messagesData.files[1].id).not.toBe(2);
    expect(messagesData.files.at(-1).id).toBe(4);
  });

  it("Action deletedMessages success", () => {
    store.state.chat.chats = new Map([
      [
        1,
        {
          id: 1,
          title: "test chat room",
          userUnread: 0,
          chatUnread: 0,
          lastMessage: {
            id: 2,
            text: "test2",
            roomId: 1,
            files: [{ id: 1 }, { id: 2 }, { id: 3 }],
          },
        },
      ],
    ]);

    store.state.chat.messages = {
      1: [
        {
          id: 1,
          text: "test",
          roomId: 1,
        },
        {
          id: 2,
          text: "test2",
          roomId: 1,
          files: [{ id: 1 }, { id: 2 }, { id: 3 }],
        },
      ],
      2: [],
    };

    store.dispatch("chat/deletedMessages", {
      roomId: 1,
      deletedData: [{ id: 2 }],
    });

    const messagesData = store.state.chat.messages["1"];
    const chatData = store.state.chat.chats.get(1);

    expect(chatData.lastMessage.id).toBe(1);
    expect(messagesData.length).toBe(1);
  });

  it("Action getChats success", async () => {
    store.state.chat.chats = new Map();

    await store.dispatch("chat/getChats", {
      chatId: 3,
    });
    await flushPromises();

    expect(store.state.chat.chats.size).toBe(2);
    expect(store.state.chat.loadChatsPagination.page).toBe(1);
    expect(store.state.chat.loadChatsPagination.inMemory).toBe(false);
    expect(store.state.chat.loadChatsPagination.hasMore).toBe(true);

    expect(store.state.chat.currentTempChatData.id).toBe(3);

    const chatData = store.state.chat.chats.get(1).users["1"];

    expect(chatData.lastDate).toBe(undefined);
    expect(chatData.lastOnline).toBe($t("store.user.recently"));
  });

  it("Action getChatsByPattern success", async () => {
    store.state.chat.chats = new Map();

    await store.dispatch("chat/getChatsByPattern", "test pattern");
    await flushPromises();

    expect(store.state.chat.chats.size).toBe(0);
    expect(store.state.chat.chatsByPattern.size).toBe(2);
  });

  it("Action getChatsByPattern server error", async () => {
    await store.dispatch("chat/getChatsByPattern", null);
    await flushPromises();

    expect(store.state.alert.type).toBe("danger");
    expect(store.state.alert.text).toBe("test error");
  });

  it("Action getFreeChatUsers success", async () => {
    await store.dispatch("chat/getFreeChatUsers", {
      userId: 1,
      chatId: 2,
      users: [{ id: 5 }, { id: 6 }],
    });
    await flushPromises();

    expect(Object.keys(store.state.chat.freeChatUsers).length).toBe(3);
  });

  it("Action getFreeChatUsers server error", async () => {
    await store.dispatch("chat/getFreeChatUsers", {
      users: [{ id: 5 }, { id: 6 }],
    });
    await flushPromises();

    expect(store.state.alert.type).toBe("danger");
    expect(store.state.alert.text).toBe("test error");
  });

  it("Action deleteFromChat success. Chat in Map, user was deleted", async () => {
    store.state.auth.user.id = 2;

    store.state.chat.chats = new Map([
      [
        1,
        {
          id: 1,
          title: "test chat room",
          userUnread: 0,
          chatUnread: 0,
          lastMessage: {
            id: 2,
            text: "test2",
            roomId: 1,
            files: [{ id: 1 }, { id: 2 }, { id: 3 }],
          },
          users: { 1: { id: 1 }, 2: { id: 2 } },
        },
      ],
    ]);

    store.state.chat.messages = {
      1: [
        {
          id: 1,
          text: "test",
          roomId: 1,
        },
        {
          id: 2,
          text: "test2",
          roomId: 1,
        },
      ],
    };

    await store.dispatch("chat/deleteFromChat", {
      userData: {
        chatId: 1,
      },
      deletedUserInfo: 2,
    });
    await flushPromises();

    expect(store.state.chat.chats.size).toBe(0);
    expect(store.state.chat.messages["1"].length).toBe(0);
  });

  it("Action deleteFromChat success. Chat in currentTempChatData, chat member was deleted", async () => {
    store.state.auth.user.id = 2;

    store.state.chat.chats = new Map([]);

    store.state.chat.currentTempChatData = {
      id: 1,
      title: "test chat room",
      userUnread: 0,
      chatUnread: 0,
      lastMessage: {
        id: 2,
        text: "test2",
        roomId: 1,
        files: [{ id: 1 }, { id: 2 }, { id: 3 }],
      },
      users: { 1: { id: 1 }, 2: { id: 2 } },
    };

    store.state.chat.messages = {
      1: [
        {
          id: 1,
          text: "test",
          roomId: 1,
        },
        {
          id: 2,
          text: "test2",
          roomId: 1,
        },
      ],
    };

    await store.dispatch("chat/deleteFromChat", {
      userData: {
        chatId: 1,
      },
      deletedUserInfo: 1,
    });
    await flushPromises();

    expect(store.state.chat.chats.size).toBe(0);
    expect(store.state.chat.currentTempChatData).toBeDefined();
    expect(store.state.chat.messages["1"].length).toBe(2);
  });

  it("Action deleteFromChat delete error", async () => {
    store.state.auth.user.id = 2;

    store.state.chat.chats = new Map([]);

    await store.dispatch("chat/deleteFromChat", {
      userData: {
        chatId: 1,
      },
      deletedUserInfo: 1,
    });
    await flushPromises();

    console.log("store.state.alert.text", store.state.alert.text);

    expect(store.state.alert.type).toBe("danger");
    expect(store.state.alert.text).toBe($t("store.chat.deleteError"));
  });

  it("Action getChatById success", async () => {
    store.state.chat.chats = new Map();

    await store.dispatch("chat/getChatById", {
      userId: 1,
      chatId: 2,
    });
    await flushPromises();

    expect(store.state.chat.chats.size).toBe(1);
  });

  it("Action getPrivateChatId success. Created private chat", async () => {
    let openChatRes;

    const openChat = (checkData) => (openChatRes = checkData);

    store.state.chat.chats = new Map();

    await store.dispatch("chat/getPrivateChatId", {
      contactData: {
        id: 1,
        login: "test",
        lastOnline: "online",
      },
      openChat,
    });
    await flushPromises();

    expect(openChatRes).toBe(123);
  });

  it("Action getPrivateChatId success. Don't created private chat", async () => {
    let openChatRes;

    const openChat = (checkData) => (openChatRes = checkData);

    store.state.chat.chats = new Map();

    await store.dispatch("chat/getPrivateChatId", {
      contactData: {
        id: 2,
        login: "test",
        lastOnline: "online",
      },
      openChat,
    });
    await flushPromises();

    expect(openChatRes).toBe("contact");
  });
});
