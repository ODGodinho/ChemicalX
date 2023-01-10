import { Exception } from "@odg/exception";

import { BrowserInstanceException } from "../../../src";
import { ExamplePage } from "../Pages/ExamplePage";
import { ExamplePageWithFinish } from "../Pages/ExamplePageWithFinish";
import { ExamplePageWithoutFinish } from "../Pages/ExamplePageWithoutFinish";

import {
    type BrowserClassEngine,
    browserEngine,
    type BrowserTypeEngine,
    type ContextClassEngine,
    type PageClassEngine,
} from "./engine";

import { Browser, Context, Page } from ".";

describe("Example Teste", () => {
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

    let page: PageClassEngine;
    beforeAll(async () => {
        await browser.setUp();

        const context = await browser.newContext();
        await expect(context.cookies()).resolves.toEqual([]);
        page = await context.newPage();
    });

    test("Teste Instances elements", async () => {
        const basePage = new ExamplePage(page, {});
        expect(basePage).toBeInstanceOf(ExamplePage);
        await expect(basePage.preStart()).resolves.toBeUndefined();
        expect(basePage["currentAttempt"]).toBe(1);
        await expect(basePage.success()).resolves.toBeUndefined();
        expect(basePage["currentAttempt"]).toBe(0);
    });

    const exceptionTestMessage = "test";
    test("Attempt Page", async () => {
        const basePage = new ExamplePage(page, {});
        await expect(basePage.execute()).resolves.toBeUndefined();
        await expect(basePage["executeCatcher"](new Exception(exceptionTestMessage)))
            .rejects.toThrowError(exceptionTestMessage);

        const basePage3 = new ExamplePageWithoutFinish(page, {});
        await expect(basePage3.execute()).resolves.toBeUndefined();
        await expect(basePage3["executeCatcher"](new Exception(exceptionTestMessage))).rejects.toThrowError(Exception);
        await expect(basePage3["executeCatcher"](void 0)).rejects.toThrowError("Page UnknownException");

        expect(page.example()).toEqual(1);
    });

    test("attempt WithFinish", async () => {
        const basePage2 = new ExamplePageWithFinish(page, {});
        await expect(basePage2.execute()).resolves.toBeUndefined();
        await expect(basePage2["executeCatcher"](new Exception(exceptionTestMessage)))
            .resolves.toBeUndefined();

        await expect(basePage2["executeCatcher"](void 0))
            .resolves.toBeUndefined();
    });

    test("Test Browser not init", async () => {
        const browserLocal = Browser.create<
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

        await expect(browserLocal.newContext()).rejects.toThrow(BrowserInstanceException);
    });

    test("Close browser", async () => {
        await page.context().close();
        await page.context().browser()?.close();
    });
});
