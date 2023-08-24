import { type Exception } from "@odg/exception";

import { type RetryAction } from "@enums";

export interface PageInterface {

    /**
     * Execute step With retry fail and finish
     *
     * @returns {Promise<void>}
     */
    execute(): Promise<void>;

    /**
     * Action to do when the page is success
     *
     * @returns {Promise<void>}
     */
    success(): Promise<void>;

    /**
     * Action to do when the page failed
     *
     * @param {Exception} exception Exception
     * @param {number} attempt Current attempt
     * @returns {Promise<RetryAction>}
     */
    failedAttempt?(exception: Exception, attempt: number): Promise<RetryAction>;

    /**
     * Called if page execute is failed
     * Add the throw at the end otherwise the page will not transmit your exception
     *
     * @param {Exception} exception Exception
     * @returns {Promise<void>}
     */
    failedPage?(exception: Exception): Promise<void>;

    /**
     * If the page is finished with success or failure
     *
     * @param {Exception} exception Exception If it ends with failure
     * @returns {Promise<number>}
     */
    finish?(exception?: Exception): Promise<void>;

    /**
     * Number of attempt to execute the page
     *
     * @returns {Promise<number>}
     */
    attempt(): Promise<number>;

}
