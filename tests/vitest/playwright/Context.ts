import { Context as ContextBase, type ContextOptionsLibraryInterface } from "../../../src/crawler";

import {
    type MyContext,
    type MyPage,
} from "./engine";

export class Context extends ContextBase<
    MyContext,
    MyPage
> {

    public async defaultPageOptions(): Promise<ContextOptionsLibraryInterface> {
        return {
            ...await super.defaultPageOptions(),
        };
    }

}
