import { Exception } from "@odg/exception";

import {
    BaseHandler,
    type HandlerFunction,
} from "src";

import type { PageClassEngine } from "../../playwright/engine";

export class FailedIgnoreHandler extends BaseHandler<PageClassEngine> {

    public $$s = {};

    public async waitForHandler(): Promise<HandlerFunction> {
        throw new Exception("This exception failure ignore");
    }

    public async attempt(): Promise<number> {
        return 0;
    }

    public async failure(): Promise<void> {
        // Only ignore exception
    }

}
