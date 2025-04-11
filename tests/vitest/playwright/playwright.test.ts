import { rmSync } from "node:fs";

import { Exception } from "@odg/exception";
import { chromium } from "playwright";
import { vi } from "vitest";

import {
    type ContextChemicalXInterface, type CreateContextFactoryType, type CreatePageFactoryType, BrowserManager,
} from "src";

import { ExamplePage } from "../Pages/ExamplePage";
import { ExamplePageTwoAttempt } from "../Pages/ExamplePageTwoAttempt";
import { ExamplePageWithFinish } from "../Pages/ExamplePageWithFinish";
import { ExamplePageWithoutFailure } from "../Pages/ExamplePageWithoutFailure";
import { ExamplePageWithoutFinish } from "../Pages/ExamplePageWithoutFinish";

import {
    type ContextClassEngine,
    type BrowserClassEngine,

    type MyPage,
    type MyContext,
    type MyBrowser,
    type PageClassEngine,
} from "./engine";

import { Browser, Context, Page } from ".";

function injectPage(context: ContextChemicalXInterface<ContextClassEngine>, pageEngine: PageClassEngine): Page {
    return new Page(context, pageEngine);
}

function injectContext(
    contextEngine: ContextClassEngine,
    newPage: CreatePageFactoryType<ContextChemicalXInterface<ContextClassEngine>, PageClassEngine>,
): Context {
    return new Context(contextEngine, newPage);
}

function injectBrowser(
    browserEngine: BrowserClassEngine,
    newContext: CreateContextFactoryType<ContextClassEngine, PageClassEngine>,
    newPage: CreatePageFactoryType<ContextChemicalXInterface<ContextClassEngine>, PageClassEngine>,
): Browser {
    return new Browser(browserEngine, newContext, newPage);
}

describe("Example Teste", () => {
    const browserManager = new BrowserManager<BrowserClassEngine, ContextClassEngine, PageClassEngine>(
        injectBrowser,
        injectContext,
        injectPage,
    );
    let browser: MyBrowser;
    let context: MyContext;
    let contexts: MyContext[];
    let emptyContext: MyContext[];
    let page: MyPage;
    beforeAll(async () => {
        browser = await browserManager.newBrowser(async () => chromium.launch({})) as MyBrowser;

        emptyContext = browser.contexts() as MyContext[];
        context = await browser.newContext() as MyContext;
        contexts = browser.contexts() as MyContext[];
        page = await context.newPage() as MyPage;
    });

    test("Page Empty", async () => {
        const newContext = await browser.newContext();
        expect(newContext.pages().length).toEqual(0);
    });

    test("Page Count", async () => {
        const newPage = await context.newPage();
        expect(context.pages().length).toEqual(2);
        await newPage.close();
        expect(context.pages().length).toEqual(1);
    });

    test("Page Options", async () => {
        await expect(context.defaultPageOptions()).resolves.toEqual({});
        await expect(context.cookies()).resolves.toEqual([]);
    });

    test("EmptyContext", async () => {
        expect(contexts).not.toBeUndefined();
        expect(emptyContext).toEqual([]);
        expect(contexts !== emptyContext).toBeTruthy();
        const handlerAttemptMock = vi.spyOn(
            browser.$browserInstance as unknown as { contexts(): undefined },
            "contexts",
        );
        handlerAttemptMock.mockImplementation(() => void 0);

        expect(browser.contexts()).toEqual([]);
    });

    test("PersistentContext", async () => {
        const context2 = await browserManager.newPersistentContext(
            async () => chromium.launchPersistentContext("./temp/") as Promise<MyContext>,
        );
        expect(context2).not.toBeUndefined();
        expect(typeof context2.newPage).toBe("function");
        await expect(context2.cookies()).resolves.toEqual([]);
        await context2.close();

        rmSync("./temp/", { recursive: true });
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

    test("attempt failure not exists", async () => {
        const basePage2 = new ExamplePageWithoutFailure(page, {});
        await expect(basePage2.execute()).rejects.toThrowError();
        expect(basePage2.startFunction)
            .toBeCalledTimes(2);
    });

    test("Close browser", async () => {
        await page.context().close();
        await page.context().browser()?.close();
    });
});
