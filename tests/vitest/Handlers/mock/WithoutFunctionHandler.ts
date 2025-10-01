import {
    BaseHandler,
    RetryAction,
    type HandlerFunction,
    type PageEngineInterface,
} from "../../../../src";
import { type PageClassEngine } from "../../playwright/engine";

export class WithoutFunctionHandler extends BaseHandler<unknown, PageClassEngine & PageEngineInterface> {

    public async waitForHandler(): Promise<HandlerFunction> {
        return this.testSolution.bind(this);
    }

    public async testSolution(): Promise<RetryAction.Resolve> {
        return RetryAction.Resolve;
    }

    public async attempt(): Promise<number> {
        return 0;
    }

}
