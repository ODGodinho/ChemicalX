// eslint-disable-next-line regex/invalid, import/no-extraneous-dependencies, import/no-empty-named-blocks
import { } from "puppeteer-core";

declare module "puppeteer" {
    interface Page {
        example(): number;
    }
}
