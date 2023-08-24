import { type Exception } from "@odg/exception";

import { type RetryAction } from "@enums";

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

export interface HandlerInterface {

    /**
     * Execute step
     *
     * @memberof HandlerInterface
     * @returns {Promise<HandlerFunction>}
     */
    waitForHandler(): Promise<HandlerFunction>;

    /**
     * Execute Handler
     *
     * @memberof HandlerInterface
     * @returns {Promise<void>}
     */
    execute(): Promise<void>;

    /**
     * Handler Execute Failed
     *
     * @memberof HandlerInterface
     * @param {Exception} exception Exception
     * @param {Exception} attempt Current Attempt
     * @returns {Promise<RetryAction>}
     */
    failedAttempt(exception: Exception, attempt: number): Promise<RetryAction>;

    /**
     * If the page is finished with success or failure
     *
     * @memberof HandlerInterface
     * @param {Exception} exception Exception If it ends with failure
     * @returns {Promise<number>}
     */
    finish?(exception?: Exception): Promise<void>;

    /**
     * Action to do when the handler is success
     *
     * @returns {Promise<void>}
     */
    success?(): Promise<void>;

    /**
     * Number of attempt to execute the page
     *
     * @memberof HandlerInterface
     * @returns {Promise<number>}
     */
    attempt(): Promise<number>;

}
