import { type Exception } from "@odg/exception";

import { type RetryAction } from "../../Helpers/retry";

export interface PageInterface {

    /**
     * Execute step With retry fail and finish
     *
     * @memberof BasePage
     * @returns {Promise<void>}
     */
    execute(): Promise<void>;

    /**
     * Action to do when the page is success
     *
     * @memberof BasePage
     * @returns {Promise<void>}
     */
    success(): Promise<void>;

    /**
     * Action to do when the page failed
     *
     * @memberof BasePage
     * @param {Exception} exception Exception
     * @param {number} attempt Current attempt
     * @returns {Promise<RetryAction>}
     */
    failedAttempt?(exception: Exception, attempt: number): Promise<RetryAction>;

    /**
     * Called if page execute is failed
     * Add the throw at the end otherwise the page will not transmit your exception
     *
     * @memberof BasePage
     * @param {Exception} exception Exception
     * @returns {Promise<void>}
     */
    failedPage?(exception: Exception): Promise<void>;

    /**
     * If the page is finished with success or failure
     *
     * @memberof BasePage
     * @param {Exception} exception Exception If it ends with failure
     * @returns {Promise<number>}
     */
    finish?(exception?: Exception): Promise<void>;

    /**
     * Number of attempt to execute the page
     *
     * @memberof BasePage
     * @returns {Promise<number>}
     */
    attempt(): Promise<number>;

}
