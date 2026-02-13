import { AbortException } from "@odg/exception";

import { RetryAction } from "@enums";
import { RetryException } from "@exceptions/RetryException";
import type {
    RetryOptionsInterface,
    RetryWhenDefaultInterface,
    RetryWhenResolveInterface,
} from "@interfaces";

import { sleep, throwIf } from ".";

async function getWhen(
    exception: unknown,
    options: RetryOptionsInterface<unknown> & RetryWhenResolveInterface & { attempt: number },
): Promise<Exclude<RetryAction, RetryAction.Throw> | undefined> {
    const exceptionParse = RetryException.parseOrDefault(exception, "Retry Unknown Exception");

    if (exceptionParse instanceof AbortException) throw exceptionParse;

    const when = await options.when?.(exceptionParse, options.attempt);
    const ignore = [ RetryAction.Retry, RetryAction.Resolve ];

    if (when === RetryAction.Throw) throw exceptionParse;

    if (options.signal?.aborted && when !== RetryAction.Resolve) {
        throw new AbortException("Retry Aborted", exceptionParse);
    }

    if (options.times <= 1 && !ignore.includes(when!)) {
        throw exceptionParse;
    }

    return when;
}

/**
 * Retry Function recursive
 *
 * @template {any} ReturnType
 * @param {RetryOptionsInterface<ReturnType> & { attempt: number }} options Retry action all params options
 * @returns {Promise<ReturnType | undefined>}
 */
async function retryHelper<ReturnType>(
    options: RetryOptionsInterface<ReturnType> & { attempt: number },
): Promise<ReturnType | undefined> {
    throwIf(
        typeof options.times !== "number" || Number.isNaN(options.times),
        () => new RetryException("Attempt is not a number"),
    );

    try {
        throwIf(
            !!options.signal?.aborted,
            () => new AbortException(AbortException.parseOrDefault(options.signal?.reason, "Retry Aborted").message),
        );

        return await options.callback(options.attempt, options.signal);
    } catch (exception: unknown) {
        const when = await getWhen(exception, options);

        if (when === RetryAction.Resolve) {
            return;
        }

        await sleep(options.sleep ?? 0, { signal: options.signal });

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
    options: RetryOptionsInterface<ReturnType> & RetryWhenResolveInterface,
): Promise<ReturnType | undefined>;

export async function retry<ReturnType>(
    options: RetryOptionsInterface<ReturnType>,
): Promise<ReturnType | undefined> {
    return retryHelper({
        ...options,
        attempt: 1,
    });
}
