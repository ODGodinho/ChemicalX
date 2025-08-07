import { type Exception } from "@odg/exception";

import { type RetryAction } from "@enums";
import { type RetryOptionsInterface } from "@interfaces";

export interface AttemptableInterface {

    /**
     * Executes the main step of the flow.
     *
     * This is the core method that will be retried if it fails.
     *
     * @returns {Promise<void>}
     */
    execute(
        ...argumentsCallback: Parameters<RetryOptionsInterface["callback"]>
    ): Promise<void>;

    /**
     * Called when the flow finishes successfully.
     *
     * Use this to handle any success logic.
     *
     * @returns {Promise<void>}
     */
    success?(): Promise<void>;

    /**
     * Called after each failed attempt.
     *
     * Return a retry action to control retry behavior.
     *
     * @param {Exception} exception Exception
     * @param {number} attempt Current attempt
     * @returns {Promise<RetryAction>}
     */
    retrying?(exception: Exception, attempt: number): Promise<RetryAction>;

    /**
     * Called when all attempts have failed.
     *
     * Use this to handle final failure logic.
     * You should re-throw the exception if needed.
     *
     * @param {Exception} exception Exception
     * @returns {Promise<void>}
     */
    failure?(exception: Exception): Promise<void>;

    /**
     * Called when the flow ends, whether successful or failed.
     *
     * Use this to clean up resources or log results.
     *
     * @param {Exception} exception Exception If it ends with failure
     * @returns {Promise<number>}
     */
    finish?(exception?: Exception): Promise<void>;

    /**
     * Returns the total number of allowed attempts.
     *
     * @returns {Promise<number>}
     */
    attempt(): Promise<number>;

    /**
     * Sleep time before retrying milliseconds
     *
     * @returns {Promise<number>}
     */
    sleep?(): Promise<number>;

}
