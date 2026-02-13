import puppeteer, {
    type Browser,
    type BrowserContext,
    type LaunchOptions,
    type Page,
    type PuppeteerNode,
} from "puppeteer";

import type { Browser as BrowserClass } from "./Browser";
import type { Context as ContextClass } from "./Context";
import type { Page as PageClass } from "./Page";

export type BrowserTypeEngine = PuppeteerNode;

export type BrowserClassEngine = Browser;

export type ContextClassEngine = BrowserContext;

export type PageClassEngine = Page;

export type BrowserOptionsEngine = LaunchOptions;

export const browserEngine = puppeteer;

export type MyBrowser = BrowserClass & BrowserClassEngine;

export type MyPage = PageClass & PageClassEngine;

export type MyContext = ContextClass & ContextClassEngine;
