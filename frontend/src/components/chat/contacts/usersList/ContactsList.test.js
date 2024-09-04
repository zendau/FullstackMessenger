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
import ContactsList from "./ContactsList.vue";

import { resetStateData } from "@/utils/test/store";

import store from "@/store";
import i18n from "@/locales";

import { rest } from "msw";
import { setupServer } from "msw/node";
const API_URL = import.meta.env.VITE_API;

let wrapper;

const server = setupServer(
  rest.get(`${API_URL}/contact/list`, (req, res, ctx) => {
    if (req.url.searchParams.get("pattern")) {
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

  wrapper = mount(ContactsList, {
    global: {
      attachToDocument: true,
      plugins: [store, i18n],
      provide: {
        modalUserId: userId,
        contactsPattern: pattern,
        createGroupUsers: ref([]),
      },
    },
  });
});

afterEach(() => {
  wrapper.unmount();
});

describe("ContactsList component", () => {
  it("Render list", async () => {
    const spy = vi.spyOn(wrapper.vm, "openUserModal");

    await flushPromises();

    const contacts = wrapper.findAll(".contact__item");

    expect(contacts.length).toBe(2);

    contacts[0].trigger("contextmenu", {
      button: 2,
    });

    expect(userId.value).toBe(1);

    contacts[1].trigger("contextmenu", {
      button: 2,
    });
    expect(userId.value).toBe(2);

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("Open private chat", async () => {
    await flushPromises();

    const contact = wrapper.find(".contact__item");

    const checkPrivateContactSpy = vi.spyOn(wrapper.vm, "checkPrivateContact");

    checkPrivateContactSpy.mockImplementation(() => {});

    contact.trigger("click");

    expect(checkPrivateContactSpy).toHaveBeenCalledTimes(1);
  });

  it("Render list with pattern", async () => {
    await flushPromises();
    pattern.value = "test";

    await flushPromises();

    const contacts = wrapper.findAll(".contact__item");

    expect(contacts.length).toBe(1);
  });
});
