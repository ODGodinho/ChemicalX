import { Exception, UnknownException } from "@odg/exception";

import { type FunctionParameterType } from "../types/FunctionType";

import { sleep } from ".";

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
 * Retry options
 *
 * @template {any} ReturnType Function callback return
 * @interface RetryOptionsInterface
 * @template ReturnType
 */
interface RetryOptionsInterface<ReturnType> {

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
     * @type {FunctionParameterType<Promise<ReturnType> | ReturnType, number>}
     * @memberof RetryOptionsInterface
     */
    callback: FunctionParameterType<Promise<ReturnType> | ReturnType, number>;

    /**
     * Validate what must be done before trying again
     *
     * @memberof RetryOptionsInterface
     */
    when?(exception: Exception, times: number): Promise<RetryAction> | RetryAction;
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
        return await options.callback(options.attempt);
    } catch (exception: unknown) {
        const exceptionParse = Exception.parse(exception) ?? new UnknownException("Retry unknown Exception", exception);
        const when = await options.when?.(exceptionParse, options.attempt);
        if (when === RetryAction.Resolve) {
            return;
        }

        if ((options.times < 1 || when === RetryAction.Throw) && when !== RetryAction.Retry) {
            throw exceptionParse;
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
