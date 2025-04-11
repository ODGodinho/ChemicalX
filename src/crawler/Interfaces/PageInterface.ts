import { type Exception } from "@odg/exception";

import { type RetryAction } from "@enums";
import { type AttemptableInterface } from "@interfaces";

export interface PageInterface extends AttemptableInterface {

    /**
     * Action to do when the page failed
     *
     * @deprecated use retrying and @ODGDecorators.attemptableFlow
     * @param {Exception} exception Exception
     * @param {number} attempt Current attempt
     * @returns {Promise<RetryAction>}
     */
    failedAttempt?(exception: Exception, attempt: number): Promise<RetryAction>;

    /**
     * Called if page execute is failed on the last attempt
     * Add the throw at the end otherwise the page will not transmit your exception
     *
     * @deprecated use failure and @ODGDecorators.attemptableFlow
     * @param {Exception} exception Exception
     * @returns {Promise<void>}
     */
    failedPage?(exception: Exception): Promise<void>;
}
