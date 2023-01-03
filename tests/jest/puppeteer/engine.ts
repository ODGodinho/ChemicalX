import puppeteer, {
    type Browser,
    type PuppeteerLaunchOptions,
    type Page,
    type BrowserContext,
    type PuppeteerNode,
} from "puppeteer";

export type BrowserTypeEngine = PuppeteerNode;

export type BrowserClassEngine = Browser;

export type ContextClassEngine = BrowserContext;

export type PageClassEngine = Page;

export type BrowserOptionsEngine = PuppeteerLaunchOptions;

export const browserEngine = puppeteer;
