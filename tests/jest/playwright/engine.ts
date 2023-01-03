import {
    type BrowserType,
    chromium,
    type Browser,
    type LaunchOptions,
    type Page,
    type BrowserContext,
} from "playwright";

export type BrowserTypeEngine = BrowserType;

export type BrowserClassEngine = Browser;

export type ContextClassEngine = BrowserContext;

export type PageClassEngine = Page;

export type BrowserOptionsEngine = LaunchOptions;

export const browserEngine = chromium;
