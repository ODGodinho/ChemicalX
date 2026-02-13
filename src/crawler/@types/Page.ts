export type PageOptionsLibraryInterface = object;

export interface PageChemicalXInterface<PageClassEngine extends PageEngineInterface> {
    $pageInstance: PageClassEngine;
}

export interface PageEngineInterface {
    goto: CallableFunction;
}
