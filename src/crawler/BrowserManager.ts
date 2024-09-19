import {
    type BrowserChemicalXInterface,
    type BrowserEngineInterface,
    type ContextChemicalXInterface,
    type ContextEngineInterface,
    type CreateBrowserFactoryType,
    type CreateContextFactoryType,
    type CreatePageFactoryType,
    type PageEngineInterface,
} from "..";

export class BrowserManager<
    BrowserEngineType extends BrowserEngineInterface,
    ContextEngineType extends ContextEngineInterface,
    PageEngineType extends PageEngineInterface,
> {

    public constructor(
        private readonly $newBrowser: CreateBrowserFactoryType<BrowserEngineType, ContextEngineType, PageEngineType>,
        private readonly $newContext: CreateContextFactoryType<ContextEngineType, PageEngineType>,
        private readonly $newPage: CreatePageFactoryType<ContextChemicalXInterface<ContextEngineType>, PageEngineType>,
    ) {
    }

    public async newBrowser(
        browser: () => Promise<BrowserEngineType>,
    ): Promise<BrowserChemicalXInterface<BrowserEngineType, ContextEngineType> & BrowserEngineType> {
        return this.$newBrowser(await browser(), this.$newContext, this.$newPage) as BrowserChemicalXInterface<
            BrowserEngineType, ContextEngineType
        > & BrowserEngineType;
    }

    public async newPersistentContext(
        context: () => Promise<ContextEngineType>,
    ): Promise<ContextChemicalXInterface<ContextEngineType> & ContextEngineType> {
        return this.$newContext(await context(), this.$newPage) as ContextChemicalXInterface<
            ContextEngineType
        > & ContextEngineType;
    }

}
