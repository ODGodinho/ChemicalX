import { type Exception, UnknownException } from "@odg/exception";

import { RetryAction } from "@enums";
import { retry } from "@helpers";
import {
    HandlerSolution,
    type HandlerFunction,
    type HandlerInterface,
} from "@interfaces";

import { type PageEngineInterface } from "../@types";

export abstract class BaseHandler<
    SelectorBaseType,
    PageEngineType extends PageEngineInterface,
> implements HandlerInterface {

    public constructor(
        public readonly page: PageEngineType,
        public readonly $$s: SelectorBaseType,
    ) {
    }

    /**
     * Called if Handler end with success
     *
     * @memberof BaseHandler
     * @returns {Promise<void>}
     */
    public success?(): Promise<void>;

    /**
     * Called if Handler end with fail or success
     *
     * @memberof BaseHandler
     * @param {Exception} exception Exception if finish with error
     * @returns {Promise<void>}
     */
    public finish?(exception?: Exception): Promise<void>;

    /**
     * Execute step With retry fail and finish
     *
     * @returns {Promise<void>}
     */
    public async execute(): Promise<void> {
        try {
            const handlerCallback = await this.waitHandlerAttempt();

            if (handlerCallback === HandlerSolution.Retry) {
                await this.execute();

                return;
            }

            await this.finish?.();
            await this.success?.();
        } catch (error) {
            const exception = UnknownException.parseOrDefault(error, "Handler UnknownException");

            await this.finish?.(exception);
            await this.failedHandler(exception);
        }
    }

    /**
     * Use if you handler identify a successful response
     *
     * @returns {Promise<HandlerSolution>}
     */
    public async successSolution(): Promise<HandlerSolution> {
        return HandlerSolution.Resolve;
    }

    /**
     * Called Always handler attempt error.
     *
     * @param {Exception} _exception Exception error
     * @param {number} _attempt Tentativa Atual
     * @returns {Promise<RetryAction>}
     */
    public async failedAttempt(_exception: Exception, _attempt: number): Promise<RetryAction> {
        return RetryAction.Default;
    }

    /**
     * Called if handler execute is failed
     * Add the throw at the end otherwise the handler will not transmit your exception
     *
     * @memberof BaseHandler
     * @protected
     * @param {Exception} exception Exception error
     * @returns {Promise<void>}
     */
    protected async failedHandler(exception: Exception): Promise<void> {
        throw exception;
    }

    /**
     * Wait for handler with Attempt and retry
     *
     * @memberof BaseHandler
     * @protected
     * @returns {Promise<HandlerSolution | undefined>}
     */
    protected async waitHandlerAttempt(): Promise<HandlerSolution | undefined> {
        const handler = await retry({
            callback: this.waitForHandler.bind(this),
            times: await this.attempt(),
            when: this.failedAttempt.bind(this),
        });

        return handler?.call(this);
    }

    /**
     * Possibility to wait for a handler
     *
     * @abstract
     * @memberof BaseHandler
     * @returns {Promise<HandlerFunction>}
     */
    public abstract waitForHandler(): Promise<HandlerFunction>;

    /**
     * Number of Attempt to waitForHandler
     *
     * @abstract
     * @memberof BaseHandler
     * @returns {Promise<number>}
     */
    public abstract attempt(): Promise<number>;

}
