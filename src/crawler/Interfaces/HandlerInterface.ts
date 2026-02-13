import type { Exception } from "@odg/exception";

import type { RetryAction } from "@enums";

import type { AttemptableInterface } from "../../Interfaces/AttemptableFlow";

/**
 * Represents the possible return types from a handler function's execution.
 *
 * This type union defines the allowed outcomes that can be returned by a handler,
 * which guide the retry mechanism and control flow of the handler execution cycle.
 *
 * Handler functions can return the following values:
 *
 * - **`Exception`**: When an `Exception` instance is returned (not thrown), it indicates
 * that an error occurred and the process must be interrupted. No further retries will be
 * performed, and the handler will terminate with the returned error. This has the same
 * utility as `RetryAction.Throw`, but `RetryAction.Throw` cannot be used in this context
 * because no error has occurred yet - the return itself indicates the error condition.
 *
 * - **`RetryAction.Retry`**: Forces a retry by restarting the entire handler execution from
 * the beginning. When this action is returned, the attempt counter is reset, so if you
 * configured 3 attempts and return `RetryAction.Retry`, it will start counting the 3 attempts
 * from zero again. Additionally, this action does *not* call the `retrying` method, which is
 * normally called on all retry attempts. **Warning**: This is discouraged as improper use can
 * lead to infinite loops.
 *
 * - **`RetryAction.Resolve`**: Indicates that the handler completed successfully. The expected
 * condition was met, and the code can proceed to the next step of the robot workflow.
 *
 * The following `RetryAction` values are explicitly **not supported** and are excluded
 * from this type:
 *
 * - **`RetryAction.Throw`**: Not supported in Handler Solutions. Use returning an `Exception`
 * instance instead when you need to signal an error condition.
 *
 * - **`RetryAction.Default`**: Not supported in Handler Solutions. To simulate retry behavior
 * when an error condition is detected, throw an exception instead (e.g., `throw new Exception("Page did not load")`).
 * This will attempt the number of times configured in the `attempt` method. If all attempts
 * fail and the same condition occurs again, it will terminate with that error or any other
 * error that may have occurred.
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
