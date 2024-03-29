import puppeteer, { Mouse } from "puppeteer";

import { type CreateContextFactoryType, type CreatePageFactoryType, BrowserManager } from "../../../src";

import { type MyBrowser, type MyContext, type MyPage } from "./engine";

import { Browser, Context, Page } from "./index";

function injectPage(page: MyPage): Page {
    return new Page(page);
}

function injectContext(context: MyContext, newPage: CreatePageFactoryType<MyPage>): Context {
    return new Context(context, newPage);
}

function injectBrowser(
    browser: MyBrowser,
    newContextE: CreateContextFactoryType<MyContext, MyPage>,
    newPage: CreatePageFactoryType<MyPage>,
): Browser {
    return new Browser(browser, newContextE, newPage);
}

describe("Example Teste", () => {
    const browserManager = new BrowserManager<MyBrowser, MyContext, MyPage>(
        injectBrowser,
        injectContext,
        injectPage,
    );
    let browser: MyBrowser;

    test("Teste Instances elements", async () => {
        browser = await browserManager.newBrowser(
            async () => puppeteer.launch({ headless: "new" }) as Promise<MyBrowser>,
        );

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
});
