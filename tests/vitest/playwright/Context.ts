import { Context as ContextBase, type ContextOptionsLibraryInterface } from "../../../src/crawler";

import {
    type ContextClassEngine,
    type PageClassEngine,
} from "./engine";

export class Context extends ContextBase<
    ContextClassEngine,
    PageClassEngine
> {

    public async defaultPageOptions(): Promise<ContextOptionsLibraryInterface> {
        return {
            ...await super.defaultPageOptions(),
        };
    }

}
