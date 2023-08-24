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
