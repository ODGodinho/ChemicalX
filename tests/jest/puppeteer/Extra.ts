/* eslint-disable regex/invalid */
import type { } from "puppeteer-core";

declare module "puppeteer" {
    interface Page {
        example(): number;
    }
}
