import { Page as PageBase } from "../../../src/crawler";

import {
    type ContextClassEngine,
    type PageClassEngine,
} from "./engine";

export class Page extends PageBase<
    ContextClassEngine,
    PageClassEngine
> {

    public example(): number {
        return 1;
    }

}
