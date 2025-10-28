import { type Exception } from "@odg/exception";

import { type RetryAction } from "@enums";

import { type AttemptableInterface } from "../../Interfaces/AttemptableFlow";

/**
 * Defines the possible outcomes for a handler's execution, guiding the retry mechanism.
 *
 * ```
 * - `RetryAction.Retry`: When returned by a handler function, it forces a re-run of the entire
 *   handler execution from the beginning. This action *does not* trigger the handler's `retrying`
 *   method. resetting the attempt count and starting all over again
 *
 * - `RetryAction.Resolve`: When returned by a handler function, it signals that the handler has
 *   successfully completed its task, and no further retries or error handling are needed for this
 *   specific execution.
 *
 * - `Exception Instance`: When returned by a handler function, it indicates that an error has occurred,
 *   causing the immediate interruption of the execution with the provided exception. This bypasses
 *   any further retries for the current handler execution cycle.
 * ```
 */
export type HandlerSolutionType = Exception | Exclude<RetryAction, RetryAction.Default | RetryAction.Throw>;

/**
 * When an `Exception` *thrown* during a handler's execution,
 * it will trigger the standard retry mechanism.
 *
 * `RetryAction.Throw` is explicitly excluded from `HandlerSolutionType` because
 * returning it directly from a handler function has no specific effect in this context.
 */
export type HandlerFunction = Exception | (() => Promise<HandlerSolutionType>);

export interface HandlerInterface extends AttemptableInterface {

    /**
     * Execute step
     * Waits for and returns the handler function to be executed.
     *
     * This method allows for preliminary checks or setup before returning the core
     * logic of the handler, which will then be executed by the `BaseHandler`.
     *
     * @memberof HandlerInterface
     * @returns {Promise<HandlerFunction>}
     */
    waitForHandler(): Promise<HandlerFunction>;

}
