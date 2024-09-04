/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import { describe, it, beforeEach, expect } from "vitest";
import { flushPromises } from "@vue/test-utils";
import store from "@/store";

import i18n from "@/locales/index";
const { t: $t } = i18n.global;

import { defaultState, resetStateData } from "@/utils/test/store";
import { dateTransformer } from "./users.module";

beforeEach(resetStateData);

describe("Users store module", () => {
  it("Module exist", async () => {
    expect(store.state.users).toStrictEqual(defaultState.users);
  });

  it("Mutation saveUsers", () => {
    store.state.users.usersList = new Map();

    expect(store.state.users.usersList.size).toBe(0);

    store.commit("users/saveUsers", '[[1,"123"],[2,"test"]]');

    expect(store.state.users.usersList.size).toBe(2);
  });

  it("Mutation saveUser", () => {
    store.state.users.usersList = new Map();

    expect(store.state.users.usersList.size).toBe(0);

    store.commit("users/saveUser", { id: 1, login: "test" });

    expect(store.state.users.usersList.size).toBe(1);
  });

  it("Mutation updateUserOnline with online status", () => {
    store.state.users.usersList = new Map([[1, { id: 1, login: "test" }]]);

    store.commit("users/updateUserOnline", {
      userId: 1,
      peerId: "peer",
      status: "online",
    });

    const userData = store.state.users.usersList.get(1);

    expect(userData.lastOnline).toBe($t("store.user.online"));
  });

  it("Mutation updateUserOnline without user data", () => {
    store.state.users.usersList = new Map();

    store.commit("users/updateUserOnline", {
      userId: 1,
      peerId: "peer",
      status: "online",
    });

    expect(store.state.users.usersList.size).toBe(0);
  });

  it("Mutation updateUserOnline with offline status and last online time", () => {
    store.state.users.usersList = new Map([[1, { id: 1, login: "test" }]]);

    const date = new Date();

    store.commit("users/updateUserOnline", {
      userId: 1,
      peerId: "peer",
      status: date,
    });

    const userData = store.state.users.usersList.get(1);

    expect(userData.lastOnline).toBe($t("store.user.recently"));
    expect(userData.lastDate).toBe(date);
  });

  it("Mutation updateUserOnline with offline status and last online time", () => {
    store.state.users.usersList = new Map([[1, { id: 1, login: "test" }]]);

    const date = new Date(2023, 4, 16, 22, 45);

    const transformedDate = dateTransformer(date);

    store.commit("users/updateUserOnline", {
      userId: 1,
      peerId: "peer",
      status: new Date(),
    });

    store.commit("users/updateUsersDateOnline");

    const userData = store.state.users.usersList.get(1);

    expect(userData.lastOnline).not.toBe(transformedDate);
  });
});
