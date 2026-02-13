import type { PromiseOrSyncType } from "#types/index";

/**
 * Retry options
 *
 * @interface TimeoutOptionsInterface
 * @template {any} ReturnType Function callback return
 */
export interface TimeoutOptionsInterface<ReturnType = undefined> {

    /**
     * Name of resource to log
     *
     * @type {string}
     * @memberof TimeoutOptionsInterface
     */
    name?: string;

    /**
     * Sleep Time in milliseconds before retry
     *
     * @type {number}
     * @memberof TimeoutOptionsInterface
     */
    timeout?: number;

    /**
     * Function to retry
     *
     * @memberof TimeoutOptionsInterface
     */
    callback(): PromiseOrSyncType<ReturnType>;

}
