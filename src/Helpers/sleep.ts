import type { Abortable } from "node:events";

/**
 * Sleep async function
 *
 * @param {number} milliseconds sleep time in milliseconds
 * @param {Abortable | undefined} options sleep abortable options
 * @returns {Promise<void>}
 */
export async function sleep(milliseconds: number, options?: Abortable): Promise<void> {
    return new Promise((resolve) => {
        if (options?.signal?.aborted) {
            resolve();

            return;
        }

        const timeout = setTimeout(resolve, milliseconds);

        function abortEvent(): void {
            clearTimeout(timeout);
            resolve();
            options?.signal?.removeEventListener("abort", abortEvent);
        }

        options?.signal?.addEventListener("abort", abortEvent);
    });
}
