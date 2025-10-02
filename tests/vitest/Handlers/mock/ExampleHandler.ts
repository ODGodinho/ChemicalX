import {
    BaseHandler,
    RetryAction,
    type HandlerFunction,
    type HandlerSolutionType,
    type PageEngineInterface,
} from "../../../../src";
import { type PageClassEngine } from "../../playwright/engine";

export class ExampleHandler extends BaseHandler<unknown, PageClassEngine & PageEngineInterface> {

    public async waitForHandler(): Promise<HandlerFunction> {
        return this.testSolution.bind(this);
    }

    public async testSolution(): Promise<HandlerSolutionType> {
        return RetryAction.Resolve;
    }

    public async attempt(): Promise<number> {
        return 0;
    }

    public async success(): Promise<void> {
        // Only for test
    }

    public async finish(): Promise<void> {
        // Only for test
    }

}
