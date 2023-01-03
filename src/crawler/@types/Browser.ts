import {
    type ContextEngineInterface,
    type ContextChemicalXConstructorTypo,
    type ContextOptionsLibraryInterface,
    type ContextChemicalXInterface,
} from "./Context";
import {
    type PageEngineInterface,
    type PageChemicalXConstructorTypo,
} from "./Page";

export interface BrowserOptionsLibraryInterface {

    /**
     * Additional arguments to pass to the browser instance. The list of Chromium flags can be found
     * [here](http://peter.sh/experiments/chromium-command-line-switches/).
     */
    args?: string[];

    /**
     * Whether to run browser in headless mode. More details for
     * [Chromium](https://developers.google.com/web/updates/2017/04/headless-chrome) and
     * [Firefox](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Headless_mode). Defaults to `true` unless the
     * `devtools` option is `true`.
     */
    headless?: boolean;

}

export interface BrowserEngineInterface {
    newContext?: CallableFunction;
    createIncognitoBrowserContext?: CallableFunction;
}

export interface BrowserChemicalXInterface<
    BrowserClassEngine extends BrowserEngineInterface,
    ContextClassEngine extends ContextEngineInterface,
> {

    $browserInstance: BrowserClassEngine;
    newContext(
        options?: ContextOptionsLibraryInterface
    ): Promise<ContextChemicalXInterface<ContextClassEngine> & ContextClassEngine>;
    setUp(): Promise<
        this
    >;

}

export type BrowserChemicalXConstructorTypo<
    BrowserTypeEngine,
    BrowserClassEngine extends BrowserEngineInterface,
    ContextClassEngine extends ContextEngineInterface,
    PageClassEngine extends PageEngineInterface,
> = new (
    $browserEngine: BrowserTypeEngine,
    $browserClass: BrowserChemicalXConstructorTypo<
        BrowserTypeEngine, BrowserClassEngine, ContextClassEngine, PageClassEngine
    >,
    $contextClass: ContextChemicalXConstructorTypo<
        BrowserTypeEngine, BrowserClassEngine, ContextClassEngine, PageClassEngine
    >,
    $pageClass: PageChemicalXConstructorTypo<
        BrowserTypeEngine, BrowserClassEngine, ContextClassEngine, PageClassEngine
    >,
) => BrowserChemicalXInterface<BrowserClassEngine, ContextClassEngine>;
