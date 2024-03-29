import {
    type ContextEngineInterface,
    type ContextOptionsLibraryInterface,
    type ContextChemicalXInterface,
} from "./Context";

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
    createBrowserContext?: CallableFunction;
}

export interface BrowserChemicalXInterface<
    BrowserClassEngine extends BrowserEngineInterface,
    ContextClassEngine extends ContextEngineInterface,
> {
    $browserInstance: BrowserClassEngine;
    newContext(
        options?: ContextOptionsLibraryInterface
    ): Promise<ContextChemicalXInterface<ContextClassEngine> & ContextClassEngine>;
    defaultContextOptions(): Promise<ContextOptionsLibraryInterface>;
}
