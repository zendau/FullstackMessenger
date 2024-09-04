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

const accessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImVtYWlsIjoicm9vdEBnbWFpbC5jb20iLCJsb2dpbiI6InJvb3QwMSIsInJvbGUiOiJVU0VSIiwiaXNCYW5uZWQiOmZhbHNlLCJpbmZvIjp7InBob25lIjpudWxsLCJkZXRhaWxzIjpudWxsfSwiZGV2aWNlSWQiOjM0LCJpYXQiOjE2Nzg5MTc0ODMsImV4cCI6MTY3ODkxNzc4M30.OdrbeusH4xTdoPZUcZGznCt5xH8cJFnce8Dkz5vVj4k";

const server = setupServer(
  rest.get(`${API_URL}/user/refresh`, (req, res, ctx) => {
    return res(
      ctx.json({
        accessToken,
      })
    );
  }),
  rest.post(`${API_URL}/user/login`, (req, res, ctx) => {
    if (req.body.email.length < 6 || req.body.password.length < 6) {
      return res(ctx.json({ message: "test error" }), ctx.status(401));
    }

    return res(
      ctx.json({
        accessToken,
      })
    );
  }),
  rest.patch(`${API_URL}/user/resetPassword`, (req, res, ctx) => {
    if (req.body.confirmCode === "wrong") {
      return res(ctx.json({ message: "test error" }), ctx.status(401));
    }

    return res(ctx.json(ctx.status(200)));
  }),
  rest.patch(`${API_URL}/user/editData`, (req, res, ctx) => {
    if (req.body.confirmCode === "wrong") {
      return res(ctx.json({ message: "test error" }), ctx.status(401));
    }

    return res(
      ctx.json({
        accessToken,
      })
    );
  }),
  rest.post(`${API_URL}/user/setConfirmCode`, (req, res, ctx) => {
    if (!req.body.email) {
      return res(ctx.json({ message: "test error" }), ctx.status(401));
    }

    return res(ctx.status(200));
  }),
  rest.post(`${API_URL}/user/checkEmail`, (req, res, ctx) => {
    if (req.body.email.length === 0)
      return res(ctx.json({ message: "test error" }), ctx.status(401));

    if (req.body.email === "root@mail.com") {
      return res(
        ctx.json({
          find: true,
          message: "finded",
        })
      );
    }

    return res(
      ctx.json({
        find: false,
      })
    );
  }),
  rest.get(`${API_URL}/user/logout`, (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.post(`${API_URL}/user/register`, (req, res, ctx) => {
    if (req.body.email.length < 6 || req.body.password.length < 6) {
      return res(ctx.json({ message: "test error" }), ctx.status(401));
    }

    return res(
      ctx.json({
        accessToken,
      })
    );
  }),
  rest.get(`${API_URL}/user/getDevicesData/:id`, (req, res, ctx) => {
    console.log("req.params.id", req.params.id, !req.params.id);

    if (!JSON.parse(req.params.id)) {
      return res(ctx.json({ message: "test error" }), ctx.status(401));
    }

    console.log("RER");

    return res(ctx.json([{}, {}]));
  })
);

beforeAll(() => server.listen());

beforeEach(resetStateData);

afterEach(() => {
  server.resetHandlers();
});
afterAll(() => server.close());

describe("Auth store module", () => {
  it("Module exist", async () => {
    expect(store.state.auth).toStrictEqual(defaultState.auth);
  });

  // Login action

  it("Action login success", async () => {
    await store.dispatch("auth/login", {
      email: 'my@mail.com"',
      password: "rootpass",
    });
    await flushPromises();

    expect(store.state.auth.authStatus).toBe(true);
  });

  it("Action login error", async () => {
    await store.dispatch("auth/login");
    await flushPromises();

    expect(store.state.auth.authStatus).toBe(false);
    expect(store.state.alert.type).toBe("danger");
  });

  it("Action login server error", async () => {
    await store.dispatch("auth/login", {
      email: 'email"',
      password: "pass",
    });
    await flushPromises();

    expect(store.state.auth.authStatus).toBe(false);
    expect(store.state.alert.type).toBe("danger");
    expect(store.state.alert.text).toBe("test error");
  });

  // CheckEmail action

  it("Action checkEmail, find email", async () => {
    await store.dispatch("auth/checkEmail", {
      email: "root@mail.com",
      isFind: false,
    });
    await flushPromises();

    expect(store.state.auth.isConfirmCode).toBe(false);
  });

  it("Action checkEmail, not find email", async () => {
    await store.dispatch("auth/checkEmail", {
      email: "root2@mail.com",
      isFind: false,
    });
    await flushPromises();
    expect(store.state.auth.isConfirmCode).toBe(true);
  });

  it("Action checkEmail server error", async () => {
    await store.dispatch("auth/checkEmail", {
      email: "",
      isFind: true,
    });
    await flushPromises();

    expect(store.state.auth.isConfirmCode).toBe(false);
    expect(store.state.alert.type).toBe("danger");
    expect(store.state.alert.text).toBe("test error");
  });

  // ResetPassword action

  it("Action ResetPassword success", async () => {
    await store.dispatch("auth/resetPassword", {
      email: "my@mail.com",
      confirmCode: "test",
    });
    await flushPromises();

    expect(store.state.alert.type).toBe("success");
    expect(store.state.alert.text).toBe(
      $t("store.auth.newPassword", { email: "my@mail.com" })
    );
  });

  it("Action ResetPassword server error", async () => {
    await store.dispatch("auth/resetPassword", {
      email: "my@mail.com",
      confirmCode: "wrong",
    });
    await flushPromises();

    expect(store.state.alert.type).toBe("danger");
    expect(store.state.alert.text).toBe("test error");
  });

  // ChangeUserData action

  it("Action changeUserData success", async () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem");

    await store.dispatch("auth/changeUserData", {
      email: "my@mail.com",
      newEmail: "test@mail.com",
      confirmCode: "test",
    });
    await flushPromises();

    expect(setItem).toHaveBeenLastCalledWith("token", accessToken);
    expect(store.state.auth.user.email).toBe("test@mail.com");
  });

  it("Action changeUserData server error", async () => {
    await store.dispatch("auth/changeUserData", {
      email: "my@mail.com",
      confirmCode: "wrong",
    });
    await flushPromises();

    expect(store.state.alert.type).toBe("danger");
    expect(store.state.alert.text).toBe("test error");
  });

  // Logout action

  it("Action logout success", async () => {
    const removeItem = vi.spyOn(Storage.prototype, "removeItem");

    await store.dispatch("auth/logout", {
      email: "my@mail.com",
      newEmail: "test@mail.com",
      confirmCode: "test",
    });
    await flushPromises();

    expect(removeItem).toHaveBeenCalledWith("token");
    expect(store.state.auth.user.email).toBe(null);
    expect(store.state.auth.authStatus).toBe(false);
  });

  // Register action

  it("Action register success", async () => {
    await store.dispatch("auth/register", {
      email: 'my@mail.com"',
      password: "rootpass",
    });
    await flushPromises();

    expect(store.state.auth.authStatus).toBe(true);
  });

  it("Action register error", async () => {
    await store.dispatch("auth/register");
    await flushPromises();

    expect(store.state.auth.authStatus).toBe(false);
    expect(store.state.alert.type).toBe("danger");
  });

  it("Action register server error", async () => {
    await store.dispatch("auth/register", {
      email: 'email"',
      password: "pass",
    });
    await flushPromises();

    expect(store.state.auth.authStatus).toBe(false);
    expect(store.state.alert.type).toBe("danger");
    expect(store.state.alert.text).toBe("test error");
  });

  // ConfirmCode action

  it("Action confirmCode success", async () => {
    await store.dispatch("auth/confirmCode", "my@mail.com");
    await flushPromises();

    expect(store.state.alert.type).toBe(null);
    expect(store.state.alert.text).toBe("");
  });

  it("Action confirmCode server error", async () => {
    await store.dispatch("auth/confirmCode");
    await flushPromises();

    expect(store.state.alert.type).toBe("danger");
    expect(store.state.alert.text).toBe("test error");
  });

  // CheckAuth action

  it("Action initAuth success", async () => {
    localStorage.setItem("token", accessToken);
    await store.dispatch("auth/initAuth");
    await flushPromises();

    expect(store.state.auth.authStatus).toBe(true);
  });

  it("Action initAuth without access token", async () => {
    localStorage.removeItem("token");
    await store.dispatch("auth/initAuth");
    await flushPromises();

    expect(store.state.auth.authStatus).toBe(false);
  });

  it("Action initAuth with wrong access token", async () => {
    localStorage.setItem("token", "wrong");
    await store.dispatch("auth/initAuth");
    await flushPromises();

    expect(store.state.auth.authStatus).toBe(true);
  });

  // GetUserDevices action

  it("Action getUserDevices success", async () => {
    store.state.auth.user.id = 1;

    await store.dispatch("auth/getUserDevices");
    await flushPromises();

    expect(store.state.auth.devices.length).toBe(2);
  });

  it("Action getUserDevices server error", async () => {
    store.state.auth.user.id = null;

    await store.dispatch("auth/getUserDevices");
    await flushPromises();

    expect(store.state.auth.devices.length).toBe(0);
    expect(store.state.alert.type).toBe("danger");
    expect(store.state.alert.text).toBe("test error");
  });
});
