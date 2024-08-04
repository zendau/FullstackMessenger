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

const server = setupServer(
  rest.patch(`${API_URL}/contact/block`, (req, res, ctx) => {
    if (!req.body?.contactId) {
      return res(ctx.json({ message: "test error" }), ctx.status(401));
    }

    return res(ctx.status(200));
  }),
  rest.patch(`${API_URL}/contact/unBlock`, (req, res, ctx) => {
    if (!req.body?.contactId) {
      return res(ctx.json({ message: "test error" }), ctx.status(401));
    }

    return res(ctx.status(200));
  }),
  rest.delete(`${API_URL}/contact/delete`, (req, res, ctx) => {
    if (!req.url.searchParams.get("contactId")) {
      return res(ctx.json({ message: "test error" }), ctx.status(401));
    }

    return res(ctx.status(200));
  }),
  rest.post(`${API_URL}/contact/sendRequest`, (req, res, ctx) => {
    if (!req.body?.contactId) {
      return res(ctx.json({ message: "test error" }), ctx.status(401));
    }

    return res(ctx.status(200));
  }),
  rest.post(`${API_URL}/contact/reject`, (req, res, ctx) => {
    if (!req.body?.contactId) {
      return res(ctx.json({ message: "test error" }), ctx.status(401));
    }

    return res(ctx.status(200));
  }),
  rest.post(`${API_URL}/contact/confirm`, (req, res, ctx) => {
    if (!req.body?.contactId) {
      return res(ctx.json({ message: "test error" }), ctx.status(401));
    }

    return res(ctx.status(200));
  }),
  rest.get(`${API_URL}/contact/getContactCount`, (req, res, ctx) => {
    return res(
      ctx.json({
        contacts: 1,
        pendingRequests: 2,
        outgoingRequests: 3,
        blockedUsers: 4,
      })
    );
  }),
  rest.get(`${API_URL}/contact/contactData`, (req, res, ctx) => {
    return res(
      ctx.json({
        isBanned: false,
        isBannedByContact: false,
        isFriend: true,
        isConfirmRequest: false,
        isPendingRequest: false,
      })
    );
  }),
  rest.get(`${API_URL}/contact/list`, (req, res, ctx) => {
    if (req.url.searchParams.get("pattern")) {
      return res(
        ctx.json({
          hasMore: true,
          page: 0,
          resList: [
            {
              email: "admin@mail.com",
              id: 1,
              lastOnline: null,
              login: "testadmin",
              role: "admin",
              peerId: "test",
            },
          ],
        })
      );
    }

    return res(
      ctx.json({
        hasMore: true,
        page: parseInt(req.url.searchParams.get("page")) + 1,
        resList: [
          {
            email: "admin@mail.com",
            id: 1,
            lastOnline: null,
            login: "testadmin",
            role: "admin",
            peerId: "test",
          },
          {
            email: "user@mail.com",
            id: 2,
            lastOnline: null,
            login: "testuser",
            role: "user",
            peerId: "test",
          },
        ],
      })
    );
  }),
  rest.get(`${API_URL}/contact/freeList`, (req, res, ctx) => {
    if (req.url.searchParams.get("pattern")) {
      return res(
        ctx.json({
          hasMore: true,
          page: 0,
          resList: [
            {
              email: "admin@mail.com",
              id: 1,
              lastOnline: null,
              login: "testadmin",
              role: "admin",
              peerId: "test",
            },
          ],
        })
      );
    }

    return res(
      ctx.json({
        hasMore: true,
        page: parseInt(req.url.searchParams.get("page")) + 1,
        resList: [
          {
            email: "admin@mail.com",
            id: 1,
            lastOnline: null,
            login: "testadmin",
            role: "admin",
            peerId: "test",
          },
          {
            email: "user@mail.com",
            id: 2,
            lastOnline: null,
            login: "testuser",
            role: "user",
            peerId: "test",
          },
        ],
      })
    );
  }),
  rest.get(`${API_URL}/contact/pending`, (req, res, ctx) => {
    if (req.url.searchParams.get("pattern")) {
      return res(
        ctx.json({
          resList: [
            {
              email: "admin@mail.com",
              id: 1,
              lastOnline: null,
              login: "testadmin",
              role: "admin",
              peerId: "test",
            },
          ],
        })
      );
    }

    return res(
      ctx.json({
        resList: [
          {
            email: "admin@mail.com",
            id: 1,
            lastOnline: null,
            login: "testadmin",
            role: "admin",
            peerId: "test",
          },
          {
            email: "user@mail.com",
            id: 2,
            lastOnline: null,
            login: "testuser",
            role: "user",
            peerId: "test",
          },
        ],
      })
    );
  }),
  rest.get(`${API_URL}/contact/outgoing`, (req, res, ctx) => {
    if (req.url.searchParams.get("pattern")) {
      return res(
        ctx.json({
          resList: [
            {
              email: "admin@mail.com",
              id: 1,
              lastOnline: null,
              login: "testadmin",
              role: "admin",
              peerId: "test",
            },
          ],
        })
      );
    }

    return res(
      ctx.json({
        resList: [
          {
            email: "admin@mail.com",
            id: 1,
            lastOnline: null,
            login: "testadmin",
            role: "admin",
            peerId: "test",
          },
          {
            email: "user@mail.com",
            id: 2,
            lastOnline: null,
            login: "testuser",
            role: "user",
            peerId: "test",
          },
        ],
      })
    );
  }),
  rest.get(`${API_URL}/contact/blockedUsers`, (req, res, ctx) => {
    if (req.url.searchParams.get("pattern")) {
      return res(
        ctx.json({
          resList: [
            {
              email: "admin@mail.com",
              id: 1,
              lastOnline: null,
              login: "testadmin",
              role: "admin",
              peerId: "test",
            },
          ],
        })
      );
    }

    return res(
      ctx.json({
        resList: [
          {
            email: "admin@mail.com",
            id: 1,
            lastOnline: null,
            login: "testadmin",
            role: "admin",
            peerId: "test",
          },
          {
            email: "user@mail.com",
            id: 2,
            lastOnline: null,
            login: "testuser",
            role: "user",
            peerId: "test",
          },
        ],
      })
    );
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
    expect(store.state.contact).toStrictEqual(defaultState.contact);
  });

  // BlockUser action

  it("Action blockUser success", async () => {
    store.state.contact.contactStatutes = {
      1: {
        isBanned: null,
        isConfirmRequest: null,
        isFriend: null,
        isPendingRequest: null,
      },
    };

    await store.dispatch("contact/blockUser", 1);
    await flushPromises();

    const contactData = store.state.contact.contactStatutes["1"];

    expect(contactData.isBanned).toBe(true);
    expect(contactData.isConfirmRequest).toBe(false);
    expect(contactData.isFriend).toBe(false);
    expect(contactData.isPendingRequest).toBe(false);
  });

  it("Action blockUser server error", async () => {
    await store.dispatch("contact/blockUser");
    await flushPromises();

    expect(store.state.alert.type).toBe("danger");
    expect(store.state.alert.text).toBe("test error");
  });

  // UnblockUser action

  it("Action unblockUser success", async () => {
    store.state.contact.contactStatutes = {
      1: {
        isBanned: null,
        isConfirmRequest: null,
        isFriend: null,
        isPendingRequest: null,
      },
    };

    await store.dispatch("contact/unblockUser", 1);
    await flushPromises();

    const contactData = store.state.contact.contactStatutes["1"];

    expect(contactData.isBanned).toBe(false);
  });

  it("Action blockUser server error", async () => {
    await store.dispatch("contact/unblockUser");
    await flushPromises();

    expect(store.state.alert.type).toBe("danger");
    expect(store.state.alert.text).toBe("test error");
  });

  // DeleteFromContacts action

  it("Action deleteFromContacts success", async () => {
    store.state.contact.contactStatutes = {
      1: {
        isBanned: null,
        isConfirmRequest: null,
        isFriend: null,
        isPendingRequest: null,
      },
    };

    await store.dispatch("contact/deleteFromContacts", 1);
    await flushPromises();

    const contactData = store.state.contact.contactStatutes["1"];

    expect(contactData.isFriend).toBe(false);
    expect(contactData.isConfirmRequest).toBe(true);
  });

  it("Action deleteFromContacts server error", async () => {
    await store.dispatch("contact/deleteFromContacts");
    await flushPromises();

    expect(store.state.alert.type).toBe("danger");
    expect(store.state.alert.text).toBe("test error");
  });

  // AddToContacts action

  it("Action addToContacts success", async () => {
    store.state.contact.contactStatutes = {
      1: {
        isBanned: null,
        isConfirmRequest: null,
        isFriend: null,
        isPendingRequest: null,
      },
    };

    await store.dispatch("contact/addToContacts", 1);
    await flushPromises();

    const contactData = store.state.contact.contactStatutes["1"];

    expect(contactData.isPendingRequest).toBe(true);
  });

  it("Action addToContacts server error", async () => {
    await store.dispatch("contact/addToContacts");
    await flushPromises();

    expect(store.state.alert.type).toBe("danger");
    expect(store.state.alert.text).toBe("test error");
  });

  // CancelOutgoingRequest action

  it("Action cancelOutgoingRequest success", async () => {
    store.state.contact.contactStatutes = {
      1: {
        isBanned: null,
        isConfirmRequest: null,
        isFriend: null,
        isPendingRequest: null,
      },
    };

    await store.dispatch("contact/cancelOutgoingRequest", 1);
    await flushPromises();

    const contactData = store.state.contact.contactStatutes["1"];

    expect(contactData.isPendingRequest).toBe(false);
  });

  it("Action cancelOutgoingRequest server error", async () => {
    await store.dispatch("contact/cancelOutgoingRequest");
    await flushPromises();

    expect(store.state.alert.type).toBe("danger");
    expect(store.state.alert.text).toBe("test error");
  });

  // ConfirmContactRequest action

  it("Action confirmContactRequest success", async () => {
    store.state.contact.contactStatutes = {
      1: {
        isBanned: null,
        isConfirmRequest: null,
        isFriend: null,
        isPendingRequest: null,
      },
    };

    await store.dispatch("contact/confirmContactRequest", 1);
    await flushPromises();

    const contactData = store.state.contact.contactStatutes["1"];

    expect(contactData.isConfirmRequest).toBe(false);
    expect(contactData.isFriend).toBe(true);
  });

  it("Action confirmContactRequest server error", async () => {
    await store.dispatch("contact/confirmContactRequest");
    await flushPromises();

    expect(store.state.alert.type).toBe("danger");
    expect(store.state.alert.text).toBe("test error");
  });

  // СancelPendingRequest action

  it("Action cancelPendingRequest success", async () => {
    store.state.contact.contactStatutes = {
      1: {
        isBanned: null,
        isConfirmRequest: null,
        isFriend: null,
        isPendingRequest: null,
      },
    };

    await store.dispatch("contact/cancelPendingRequest", {
      userId: 1,
      contactId: 2,
    });
    await flushPromises();

    const contactData = store.state.contact.contactStatutes["1"];

    expect(contactData.isConfirmRequest).toBe(false);
  });

  it("Action cancelPendingRequest server error", async () => {
    await store.dispatch("contact/cancelPendingRequest", {
      userId: null,
      contactId: null,
    });
    await flushPromises();

    expect(store.state.alert.type).toBe("danger");
    expect(store.state.alert.text).toBe("test error");
  });

  // GetContactCount action

  it("Action getContactCount success", async () => {
    await store.dispatch("contact/getContactCount");
    await flushPromises();

    const { contactsCount } = store.state.contact;

    expect(contactsCount.contacts).toBe(1);
    expect(contactsCount.pendingRequests).toBe(2);
    expect(contactsCount.outgoingRequests).toBe(3);
    expect(contactsCount.blockedUsers).toBe(4);
  });

  // GetContactStatutesData action

  it("Action getContactStatutesData success", async () => {
    await store.dispatch("contact/getContactStatutesData", 1);
    await flushPromises();

    const contactData = store.state.contact.contactStatutes["1"];

    expect(contactData.isBanned).toBe(false);
    expect(contactData.isBannedByContact).toBe(false);
    expect(contactData.isConfirmRequest).toBe(false);
    expect(contactData.isFriend).toBe(true);
    expect(contactData.isPendingRequest).toBe(false);
  });

  // GetContactsList action

  it("Action getContactsList success", async () => {
    await store.dispatch("contact/getContactsList");
    await flushPromises();

    expect(store.state.contact.contactsPagintation.page).toBe(1);
    expect(store.state.contact.contactsPagintation.hasMore).toBe(true);
    expect(Object.keys(store.state.contact.contacts).length).toBe(2);
  });

  it("Action getContactsList has't more", async () => {
    const { page } = store.state.contact.contactsPagintation;
    const listLength = Object.keys(store.state.contact.contacts).length;
    store.state.contact.contactsPagintation.hasMore = false;

    await store.dispatch("contact/getContactsList");
    await flushPromises();

    expect(store.state.contact.contactsPagintation.page).toBe(page);
    expect(Object.keys(store.state.contact.contacts).length).toBe(listLength);
  });

  it("Action getContactsList with pattern", async () => {
    await store.dispatch("contact/getContactsList", "pattern");
    await flushPromises();

    console.log("STATE", store.state.contact);

    expect(store.state.contact.contactsPagintation.page).toBe(0);
    expect(store.state.contact.contactsPagintation.hasMore).toBe(true);
    expect(Object.keys(store.state.contact.contacts).length).toBe(1);
  });

  // GetFreeUsersList action

  it("Action getFreeUsersList success", async () => {
    await store.dispatch("contact/getFreeUsersList");
    await flushPromises();

    expect(store.state.contact.freeUsersPagintation.page).toBe(1);
    expect(store.state.contact.freeUsersPagintation.hasMore).toBe(true);
    expect(Object.keys(store.state.contact.freeUsers).length).toBe(2);
  });

  it("Action getFreeUsersList has't more", async () => {
    const { page } = store.state.contact.freeUsersPagintation;
    const listLength = Object.keys(store.state.contact.freeUsers).length;
    store.state.contact.freeUsersPagintation.hasMore = false;

    await store.dispatch("contact/getFreeUsersList");
    await flushPromises();

    expect(store.state.contact.freeUsersPagintation.page).toBe(page);
    expect(Object.keys(store.state.contact.freeUsers).length).toBe(listLength);
  });

  it("Action getFreeUsersList with pattern", async () => {
    await store.dispatch("contact/getFreeUsersList", "pattern");
    await flushPromises();

    expect(store.state.contact.freeUsersPagintation.page).toBe(0);
    expect(store.state.contact.freeUsersPagintation.hasMore).toBe(true);
    expect(Object.keys(store.state.contact.freeUsers).length).toBe(1);
  });

  // GetPendingRequests action

  it("Action getPendingRequests success", async () => {
    await store.dispatch("contact/getPendingRequests");
    await flushPromises();

    expect(Object.keys(store.state.contact.pendingRequests).length).toBe(2);
  });

  it("Action getPendingRequests with pattern", async () => {
    await store.dispatch("contact/getPendingRequests", "pattern");
    await flushPromises();

    expect(Object.keys(store.state.contact.pendingRequests).length).toBe(1);
  });

  // GetOutgoingRequests action

  it("Action getOutgoingRequests success", async () => {
    await store.dispatch("contact/getOutgoingRequests");
    await flushPromises();

    expect(Object.keys(store.state.contact.outgoingRequests).length).toBe(2);
  });

  it("Action getOutgoingRequests with pattern", async () => {
    await store.dispatch("contact/getOutgoingRequests", "pattern");
    await flushPromises();

    expect(Object.keys(store.state.contact.outgoingRequests).length).toBe(1);
  });

  // GetBlockedUsers action

  it("Action getBlockedUsers success", async () => {
    await store.dispatch("contact/getBlockedUsers");
    await flushPromises();

    expect(Object.keys(store.state.contact.blockedUsers).length).toBe(2);
  });

  it("Action getBlockedUsers with pattern", async () => {
    await store.dispatch("contact/getBlockedUsers", "pattern");
    await flushPromises();

    expect(Object.keys(store.state.contact.blockedUsers).length).toBe(1);
  });

  // ChangeUserStatus mutation

  it("Mutation changeUserStatus - operation AddContact", () => {
    store.state.contact.freeUsers = {
      2: {},
    };
    store.state.contact.contactsCount.outgoingRequests = 0;

    expect(store.state.contact.freeUsers[2]).toBeDefined();
    expect(store.state.contact.outgoingRequests[2]).toBeUndefined();

    store.commit("contact/changeUserStatus", {
      operation: "AddContact",
      contactId: 2,
    });
    expect(store.state.contact.freeUsers[2]).toBeUndefined();
    expect(store.state.contact.outgoingRequests[2]).toBeDefined();

    expect(store.state.contact.contactsCount.outgoingRequests).toBe(1);
  });

  it("Mutation changeUserStatus - operation PendingAccept", () => {
    store.state.contact.pendingRequests = {
      2: {},
    };
    store.state.contact.contactsCount.contacts = 0;
    store.state.contact.contactsCount.pendingRequests = 1;

    expect(store.state.contact.pendingRequests[2]).toBeDefined();
    expect(store.state.contact.contacts[2]).toBeUndefined();

    store.commit("contact/changeUserStatus", {
      operation: "PendingAccept",
      contactId: 2,
    });
    expect(store.state.contact.pendingRequests[2]).toBeUndefined();
    expect(store.state.contact.contacts[2]).toBeDefined();

    expect(store.state.contact.contactsCount.contacts).toBe(1);
    expect(store.state.contact.contactsCount.pendingRequests).toBe(0);
  });

  it("Mutation changeUserStatus - operation PendingReject", () => {
    store.state.contact.pendingRequests = {
      2: {},
    };

    store.state.contact.contactsCount.pendingRequests = 1;

    expect(store.state.contact.pendingRequests[2]).toBeDefined();
    expect(store.state.contact.freeUsers[2]).toBeUndefined();

    store.commit("contact/changeUserStatus", {
      operation: "PendingReject",
      contactId: 2,
    });
    expect(store.state.contact.pendingRequests[2]).toBeUndefined();
    expect(store.state.contact.freeUsers[2]).toBeDefined();

    expect(store.state.contact.contactsCount.pendingRequests).toBe(0);
  });

  it("Mutation changeUserStatus - operation OutgointCancel", () => {
    store.state.contact.outgoingRequests = {
      2: {},
    };

    store.state.contact.contactsCount.outgoingRequests = 1;

    expect(store.state.contact.outgoingRequests[2]).toBeDefined();
    expect(store.state.contact.freeUsers[2]).toBeUndefined();

    store.commit("contact/changeUserStatus", {
      operation: "OutgointCancel",
      contactId: 2,
    });
    expect(store.state.contact.outgoingRequests[2]).toBeUndefined();
    expect(store.state.contact.freeUsers[2]).toBeDefined();

    expect(store.state.contact.contactsCount.outgoingRequests).toBe(0);
  });

  it("Mutation changeUserStatus - operation DeleteContact", () => {
    store.state.contact.contacts = {
      2: {},
    };

    store.state.contact.contactsCount.contacts = 1;
    store.state.contact.contactsCount.pendingRequests = 0;

    expect(store.state.contact.contacts[2]).toBeDefined();
    expect(store.state.contact.pendingRequests[2]).toBeUndefined();

    store.commit("contact/changeUserStatus", {
      operation: "DeleteContact",
      contactId: 2,
    });
    expect(store.state.contact.contacts[2]).toBeUndefined();
    expect(store.state.contact.pendingRequests[2]).toBeDefined();

    expect(store.state.contact.contactsCount.contacts).toBe(0);
    expect(store.state.contact.contactsCount.pendingRequests).toBe(1);
  });

  it("Mutation changeUserStatus - operation BlockUser, contact state", () => {
    store.state.contact.contacts = {
      2: {},
    };

    store.state.contact.contactsCount.contacts = 1;
    store.state.contact.contactsCount.blockedUsers = 0;

    expect(store.state.contact.contacts[2]).toBeDefined();
    expect(store.state.contact.blockedUsers[2]).toBeUndefined();

    store.commit("contact/changeUserStatus", {
      operation: "BlockUser",
      contactId: 2,
    });
    expect(store.state.contact.contacts[2]).toBeUndefined();
    expect(store.state.contact.blockedUsers[2]).toBeDefined();

    expect(store.state.contact.contactsCount.contacts).toBe(0);
    expect(store.state.contact.contactsCount.blockedUsers).toBe(1);
  });

  it("Mutation changeUserStatus - operation BlockUser, freeUsers state", () => {
    store.state.contact.freeUsers = {
      2: {},
    };

    store.state.contact.contactsCount.blockedUsers = 0;

    expect(store.state.contact.freeUsers[2]).toBeDefined();
    expect(store.state.contact.blockedUsers[2]).toBeUndefined();

    store.commit("contact/changeUserStatus", {
      operation: "BlockUser",
      contactId: 2,
    });
    expect(store.state.contact.freeUsers[2]).toBeUndefined();
    expect(store.state.contact.blockedUsers[2]).toBeDefined();

    expect(store.state.contact.contactsCount.blockedUsers).toBe(1);
  });

  it("Mutation changeUserStatus - operation BlockUser, pendingRequests state", () => {
    store.state.contact.pendingRequests = {
      2: {},
    };

    store.state.contact.contactsCount.pendingRequests = 1;
    store.state.contact.contactsCount.blockedUsers = 0;

    expect(store.state.contact.pendingRequests[2]).toBeDefined();
    expect(store.state.contact.blockedUsers[2]).toBeUndefined();

    store.commit("contact/changeUserStatus", {
      operation: "BlockUser",
      contactId: 2,
    });
    expect(store.state.contact.pendingRequests[2]).toBeUndefined();
    expect(store.state.contact.blockedUsers[2]).toBeDefined();

    expect(store.state.contact.contactsCount.pendingRequests).toBe(0);
    expect(store.state.contact.contactsCount.blockedUsers).toBe(1);
  });

  it("Mutation changeUserStatus - operation BlockUser, outgoingRequests state", () => {
    store.state.contact.outgoingRequests = {
      2: {},
    };

    store.state.contact.contactsCount.outgoingRequests = 1;
    store.state.contact.contactsCount.blockedUsers = 0;

    expect(store.state.contact.outgoingRequests[2]).toBeDefined();
    expect(store.state.contact.blockedUsers[2]).toBeUndefined();

    store.commit("contact/changeUserStatus", {
      operation: "BlockUser",
      contactId: 2,
    });
    expect(store.state.contact.outgoingRequests[2]).toBeUndefined();
    expect(store.state.contact.blockedUsers[2]).toBeDefined();

    expect(store.state.contact.contactsCount.outgoingRequests).toBe(0);
    expect(store.state.contact.contactsCount.blockedUsers).toBe(1);
  });

  it("Mutation changeUserStatus - operation UnBlockUser", () => {
    store.state.contact.blockedUsers = {
      2: {},
    };

    store.state.contact.contactsCount.blockedUsers = 1;

    expect(store.state.contact.blockedUsers[2]).toBeDefined();
    expect(store.state.contact.freeUsers[2]).toBeUndefined();

    store.commit("contact/changeUserStatus", {
      operation: "UnBlockUser",
      contactId: 2,
    });
    expect(store.state.contact.blockedUsers[2]).toBeUndefined();
    expect(store.state.contact.freeUsers[2]).toBeDefined();

    expect(store.state.contact.contactsCount.blockedUsers).toBe(0);
  });

  // ChangeContactStatus mutation

  it("Mutation changeContactStatus - operation AddContact", () => {
    store.state.contact.freeUsers = {
      2: {},
    };
    store.state.contact.contactsCount.pendingRequests = 0;

    expect(store.state.contact.freeUsers[2]).toBeDefined();
    expect(store.state.contact.pendingRequests[2]).toBeUndefined();

    store.commit("contact/changeContactStatus", {
      operation: "AddContact",
      userId: 2,
    });
    expect(store.state.contact.freeUsers[2]).toBeUndefined();
    expect(store.state.contact.pendingRequests[2]).toBeDefined();

    expect(store.state.contact.contactsCount.pendingRequests).toBe(1);
  });

  it("Mutation changeContactStatus - operation PendingAccept", () => {
    store.state.contact.outgoingRequests = {
      2: {},
    };

    store.state.contact.contactStatutes = {
      2: {},
    };

    store.state.contact.contactsCount.contacts = 0;
    store.state.contact.contactsCount.outgoingRequests = 1;

    expect(store.state.contact.outgoingRequests[2]).toBeDefined();
    expect(store.state.contact.contacts[2]).toBeUndefined();

    store.commit("contact/changeContactStatus", {
      operation: "PendingAccept",
      userId: 2,
    });
    expect(store.state.contact.outgoingRequests[2]).toBeUndefined();
    expect(store.state.contact.contacts[2]).toBeDefined();

    expect(store.state.contact.contactStatutes[2].isFriend).toBe(true);

    expect(store.state.contact.contactsCount.contacts).toBe(1);
    expect(store.state.contact.contactsCount.outgoingRequests).toBe(0);
  });

  it("Mutation changeContactStatus - operation PendingReject", () => {
    store.state.contact.outgoingRequests = {
      2: {},
    };

    store.state.contact.contactStatutes = {
      2: {},
    };

    store.state.contact.contactsCount.outgoingRequests = 1;

    expect(store.state.contact.outgoingRequests[2]).toBeDefined();
    expect(store.state.contact.freeUsers[2]).toBeUndefined();

    store.commit("contact/changeContactStatus", {
      operation: "PendingReject",
      userId: 2,
    });

    expect(store.state.contact.outgoingRequests[2]).toBeUndefined();
    expect(store.state.contact.freeUsers[2]).toBeDefined();

    expect(store.state.contact.contactStatutes[2].isPendingRequest).toBe(false);

    expect(store.state.contact.contactsCount.outgoingRequests).toBe(0);
  });

  it("Mutation changeContactStatus - operation OutgointCancel", () => {
    store.state.contact.pendingRequests = {
      2: {},
    };

    store.state.contact.contactStatutes = {
      2: {},
    };

    store.state.contact.contactsCount.pendingRequests = 1;

    expect(store.state.contact.pendingRequests[2]).toBeDefined();
    expect(store.state.contact.freeUsers[2]).toBeUndefined();

    store.commit("contact/changeContactStatus", {
      operation: "OutgointCancel",
      userId: 2,
    });

    expect(store.state.contact.pendingRequests[2]).toBeUndefined();
    expect(store.state.contact.freeUsers[2]).toBeDefined();

    expect(store.state.contact.contactStatutes[2].isConfirmRequest).toBe(false);

    expect(store.state.contact.contactsCount.pendingRequests).toBe(0);
  });

  it("Mutation changeContactStatus - operation DeleteContact", () => {
    store.state.contact.contacts = {
      2: {},
    };

    store.state.contact.contactStatutes = {
      2: {},
    };

    store.state.contact.contactsCount.contacts = 1;
    store.state.contact.contactsCount.outgoingRequests = 0;

    expect(store.state.contact.contacts[2]).toBeDefined();
    expect(store.state.contact.outgoingRequests[2]).toBeUndefined();

    store.commit("contact/changeContactStatus", {
      operation: "DeleteContact",
      userId: 2,
    });

    expect(store.state.contact.contacts[2]).toBeUndefined();
    expect(store.state.contact.outgoingRequests[2]).toBeDefined();

    expect(store.state.contact.contactStatutes[2].isPendingRequest).toBe(true);
    expect(store.state.contact.contactStatutes[2].isFriend).toBe(false);

    expect(store.state.contact.contactsCount.contacts).toBe(0);
    expect(store.state.contact.contactsCount.outgoingRequests).toBe(1);
  });

  it("Mutation changeContactStatus - operation BlockUser, contact state", () => {
    store.state.contact.contacts = {
      2: {},
    };

    store.state.contact.contactStatutes = {
      2: {},
    };

    store.state.contact.contactsCount.contacts = 1;

    expect(store.state.contact.contacts[2]).toBeDefined();

    store.commit("contact/changeContactStatus", {
      operation: "BlockUser",
      userId: 2,
    });

    expect(store.state.contact.contacts[2]).toBeUndefined();

    expect(store.state.contact.contactStatutes[2].isBannedByContact).toBe(true);
  });

  it("Mutation changeContactStatus - operation BlockUser, freeUsers state", () => {
    store.state.contact.freeUsers = {
      2: {},
    };

    store.state.contact.contactStatutes = {
      2: {},
    };

    store.state.contact.contactsCount.freeUsers = 1;

    expect(store.state.contact.freeUsers[2]).toBeDefined();

    store.commit("contact/changeContactStatus", {
      operation: "BlockUser",
      userId: 2,
    });

    expect(store.state.contact.freeUsers[2]).toBeUndefined();

    expect(store.state.contact.contactStatutes[2].isBannedByContact).toBe(true);
  });

  it("Mutation changeContactStatus - operation BlockUser, pendingRequests state", () => {
    store.state.contact.pendingRequests = {
      2: {},
    };

    store.state.contact.contactStatutes = {
      2: {},
    };

    store.state.contact.contactsCount.pendingRequests = 1;

    expect(store.state.contact.pendingRequests[2]).toBeDefined();

    store.commit("contact/changeContactStatus", {
      operation: "BlockUser",
      userId: 2,
    });

    expect(store.state.contact.pendingRequests[2]).toBeUndefined();

    expect(store.state.contact.contactStatutes[2].isBannedByContact).toBe(true);
  });

  it("Mutation changeContactStatus - operation BlockUser, outgoingRequests state", () => {
    store.state.contact.outgoingRequests = {
      2: {},
    };

    store.state.contact.contactStatutes = {
      2: {},
    };

    store.state.contact.contactsCount.outgoingRequests = 1;

    expect(store.state.contact.outgoingRequests[2]).toBeDefined();

    store.commit("contact/changeContactStatus", {
      operation: "BlockUser",
      userId: 2,
    });

    expect(store.state.contact.outgoingRequests[2]).toBeUndefined();

    expect(store.state.contact.contactStatutes[2].isBannedByContact).toBe(true);
  });

  it("Mutation changeContactStatus - operation UnBlockUser", () => {
    store.state.contact.contactStatutes = {
      2: {},
    };

    store.commit("contact/changeContactStatus", {
      operation: "UnBlockUser",
      userId: 2,
      userData: {},
    });

    expect(store.state.contact.freeUsers[2]).toBeDefined();

    expect(store.state.contact.contactStatutes[2].isBannedByContact).toBe(
      false
    );
  });
});
