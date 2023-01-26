import { type Exception, UnknownException } from "@odg/exception";

import { type FunctionParameterType } from "../types/FunctionType";
import { type PromiseOrSyncType } from "../types/PromiseSyncType";

import { sleep } from ".";

/**
 * Retry options
 *
 * @template {any} ReturnType Function callback return
 * @interface RetryOptionsInterface
 * @template ReturnType
 */
interface RetryOptionsInterface<ReturnType = RetryAction> {

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
     * @type {FunctionParameterType<PromiseOrSyncType<ReturnType>, number>}
     * @memberof RetryOptionsInterface
     */
    callback: FunctionParameterType<PromiseOrSyncType<ReturnType>, number>;

    /**
     * Validate what must be done before trying again
     *
     * @memberof RetryOptionsInterface
     */
    when?(exception: Exception, times: number): Promise<RetryAction> | RetryAction;
}

async function getWhen(
    exception: unknown,
    options: RetryOptionsInterface<unknown> & { attempt: number },
): Promise<RetryAction.Default | RetryAction.Resolve | RetryAction.Retry | undefined> {
    const exceptionParse = UnknownException.parseOrDefault(exception, "Retry unknown Exception");
    const when = await options.when?.(exceptionParse, options.attempt);
    const ignore = [ RetryAction.Retry, RetryAction.Resolve ];
    if (when === RetryAction.Throw) throw exceptionParse;

    if (options.times <= 1 && !ignore.includes(when!)) {
        throw exceptionParse;
    }

    return when;
}

/**
 * Retry Function recursive
 *
 * @template {any} ReturnType
 * @param {RetryOptionsInterface & { attempt: number }} options Options Retry
 * @returns {Promise<ReturnType>}
 */
async function retryHelper<ReturnType>(
    options: RetryOptionsInterface<ReturnType> & { attempt: number },
): Promise<ReturnType | undefined> {
    try {
        return await options.callback.call(options.callback, options.attempt);
    } catch (exception: unknown) {
        const when = await getWhen(exception, options);
        if (when === RetryAction.Resolve) {
            return;
        }

        await sleep(options.sleep ?? 0);

        return retryHelper({
            ...options,
            times: options.times - 1,
            attempt: options.attempt + 1,
        });
    }
}

/**
 * Retry Enum return type
 *
 * @enum {string}
 */
export enum RetryAction {

    /**
     * Use this force retry.
     *
     * @memberof RetryAction
     */
    Retry = "Retry",

    /**
     * Use this force retry error.
     *
     * @memberof RetryAction
     */
    Throw = "Throw",

    /**
     * Use this to complete Retry with undefined return
     *
     * @memberof RetryAction
     */
    Resolve = "Resolve",

    /**
     * To follow default behavior
     * `times` is considered
     *
     * @memberof RetryAction
     */
    Default = "Default",
}

/**
 * Retry Function recursive
 *
 * @template {any} ReturnType
 * @param {RetryOptionsInterface} options Options Retry
 * @returns {Promise<ReturnType>}
 */
export async function retry<ReturnType>(
    options: RetryOptionsInterface<ReturnType>,
): Promise<ReturnType | undefined> {
    return retryHelper<ReturnType>({
        ...options,
        attempt: 0,
    });
}
