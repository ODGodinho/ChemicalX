import { UnknownException } from "@odg/exception";

import { RetryAction } from "@enums";
import { RetryException } from "@exceptions/RetryException";
import {
    type RetryOptionsInterface,
    type RetryWhenDefaultInterface,
    type RetryWhenResolveInterface,
} from "@interfaces";

import { sleep } from ".";

async function getWhen(
    exception: unknown,
    options: RetryOptionsInterface<unknown> & RetryWhenResolveInterface & { attempt: number },
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
 * @param {RetryOptionsInterface<ReturnType> & { attempt: number }} options Options Retry
 * @returns {Promise<ReturnType | undefined>}
 */
async function retryHelper<ReturnType>(
    options: RetryOptionsInterface<ReturnType> & { attempt: number },
): Promise<ReturnType | undefined> {
    if (typeof options.times !== "number" || Number.isNaN(options.times)) {
        throw new RetryException("Attempt is not a number");
    }

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

export async function retry<ReturnType>(
    options: RetryOptionsInterface<ReturnType> & RetryWhenDefaultInterface,
): Promise<ReturnType>;

export async function retry<ReturnType>(
    options: RetryOptionsInterface<ReturnType> & RetryWhenResolveInterface
): Promise<ReturnType | undefined>;

export async function retry<ReturnType>(
    options: RetryOptionsInterface<ReturnType>,
): Promise<ReturnType | undefined> {
    return retryHelper({
        ...options,
        attempt: 0,
    });
}
