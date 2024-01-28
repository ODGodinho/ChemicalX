import puppeteer, {
    type Browser,
    type PuppeteerLaunchOptions,
    type Page,
    type BrowserContext,
    type PuppeteerNode,
} from "puppeteer";

import { type Browser as BrowserClass } from "./Browser";
import { type Context as ContextClass } from "./Context";

export type BrowserTypeEngine = PuppeteerNode;

export type BrowserClassEngine = Browser;

export type ContextClassEngine = BrowserContext;

export type PageClassEngine = Page;

export type BrowserOptionsEngine = PuppeteerLaunchOptions;

export const browserEngine = puppeteer;

export type MyBrowser = BrowserClass & BrowserClassEngine;

export type MyPage = Page & PageClassEngine;

export type MyContext = ContextClass & ContextClassEngine;
