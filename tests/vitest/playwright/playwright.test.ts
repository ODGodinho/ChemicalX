import { rmdirSync } from "node:fs";

import { Exception } from "@odg/exception";
import { chromium } from "playwright";

import { type CreateContextFactoryType, type CreatePageFactoryType, BrowserManager } from "src";

import { ExamplePage } from "../Pages/ExamplePage";
import { ExamplePageTwoAttempt } from "../Pages/ExamplePageTwoAttempt";
import { ExamplePageWithFinish } from "../Pages/ExamplePageWithFinish";
import { ExamplePageWithoutFinish } from "../Pages/ExamplePageWithoutFinish";

import {
    type MyPage,
    type MyContext,
    type MyBrowser
    ,
    type PageClassEngine,
} from "./engine";

import { Browser, Context, Page } from ".";

function injectPage(pageEngine: MyPage): Page {
    return new Page(pageEngine);
}

function injectContext(contextEngine: MyContext, newPage: CreatePageFactoryType<MyPage>): Context {
    return new Context(contextEngine, newPage);
}

function injectBrowser(
    browserEngine: MyBrowser,
    newContext: CreateContextFactoryType<MyContext, MyPage>,
    newPage: CreatePageFactoryType<MyPage>,
): Browser {
    return new Browser(browserEngine, newContext, newPage);
}

describe("Example Teste", () => {
    const browserManager = new BrowserManager<MyBrowser, MyContext, MyPage>(
        injectBrowser,
        injectContext,
        injectPage,
    );
    let browser: MyBrowser;
    let context: MyContext;
    let page: PageClassEngine;
    beforeAll(async () => {
        browser = await browserManager.newBrowser(async () => chromium.launch({}) as Promise<MyBrowser>);

        context = await browser.newContext();
        page = await context.newPage();
    });

    test("Page Options", async () => {
        await expect(context.defaultPageOptions()).resolves.toEqual({});
        await expect(context.cookies()).resolves.toEqual([]);
    });

    test("PersistentContext", async () => {
        const context2 = await browserManager.newPersistentContext(
            async () => chromium.launchPersistentContext("./temp/") as Promise<MyContext>,
        );
        expect(context2).not.toBeUndefined();
        expect(typeof context2.newPage).toBe("function");
        await expect(context2.cookies()).resolves.toEqual([]);
        await context2.close();

        rmdirSync("./temp/", { recursive: true });
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

    test("attempt page number", async () => {
        const basePage2 = new ExamplePageTwoAttempt(page, {});
        await expect(basePage2.execute()).rejects.toThrowError();
        expect(basePage2.startFunction)
            .toBeCalledTimes(2);
    });

    test("Close browser", async () => {
        await page.context().close();
        await page.context().browser()?.close();
    });
});
