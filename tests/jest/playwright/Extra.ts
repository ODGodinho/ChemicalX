/* eslint-disable regex/invalid */
import type { } from "playwright-core";

declare module "playwright-core" {
    interface Page {
        example(): number;
    }
}
