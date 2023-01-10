import { Mouse } from "puppeteer";

import { BrowserInstanceException } from "../../../src/crawler/index";

import {
    type BrowserClassEngine,
    browserEngine,
    type BrowserTypeEngine,
    type ContextClassEngine,
    type PageClassEngine,
} from "./engine";

import { Browser, Context, Page } from "./index";

describe("Example Teste", () => {
    test("Teste Instances elements", async () => {
        const browser = await Browser.create<
            BrowserTypeEngine,
            BrowserClassEngine,
            ContextClassEngine,
            PageClassEngine
        >(
            browserEngine,
            Browser,
            Context,
            Page,
        ).setUp();
        const context = await browser.newContext();
        expect(context.isIncognito()).toEqual(true);
        expect(typeof context.id).toBe("string");
        const page = await context.newPage();
        await page.goto("https://www.google.com");
        expect(await page.waitForSelector("div")).toBeTruthy();
        expect(page.mouse).toBeInstanceOf(Mouse);
        expect(page.example()).toEqual(1);
        await browser.close();
    });
    test("Test Browser not init", async () => {
        const browser = Browser.create<
            BrowserTypeEngine,
            BrowserClassEngine,
            ContextClassEngine,
            PageClassEngine
        >(
            browserEngine,
            Browser,
            Context,
            Page,
        );

        await expect(browser.newContext()).rejects.toThrow(BrowserInstanceException);
    });
});
