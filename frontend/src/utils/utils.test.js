/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import { describe, it, beforeEach, expect } from "vitest";
import { flushPromises } from "@vue/test-utils";
import isLink from "./isLink";
import messageHTMLConvert from "./messageHTMLConvert";
import throttle from "./throttle";
import slavicPluralization from "@/locales/pluralization/slavic.pluralization";

describe("Utils testing", () => {
  it("isLink - text with link", () => {
    const resLink = isLink("hello http://ya.ru");

    console.log("resLink", resLink);

    expect(resLink.includes("<a target='_blank' class='message__link'")).toBe(
      true
    );
  });

  it("isLink - text without link", () => {
    const resLink = isLink("helllo");

    console.log("resLink", resLink);

    expect(resLink.includes("<a target='_blank' class='message__link'")).toBe(
      false
    );
  });

  it("messageHTMLConvert", () => {
    const res = messageHTMLConvert("<p><div>Test</br></div></p>");

    expect(res).toBe("Test");
  });

  it("messageHTMLConvert", async () => {
    let i = 0;

    const testThrottle = throttle(() => i++);

    testThrottle();
    testThrottle();
    testThrottle();

    await new Promise((r) => setTimeout(r, 1100));

    expect(i).toBe(1);
  });

  it("slavicPluralization, 0", async () => {
    const res = slavicPluralization(0, 0);

    expect(res).toBe(0);
  });

  it("slavicPluralization, 1", async () => {
    const res = slavicPluralization(1, 3);

    expect(res).toBe(1);
  });

  it("slavicPluralization, 2", async () => {
    const res = slavicPluralization(5, 3);

    expect(res).toBe(2);
  });

  it("slavicPluralization, 3", async () => {
    const res = slavicPluralization(6, 5);

    expect(res).toBe(3);
  });
});
