import { Exception } from "@odg/exception";

import {
    BaseHandler,
    type HandlerFunction,
    RetryAction,
} from "src";

import type { PageClassEngine } from "../../playwright/engine";

export class ExampleWaitHandlerReturnException extends BaseHandler<PageClassEngine> {

    public $$s = {};

    public async waitForHandler(): Promise<HandlerFunction> {
        return new Exception("stop process");
    }

    public async attempt(): Promise<number> {
        return 5;
    }

    public async retrying(_exception: Exception, _times: number): Promise<RetryAction> {
        return RetryAction.Default;
    }

}
