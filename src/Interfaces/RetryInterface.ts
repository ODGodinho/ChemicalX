import { type Exception } from "@odg/exception";

import { type PromiseOrSyncType } from "#types/index";
import { type RetryAction } from "@enums";

/**
 * Defines the options for a retry operation.
 *
 * @interface RetryOptionsInterface
 * @template ReturnType The return type of the callback function.
 */
export interface RetryOptionsInterface<ReturnType = undefined> {

    /**
     * Number of times to retry
     * 0 = No retry
     *
     * @type {number}
     * @memberof RetryOptionsInterface
     */
    times: number;

    /**
     * The delay in milliseconds before the next attempt.
     *
     * @type {number}
     * @memberof RetryOptionsInterface
     */
    sleep?: number;

    /**
     * An AbortSignal to prematurely stop the retry process.
     *
     * @type {AbortSignal}
     * @memberof RetryOptionsInterface
     */
    signal?: AbortSignal;

    /**
     * The function to execute and retry on failure.
     *
     * @memberof RetryOptionsInterface
     */
    callback(

        /**
         * The current attempt number (starts at 1).
         */
        attempt: number,

        /**
         * An AbortSignal that can be used to abort the callback's execution.
         */
        signal?: AbortSignal,
    ): PromiseOrSyncType<ReturnType>;

}

export interface RetryWhenDefaultInterface {

    /**
     * A function that determines the action to take after a failed attempt.
     * This variant is used when the operation can only retry or throw.
     *
     * @param {Exception} exception The exception caught during the attempt.
     * @param {number} times The number of attempts made so far. (starts at 1).
     * @returns {PromiseOrSyncType<RetryAction.Default | RetryAction.Retry | RetryAction.Throw>}
     */
    when?(
        exception: Exception,
        times: number
    ): PromiseOrSyncType<RetryAction.Default | RetryAction.Retry | RetryAction.Throw>;
}

/**
 * Extends the retry options to include a conditional `when` function.
 * This interface is used for retry operations that can also resolve with a value
 * instead of throwing an error.
 *
 * @interface RetryWhenResolveInterface
 */
export interface RetryWhenResolveInterface {

    /**
     * A function that determines the action to take after a failed attempt.
     * This variant allows the operation to be resolved with `undefined`, in addition
     * to retrying or throwing.
     *
     * @param {Exception} exception The exception caught during the attempt.
     * @param {number} times The number of attempts made so far. (starts at 1).
     * @returns {PromiseOrSyncType<RetryAction.Default | RetryAction.Resolve | RetryAction.Retry | RetryAction.Throw>}
     */
    when?(
        exception: Exception,
        times: number
    ): PromiseOrSyncType<RetryAction.Default | RetryAction.Resolve | RetryAction.Retry | RetryAction.Throw>;
}
