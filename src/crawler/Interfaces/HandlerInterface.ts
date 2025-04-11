import { type Exception } from "@odg/exception";

import { type RetryAction } from "@enums";

import { type AttemptableInterface } from "../../Interfaces/AttemptableFlow";

export type HandlerFunction = () => Promise<HandlerSolution>;

/**
 * State Handler Function
 *
 * Resolve - To Resolve Handler
 * Retry - To Execute Handler retry
 *
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
     * @deprecated use execute Function
     * @memberof HandlerInterface
     * @returns {Promise<HandlerFunction>}
     */
    waitForHandler(): Promise<HandlerFunction>;

    /**
     * Executed whenever the handler fails
     *
     * @deprecated use retrying
     * @memberof HandlerInterface
     * @param {Exception} exception Exception
     * @param {Exception} attempt Current Attempt
     * @returns {Promise<RetryAction>}
     */
    failedAttempt?(exception: Exception, attempt: number): Promise<RetryAction>;

    /**
     * Executed only on the last failed attempt
     * Add the throw at the end otherwise the page will not transmit your exception
     *
     * @deprecated use failure
     * @memberof HandlerInterface
     * @param {Exception} exception Exception
     * @returns {Promise<void>}
     */
    failedHandler?(exception: Exception): Promise<void>;

}
