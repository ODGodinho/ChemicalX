export type ContextOptionsLibraryInterface = object;

export interface ContextEngineInterface {
    newPage: CallableFunction;
    pages: CallableFunction;
}

export interface ContextChemicalXInterface<ContextClassEngine extends ContextEngineInterface> {
    $contextInstance: ContextClassEngine;
    newPage: CallableFunction;
}
