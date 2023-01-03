import {
    type BrowserChemicalXInterface,
    type BrowserEngineInterface,
} from "./Browser";
import { type ContextChemicalXInterface, type ContextEngineInterface } from "./Context";

export type PageChemicalXConstructorTypo<
    BrowserTypeEngine,
    BrowserClassEngine extends BrowserEngineInterface,
    ContextClassEngine extends ContextEngineInterface,
    PageClassEngine extends PageEngineInterface,
> = new (
    $browserClass: BrowserChemicalXInterface<BrowserClassEngine, ContextClassEngine>,
    $contextClass: ContextChemicalXInterface<ContextClassEngine>,
    $pageClass: PageChemicalXConstructorTypo<
        BrowserTypeEngine, BrowserClassEngine, ContextClassEngine, PageClassEngine
    >,
) => PageChemicalXInterface<PageClassEngine>;

export interface PageChemicalXInterface<PageClassEngine extends PageEngineInterface> {
    $pageInstance: PageClassEngine;
}

export interface PageEngineInterface {
    goto: CallableFunction;
}
