import type {
    BrowserChemicalXInterface,
    BrowserEngineInterface,
    ContextChemicalXInterface,
    ContextEngineInterface,
    PageChemicalXInterface,
    PageEngineInterface,
} from "..";

export type CreatePageFactoryType<
    ContextClassEngine extends ContextChemicalXInterface<ContextEngineInterface>,
    PageClassEngine extends PageEngineInterface,
> = (
    context: ContextClassEngine,
    page: PageClassEngine,
) => PageChemicalXInterface<PageClassEngine>;

export type CreateContextFactoryType<
    ContextClassEngine extends ContextEngineInterface,
    PageClassEngine extends PageEngineInterface,
> = (
    context: ContextClassEngine,
    newPage: CreatePageFactoryType<ContextChemicalXInterface<ContextClassEngine>, PageClassEngine>,
) => ContextChemicalXInterface<ContextClassEngine>;

export type CreateBrowserFactoryType<
    BrowserClassEngine extends BrowserEngineInterface,
    ContextClassEngine extends ContextEngineInterface,
    PageClassEngine extends PageEngineInterface,
> = (
    browser: BrowserClassEngine,
    newContext: CreateContextFactoryType<ContextClassEngine, PageClassEngine>,
    newPage: CreatePageFactoryType<ContextChemicalXInterface<ContextClassEngine>, PageClassEngine>,
) => BrowserChemicalXInterface<BrowserClassEngine, ContextClassEngine>;
