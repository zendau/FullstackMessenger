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
  rest.get(`${API_URL}/admin/rolesList`, (req, res, ctx) => {
    return res(ctx.json(["user", "admin"]));
  }),
  rest.patch(`${API_URL}/admin/setRole`, (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.patch(`${API_URL}/admin/blockUser/:id`, (req, res, ctx) => {
    if (!JSON.parse(req.params.id)) {
      return res(ctx.json({ message: "test error" }), ctx.status(401));
    }

    return res(ctx.status(200));
  }),
  rest.patch(`${API_URL}/admin/unblockUser/:id`, (req, res, ctx) => {
    if (!JSON.parse(req.params.id)) {
      return res(ctx.json({ message: "test error" }), ctx.status(401));
    }

    return res(ctx.status(200));
  }),
  rest.get(`${API_URL}/admin/list`, (req, res, ctx) => {
    if (!req.url.searchParams.get("userId")) {
      return res(ctx.json({ message: "test error" }), ctx.status(401));
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
  })
);

beforeAll(() => server.listen());

beforeEach(resetStateData);

afterEach(() => {
  server.resetHandlers();
});
afterAll(() => server.close());

describe("Admin store module", () => {
  it("Module exist", async () => {
    expect(store.state.admin).toStrictEqual(defaultState.admin);
  });

  // GetRolesList action

  it("Action getRolesList success", async () => {
    await store.dispatch("admin/getRolesList");
    await flushPromises();

    expect(store.state.admin.rolesList.length).toBe(2);
  });

  // GetUsersListPagination action

  it("Action getUsersListPagination success", async () => {
    await store.dispatch("admin/getUsersListPagination", 1);
    await flushPromises();

    expect(store.state.admin.loadUsersPagination.page).toBe(1);
    expect(store.state.admin.loadUsersPagination.hasMore).toBe(true);
    expect(Object.keys(store.state.admin.userList).length).toBe(2);
  });

  it("Action getUsersListPagination has't more", async () => {
    const { page } = store.state.admin.loadUsersPagination;
    const listLength = Object.keys(store.state.admin.userList).length;
    store.state.admin.loadUsersPagination.hasMore = false;

    await store.dispatch("admin/getUsersListPagination", 1);
    await flushPromises();

    expect(store.state.admin.loadUsersPagination.page).toBe(page);
    expect(Object.keys(store.state.admin.userList).length).toBe(listLength);
  });

  it("Action getUsersListPagination server error", async () => {
    await store.dispatch("admin/getUsersListPagination");
    await flushPromises();

    expect(store.state.alert.type).toBe("danger");
    expect(store.state.alert.text).toBe("test error");
  });

  // SetUserRole action

  it("Action setUserRole success", async () => {
    store.state.admin.userList = {
      1: {
        email: "admin@mail.com",
        id: 1,
        login: "testadmin",
        role: "admin",
        peerId: "test",
        lastDate: null,
      },
      2: {
        email: "user@mail.com",
        id: 2,
        login: "testuser",
        role: "user",
        peerId: "test",
        lastDate: null,
      },
    };

    await store.dispatch("admin/setUserRole", { userId: 1, role: "user" });
    await flushPromises();

    expect(store.state.admin.userList["1"].role).toBe("user");
  });

  // BlockUser action

  it("Action blockUser success", async () => {
    store.state.admin.userList = {
      1: {
        email: "admin@mail.com",
        id: 1,
        login: "testadmin",
        role: "admin",
        peerId: "test",
        lastDate: null,
      },
      2: {
        email: "user@mail.com",
        id: 2,
        login: "testuser",
        role: "user",
        peerId: "test",
        lastDate: null,
      },
    };

    await store.dispatch("admin/blockUser", 1);
    await flushPromises();

    expect(store.state.admin.userList["1"].isBanned).toBe(1);
  });

  it("Action blockUser server error", async () => {
    await store.dispatch("admin/blockUser", null);
    await flushPromises();

    expect(store.state.alert.type).toBe("danger");
    expect(store.state.alert.text).toBe("test error");
  });

  // UnBlockUser action

  it("Action unBlockUser success", async () => {
    store.state.admin.userList = {
      1: {
        email: "admin@mail.com",
        id: 1,
        login: "testadmin",
        role: "admin",
        peerId: "test",
        lastDate: null,
      },
      2: {
        email: "user@mail.com",
        id: 2,
        login: "testuser",
        role: "user",
        peerId: "test",
        lastDate: null,
      },
    };

    await store.dispatch("admin/unBlockUser", 1);
    await flushPromises();

    expect(store.state.admin.userList["1"].isBanned).toBe(0);
  });

  it("Action unBlockUser server error", async () => {
    await store.dispatch("admin/unBlockUser", null);
    await flushPromises();

    expect(store.state.alert.type).toBe("danger");
    expect(store.state.alert.text).toBe("test error");
  });
});
