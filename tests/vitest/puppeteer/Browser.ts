import {
    Browser as BrowserBase,
} from "../../../src/crawler/index";

import {
    type MyBrowser,
    type MyContext,
    type MyPage,
    type BrowserOptionsEngine,
} from "./engine";

export class Browser extends BrowserBase<
    MyBrowser,
    MyContext,
    MyPage
> {

    public async defaultContextOptions(): Promise<BrowserOptionsEngine> {
        return {
            ...await super.defaultContextOptions(),
            headless: true,
        };
    }

}
