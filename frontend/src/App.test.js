/* eslint-disable no-unused-vars */
import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import App from "./App.vue";

import router from "./router/index";
import store from "./store/index";
import i18n from "./locales/index";

let wrapper;

beforeEach(() => {
  i18n.global.locale._setter("en");

  wrapper = mount(App, {
    global: {
      attachToDocument: true,
      plugins: [router, store, i18n],
    },
  });
});

afterEach(() => {
  wrapper.unmount();
});

describe("App component", () => {
  it("404 page", async () => {
    router.push("/randomPage");

    await router.isReady();

    expect(wrapper.text()).toContain("Page not found");
  });

  it("Routing to auth protected page without auth status", async () => {
    router.push("/chat");

    await router.isReady();
    expect(wrapper.text()).toContain("Auth");
    expect(wrapper.text()).toContain("Login");
  });

  it("Routing to auth protected page with auth status", async () => {
    store._state.data.auth.authStatus = true;
    store._state.data.auth.user.role = "USER";
    store._state.data.auth.user.isBanned = false;

    const intersectionObserverMock = () => ({
      observe: () => null,
    });

    window.IntersectionObserver = vi
      .fn()
      .mockImplementation(intersectionObserverMock);

    const push = vi.spyOn(router, "push");

    router.push("/chat");

    await router.isReady();

    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith("/chat");
    expect(wrapper.find(".chat__container").exists()).toBe(true);
  });
});
