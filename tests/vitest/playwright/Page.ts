import { type PageChemicalXInterface, Page as PageBase } from "../../../src/crawler";

import type {
    ContextClassEngine,
    PageClassEngine,
} from "./engine";

export class Page extends PageBase<
    ContextClassEngine,
    PageClassEngine
> implements PageChemicalXInterface<PageClassEngine> {

    public example(): number {
        return 1;
    }

}
