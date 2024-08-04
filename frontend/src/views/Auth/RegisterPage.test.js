/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import RegisterPage from "./RegisterPage.vue";
import {
  expect,
  describe,
  it,
  beforeAll,
  afterAll,
  afterEach,
  beforeEach,
} from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import i18n from "@/locales";
import store from "@/store/index";

import { rest } from "msw";
import { setupServer } from "msw/node";
const API_URL = import.meta.env.VITE_API;

const accessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImVtYWlsIjoicm9vdEBnbWFpbC5jb20iLCJsb2dpbiI6InJvb3QwMSIsInJvbGUiOiJVU0VSIiwiaXNCYW5uZWQiOmZhbHNlLCJpbmZvIjp7InBob25lIjpudWxsLCJkZXRhaWxzIjpudWxsfSwiZGV2aWNlSWQiOjM0LCJpYXQiOjE2Nzg5MTc0ODMsImV4cCI6MTY3ODkxNzc4M30.OdrbeusH4xTdoPZUcZGznCt5xH8cJFnce8Dkz5vVj4k";

const server = setupServer(
  rest.post(`${API_URL}/user/checkEmail`, (req, res, ctx) => {
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
  rest.post(`${API_URL}/user/setConfirmCode`, (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.post(`${API_URL}/user/register`, (req, res, ctx) => {
    return res(
      ctx.json({
        accessToken,
      })
    );
  })
);

let wrapper;

beforeAll(() => server.listen());

beforeEach(() => {
  wrapper = mount(RegisterPage, {
    global: {
      attachToDocument: true,
      plugins: [i18n, store],
    },
  });
});

afterEach(() => {
  server.resetHandlers();
  wrapper.unmount();
});
afterAll(() => server.close());

describe("Register view page", () => {
  it("Success register", async () => {
    await wrapper.find("#email").setValue("my@mail.com");
    await wrapper.find("#login").setValue("adminroot");
    await wrapper.find("#password").setValue("rootpass");
    await wrapper.find("#ConfirmPassword").setValue("rootpass");

    await wrapper.find("form").trigger("submit.prevent");

    await new Promise((resolve) => window.setTimeout(resolve, 10));

    expect(wrapper.find("#code").exists()).toBe(true);

    await wrapper.find("#code").setValue("1111");

    await wrapper.find("form").trigger("submit.prevent");
    await new Promise((resolve) => window.setTimeout(resolve, 10));
    // await flushPromises();

    expect(store._state.data.auth.authStatus).toBe(true);
  });

  it("Empty form error", async () => {
    await wrapper.find("form").trigger("submit.prevent");

    await flushPromises();
    await new Promise((resolve) => window.setTimeout(resolve, 10));

    expect(wrapper.find(".alert__danger").exists()).toBe(true);
  });

  it("Email is already used", async () => {
    await wrapper.find("#email").setValue("root@mail.com");
    await wrapper.find("#login").setValue("adminroot");
    await wrapper.find("#password").setValue("rootpass");
    await wrapper.find("#ConfirmPassword").setValue("rootpass");

    await wrapper.find("form").trigger("submit.prevent");

    await new Promise((resolve) => window.setTimeout(resolve, 10));
    await flushPromises();

    expect(wrapper.find("#code").exists()).toBe(false);
    expect(wrapper.find(".alert__text").text()).toBe("finded");
    expect(wrapper.find(".alert__danger").exists()).toBe(true);
  });
});
