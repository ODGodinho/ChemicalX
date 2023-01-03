import { Context as ContextBase, type ContextOptionsLibraryInterface } from "../../../src/crawler";

import {
    type BrowserClassEngine,
    type BrowserTypeEngine,
    type ContextClassEngine,
    type PageClassEngine,
} from "./engine";

export class Context extends ContextBase<
    BrowserTypeEngine,
    BrowserClassEngine,
    ContextClassEngine,
    PageClassEngine
> {

    public async contextOptions(): Promise<ContextOptionsLibraryInterface> {
        return {
            ...await super.contextOptions(),
        };
    }

}
