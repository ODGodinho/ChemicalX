import { type Exception, UnknownException } from "@odg/exception";

import { type RetryAction } from "@enums";
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
     * Called after each failed attempt.
     *
     * Return a retry action to control retry behavior.
     *
     * @param {Exception} exception Exception
     * @param {number} attempt Current attempt
     * @returns {Promise<RetryAction>}
     */
    public retrying?(exception: Exception, attempt: number): Promise<RetryAction>;

    /**
     * Called when all attempts have failed.
     *
     * Use this to handle final failure logic.
     * You should re-throw the exception if needed.
     *
     * @param {Exception} exception Exception
     * @returns {Promise<void>}
     */
    public failure?(exception: Exception): Promise<void>;

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
            await this.finallyCatch(error);
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
            when: this.retrying?.bind(this),
        });

        return handler?.call(this);
    }

    private async finallyCatch(error: unknown): Promise<void> {
        const exception = UnknownException.parseOrDefault(error, "Handler UnknownException");

        await this.finish?.(exception);
        if (this.failure) await this.failure(exception);
        else throw exception;
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
