export interface ContextOptionsLibraryInterface {

}

export interface ContextEngineInterface {
    newPage: CallableFunction;
    pages: CallableFunction;
}

export interface ContextChemicalXInterface<ContextClassEngine extends ContextEngineInterface> {
    $contextInstance: ContextClassEngine;
    newPage: CallableFunction;
}
