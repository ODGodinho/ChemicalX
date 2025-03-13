import { type Exception } from "@odg/exception";

import {
    BaseHandler, type HandlerFunction, HandlerSolution, type PageEngineInterface, RetryAction,
} from "../../../..";
import { type PageClassEngine } from "../../playwright/engine";

export class ExampleFailedAttemptHandler extends BaseHandler<unknown, PageClassEngine & PageEngineInterface> {

    public async waitForHandler(): Promise<HandlerFunction> {
        return this.testSolution.bind(this);
    }

    public async testSolution(): Promise<HandlerSolution> {
        return HandlerSolution.Resolve;
    }

    public async attempt(): Promise<number> {
        return 0;
    }

    public async failedAttempt(_exception: Exception, _times: number): Promise<RetryAction> {
        return RetryAction.Default;
    }

}
