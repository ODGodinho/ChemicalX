import { type RetryAction } from "@enums";

import { type AttemptableInterface } from "../../Interfaces/AttemptableFlow";

export type HandlerSolutionType = Exclude<RetryAction, RetryAction.Throw>;

export type HandlerFunction = () => Promise<HandlerSolution | HandlerSolutionType>;

/**
 * State Handler Function
 *
 * Resolve - To Resolve Handler
 * Retry - To Execute Handler retry
 *
 * @deprecated Use RetryAction enum and HandlerSolutionType type instead
 * @enum {string}
 */
export enum HandlerSolution {
    Resolve = "Resolve",
    Retry = "Retry",
}

export interface HandlerInterface extends AttemptableInterface {

    /**
     * Execute step
     *
     * @memberof HandlerInterface
     * @returns {Promise<HandlerFunction>}
     */
    waitForHandler(): Promise<HandlerFunction>;

}
