export interface PageOptionsLibraryInterface {

}

export interface PageChemicalXInterface<PageEngineType extends PageEngineInterface> {
    $pageInstance: PageEngineType;
}

export interface PageEngineInterface {
    goto: CallableFunction;
}
