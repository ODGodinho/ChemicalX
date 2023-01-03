import { BasePage, BrowserInstanceException } from "../../../src/crawler/index";
import { ExamplePage } from "../crawler/ExamplePage";

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
        await expect(context.cookies()).resolves.toEqual([]);
        const page = await context.newPage();

        const basePage = new ExamplePage(page, {});
        expect(basePage).toBeInstanceOf(BasePage);
        await expect(basePage.preStart()).resolves.toBeUndefined();
        expect(basePage["currentAttempt"]).toBe(1);
        await expect(basePage.success()).resolves.toBeUndefined();
        expect(basePage["currentAttempt"]).toBe(0);

        await page.goto("https://www.google.com");
        expect(await page.isVisible("div")).toBeTruthy();
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
