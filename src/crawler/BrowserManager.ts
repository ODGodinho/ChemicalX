import type {
    BrowserChemicalXInterface,
    BrowserEngineInterface,
    ContextChemicalXInterface,
    ContextEngineInterface,
    CreateBrowserFactoryType,
    CreateContextFactoryType,
    CreatePageFactoryType,
    PageEngineInterface,
} from "..";

export class BrowserManager<
    BrowserClassEngine extends BrowserEngineInterface,
    ContextClassEngine extends ContextEngineInterface,
    PageClassEngine extends PageEngineInterface,
> {

    public constructor(
        private readonly $newBrowser: CreateBrowserFactoryType<BrowserClassEngine, ContextClassEngine, PageClassEngine>,
        private readonly $newContext: CreateContextFactoryType<ContextClassEngine, PageClassEngine>,
        private readonly $newPage: CreatePageFactoryType<
            ContextChemicalXInterface<ContextClassEngine>,
            PageClassEngine
        >,
    ) {
    }

    public async newBrowser(
        browser: () => Promise<BrowserClassEngine>,
    ): Promise<BrowserChemicalXInterface<BrowserClassEngine, ContextClassEngine> & BrowserClassEngine> {
        return this.$newBrowser(await browser(), this.$newContext, this.$newPage) as BrowserChemicalXInterface<
            BrowserClassEngine,
            ContextClassEngine
        > & BrowserClassEngine;
    }

    public async newPersistentContext(
        context: () => Promise<ContextClassEngine>,
    ): Promise<ContextChemicalXInterface<ContextClassEngine> & ContextClassEngine> {
        return this.$newContext(await context(), this.$newPage) as ContextChemicalXInterface<
            ContextClassEngine
        > & ContextClassEngine;
    }

}
