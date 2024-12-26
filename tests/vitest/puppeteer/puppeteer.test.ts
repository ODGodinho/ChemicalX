import puppeteer, { Mouse } from "puppeteer";

import {
    type ContextChemicalXInterface, type CreateContextFactoryType, type CreatePageFactoryType, BrowserManager,
} from "../../../src";

import {
    type BrowserClassEngine, type ContextClassEngine, type MyBrowser, type PageClassEngine,
} from "./engine";

import { Browser, Context, Page } from "./index";

function injectPage(context: ContextChemicalXInterface<ContextClassEngine>, page: PageClassEngine): Page {
    return new Page(context, page);
}

function injectContext(
    context: ContextClassEngine,
    newPage: CreatePageFactoryType<ContextChemicalXInterface<ContextClassEngine>, PageClassEngine>,
): Context {
    return new Context(context, newPage);
}

function injectBrowser(
    browser: BrowserClassEngine,
    newContextE: CreateContextFactoryType<ContextClassEngine, PageClassEngine>,
    newPage: CreatePageFactoryType<ContextChemicalXInterface<ContextClassEngine>, PageClassEngine>,
): Browser {
    return new Browser(browser, newContextE, newPage);
}

describe("Example Teste", () => {
    const browserManager = new BrowserManager<BrowserClassEngine, ContextClassEngine, PageClassEngine>(
        injectBrowser,
        injectContext,
        injectPage,
    );
    let browser: MyBrowser;

    beforeAll(async () => {
        browser = await browserManager.newBrowser(
            async () => puppeteer.launch({ headless: true, args: [ "--no-sandbox" ] }),
        ) as MyBrowser;
    });

    test("Teste Instances elements", async () => {
        const context = await browser.newContext();
        expect(context.closed).toEqual(false);
        expect(typeof context.id).toBe("string");
        const page = await context.newPage();
        await page.goto("https://www.google.com");
        expect(await page.waitForSelector("div")).toBeTruthy();
        expect(page.mouse).toBeInstanceOf(Mouse);
        expect(page.example()).toEqual(1);
        await browser.close();
    });
});
