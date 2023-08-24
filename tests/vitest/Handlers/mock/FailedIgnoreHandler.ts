import { Exception } from "@odg/exception";

import {
    BaseHandler, type HandlerFunction, type PageEngineInterface,
} from "../../../../src";
import { type PageClassEngine } from "../../playwright/engine";

export class FailedIgnoreHandler extends BaseHandler<unknown, PageClassEngine & PageEngineInterface> {

    public async waitForHandler(): Promise<HandlerFunction> {
        throw new Exception("This exception failedHandler ignore");
    }

    public async attempt(): Promise<number> {
        return 0;
    }

    public async failedHandler(): Promise<void> {
        // Only ignore exception
    }

}
