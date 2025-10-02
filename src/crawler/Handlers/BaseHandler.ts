import { Exception, UnknownException } from "@odg/exception";

import { RetryAction } from "@enums";
import { RetryException } from "@exceptions/RetryException";
import { retry } from "@helpers";
import {
    type HandlerFunction,
    type HandlerInterface,
    type HandlerSolutionType,
} from "@interfaces";

import { type PageEngineInterface } from "../@types";

export abstract class BaseHandler<
    SelectorBaseType,
    PageEngineType extends PageEngineInterface,
> implements HandlerInterface {

    protected currentAttempt: number = 0;

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
     * Sleep time before retrying milliseconds
     *
     * @abstract
     * @memberof BaseHandler
     * @returns {Promise<number>}
     */
    public sleep?(): Promise<number>;

    /**
     * Execute step With retry fail and finish
     *
     * @returns {Promise<void>}
     */
    public async execute(): Promise<void> {
        try {
            const handlerSolution = await retry({
                callback: async (attempt) => {
                    this.currentAttempt = attempt;
                    const waitHandler = await this.waitForHandler();
                    if (waitHandler instanceof Exception) {
                        return waitHandler;
                    }

                    const handlerSolutionCallback = await waitHandler.call(this);

                    if ([ RetryAction.Default, RetryAction.Retry ].includes(handlerSolutionCallback as RetryAction)) {
                        throw new RetryException(
                            "Force Retry Action Default",
                            undefined,
                            handlerSolutionCallback as RetryAction,
                        );
                    }

                    return handlerSolutionCallback;
                },
                times: await this.attempt(),
                sleep: await this.sleep?.(),
                when: this.retrying?.bind(this),
            });

            if (handlerSolution instanceof Exception) {
                throw handlerSolution;
            }

            await this.finish?.();
            await this.success?.();
        } catch (error: unknown) {
            const exception = UnknownException.parseOrDefault(error, "Handler UnknownException");

            await this.finish?.(exception);
            if (this.failure) await this.failure(exception);
            else throw exception;
        }
    }

    /**
     * Use if you handler identify a successful response
     *
     * @returns {Promise<HandlerSolutionType>}
     */
    public async successSolution(): Promise<HandlerSolutionType> {
        return RetryAction.Resolve;
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
