import { type BrowserChemicalXInterface, type BrowserEngineInterface } from "./Browser";
import { type PageEngineInterface, type PageChemicalXConstructorTypo } from "./Page";

export interface ContextOptionsLibraryInterface {

    /**
     * Maximum time in milliseconds to wait for the response.
     * Defaults to `30000` (30 seconds). Pass `0` to disable timeout.
     */
    timeout?: number;

}

export interface ContextEngineInterface {
    newPage: CallableFunction;
}

export type ContextChemicalXConstructorTypo<
    BrowserTypeEngine,
    BrowserClassEngine extends BrowserEngineInterface,
    ContextClassEngine extends ContextEngineInterface,
    PageClassEngine extends PageEngineInterface,
> = new (
    $browserClass: BrowserChemicalXInterface<BrowserClassEngine, ContextClassEngine>,
    $contextClass: ContextChemicalXConstructorTypo<
        BrowserTypeEngine, BrowserClassEngine, ContextClassEngine, PageClassEngine
    >,
    $pageClass: PageChemicalXConstructorTypo<
        BrowserTypeEngine, BrowserClassEngine, ContextClassEngine, PageClassEngine
    >,
    $options?: ContextOptionsLibraryInterface,
) => ContextChemicalXInterface<ContextClassEngine>;

export interface ContextChemicalXInterface<ContextClassEngine extends ContextEngineInterface> {
    $contextInstance: ContextClassEngine;
    newPage: CallableFunction;
    contextOptions(): Promise<ContextOptionsLibraryInterface>;
}
