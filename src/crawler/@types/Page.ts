import {
    type BrowserChemicalXInterface,
    type BrowserEngineInterface,
} from "./Browser";
import { type ContextChemicalXInterface, type ContextEngineInterface } from "./Context";

export interface PageOptionsLibraryInterface {

}

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

export interface PageChemicalXInterface<PageEngineType extends PageEngineInterface> {
    $pageInstance: PageEngineType;
}

export interface PageEngineInterface {
    goto: CallableFunction;
}
