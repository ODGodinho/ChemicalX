import { Browser as BrowserBase } from "../../../src/crawler/index";

import {
    type BrowserOptionsEngine,
    type BrowserClassEngine,
    type ContextClassEngine,
    type PageClassEngine,
} from "./engine";

export class Browser extends BrowserBase<
    BrowserClassEngine,
    ContextClassEngine,
    PageClassEngine
> {

    public async defaultContextOptions(): Promise<BrowserOptionsEngine> {
        return {
            ...await super.defaultContextOptions(),
            headless: true,
            args: [ "--no-sandbox" ],
        };
    }

}
