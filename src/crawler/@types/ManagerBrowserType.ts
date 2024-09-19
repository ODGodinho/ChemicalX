import {
    type BrowserChemicalXInterface, type BrowserEngineInterface,
    type ContextChemicalXInterface, type ContextEngineInterface,
    type PageChemicalXInterface, type PageEngineInterface,
} from "..";

export type CreatePageFactoryType<
    ContextEngineType extends ContextChemicalXInterface<ContextEngineInterface>,
    PageEngineType extends PageEngineInterface,
> = (
    context: ContextEngineType,
    page: PageEngineType
) => PageChemicalXInterface<PageEngineType>;

export type CreateContextFactoryType<
    ContextEngineType extends ContextEngineInterface,
    PageEngineType extends PageEngineInterface,
> = (
    context: ContextEngineType,
    newPage: CreatePageFactoryType<ContextChemicalXInterface<ContextEngineType>, PageEngineType>
) => ContextChemicalXInterface<ContextEngineType>;

export type CreateBrowserFactoryType<
    BrowserEngineType extends BrowserEngineInterface,
    ContextEngineType extends ContextEngineInterface,
    PageEngineType extends PageEngineInterface,
> = (
    browser: BrowserEngineType,
    newContext: CreateContextFactoryType<ContextEngineType, PageEngineType>,
    newPage: CreatePageFactoryType<ContextChemicalXInterface<ContextEngineType>, PageEngineType>
) => BrowserChemicalXInterface<BrowserEngineType, ContextEngineType>;
