import { type BrowserChemicalXInterface } from "../../../src";
import { Browser as BrowserBase } from "../../../src/crawler/index";

import {
    type BrowserClassEngine,
    type BrowserOptionsEngine,
    type BrowserTypeEngine,
    type ContextClassEngine,
    type PageClassEngine,
} from "./engine";

export class Browser extends BrowserBase<
    BrowserTypeEngine,
    BrowserClassEngine,
    ContextClassEngine,
    PageClassEngine
> implements BrowserChemicalXInterface<BrowserClassEngine, ContextClassEngine> {

    public async browserOptions(): Promise<BrowserOptionsEngine> {
        return {
            ...await super.browserOptions(),
            headless: true,
        };
    }

    public async setUp(): Promise<this> {
        this.$browserInstance = await this.$browserEngine.launch(await this.browserOptions());

        return this;
    }

}
