/* eslint-disable no-unused-vars */
import {
  describe,
  it,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
  expect,
  vi,
} from "vitest";
import { ref } from "vue";
import { mount, flushPromises, shallowMount } from "@vue/test-utils";
import FreeUsersList from "./FreeUsersList.vue";

import { resetStateData } from "@/utils/test/store";

import store from "@/store";
import i18n from "@/locales";

import { rest } from "msw";
import { setupServer } from "msw/node";
const API_URL = import.meta.env.VITE_API;

let wrapper;

const server = setupServer(
  rest.get(`${API_URL}/contact/freeList`, (req, res, ctx) => {
    if (req.url.searchParams.get("pattern")) {
      console.log("with pattern");

      return res(
        ctx.json({
          hasMore: true,
          page: 0,
          resList: [
            {
              email: "adminPattern@mail.com",
              id: 3,
              lastOnline: null,
              login: "testadminPattern",
              role: "admin",
              peerId: "test",
            },
          ],
        })
      );
    }

    console.log("without pattern");

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

const IntersectionObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  takeRecords: vi.fn(),
  unobserve: vi.fn(),
}));

vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);

const userId = ref(null);
const pattern = ref(null);

beforeAll(() => server.listen());

afterEach(() => {
  server.resetHandlers();
  vi.restoreAllMocks();
});
afterAll(() => server.close());

beforeEach(() => {
  i18n.global.locale._setter("en");

  resetStateData();

  wrapper = mount(FreeUsersList, {
    global: {
      attachToDocument: true,
      plugins: [store, i18n],
      provide: {
        modalUserId: userId,
        contactsPattern: pattern,
      },
    },
  });
});

afterEach(() => {
  wrapper.unmount();
});

describe("FreeUsersList component", () => {
  it("Render list, open modal", async () => {
    const spy = vi.spyOn(wrapper.vm, "openUserModal");

    await flushPromises();
    await new Promise((resolve) => window.setTimeout(resolve, 10));

    const contacts = wrapper.findAll(".contact__item");

    expect(contacts.length).toBe(2);

    contacts[0].trigger("click");
    expect(userId.value).toBe(1);

    contacts[1].trigger("click");
    expect(userId.value).toBe(2);

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("Render list with pattern", async () => {
    await flushPromises();
    pattern.value = "test";

    await flushPromises();

    const contacts = wrapper.findAll(".contact__item");

    expect(contacts.length).toBe(1);
  });
});
