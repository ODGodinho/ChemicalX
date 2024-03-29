import { type PageChemicalXInterface, Page as PageBase } from "../../../src/crawler";

import {
    type PageClassEngine,
} from "./engine";

export class Page extends PageBase<
    PageClassEngine
> implements PageChemicalXInterface<PageClassEngine> {

    public example(): number {
        return 1;
    }

}
