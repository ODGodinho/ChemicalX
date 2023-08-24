import { type Exception } from "@odg/exception";

import { type PromiseOrSyncType } from "#types/PromiseSyncType";
import { type RetryAction } from "@enums";

/**
 * Retry options
 *
 * @interface RetryOptionsInterface
 * @template {any} ReturnType Function callback return
 * @template ReturnType
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
     * Sleep Time in milliseconds before retry
     *
     * @type {number}
     * @memberof RetryOptionsInterface
     */
    sleep?: number;

    /**
     * Function to retry
     *
     * @memberof RetryOptionsInterface
     */
    callback(attempt: number): PromiseOrSyncType<ReturnType>;

}

export interface RetryWhenDefaultInterface {
    when?(
        exception: Exception,
        times: number
    ): PromiseOrSyncType<RetryAction.Default | RetryAction.Retry | RetryAction.Throw>;
}

export interface RetryWhenResolveInterface {
    when?(
        exception: Exception,
        times: number
    ): PromiseOrSyncType<RetryAction.Default | RetryAction.Resolve | RetryAction.Retry | RetryAction.Throw>;
}
