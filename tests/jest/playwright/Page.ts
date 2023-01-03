import { Page as PageBase } from "../../../src/crawler";

import {
    type BrowserClassEngine,
    type BrowserTypeEngine,
    type ContextClassEngine,
    type PageClassEngine,
} from "./engine";

export class Page extends PageBase<
    BrowserTypeEngine,
    BrowserClassEngine,
    ContextClassEngine,
    PageClassEngine
> {

    public example(): number {
        return 1;
    }

}
