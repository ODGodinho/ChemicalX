/* eslint-disable regex/invalid */
import type { } from "playwright-core";
import type { } from "puppeteer-core";

declare module "playwright-core" {
    interface Page {
        example(): number;
    }
}

declare module "puppeteer-core" {
    interface Page {
        example(): number;
    }
}
