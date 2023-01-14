import {
    type BrowserType,
    chromium,
    type Browser,
    type LaunchOptions,
    type Page,
    type BrowserContext,
    type BrowserContextOptions,
} from "playwright";

import { type Browser as BrowserClass } from "./Browser";
import { type Context as ContextClass } from "./Context";

export type BrowserTypeEngine = BrowserType;

export type BrowserClassEngine = Browser;

export type ContextClassEngine = BrowserContext;

export type PageClassEngine = Page;

export type BrowserOptionsEngine = LaunchOptions;

export type ContextOptionsEngine = BrowserContextOptions;

export const browserEngine = chromium;

export type MyBrowser = BrowserClass & BrowserClassEngine;

export type MyPage = Page & PageClassEngine;

export type MyContext = ContextClass & ContextClassEngine;
