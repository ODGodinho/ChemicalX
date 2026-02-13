import {
    BaseHandler,
    RetryAction,
    type HandlerFunction,
    type HandlerSolutionType,
} from "src";

import type { PageClassEngine } from "../../playwright/engine";

export class WithoutFunctionHandler extends BaseHandler<PageClassEngine> {

    public $$s = {};

    public async waitForHandler(): Promise<HandlerFunction> {
        return this.testSolution.bind(this);
    }

    public async testSolution(): Promise<HandlerSolutionType> {
        return RetryAction.Resolve;
    }

    public async attempt(): Promise<number> {
        return 0;
    }

}
