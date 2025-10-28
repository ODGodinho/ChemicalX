import { Exception, UnknownException } from "@odg/exception";

import { RetryAction } from "@enums";
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

    public currentAttempt: number = 0;

    public constructor(
        public readonly page: PageEngineType,
        public readonly $$s: SelectorBaseType,
    ) {
    }

    /**
     * Called if the handler completes successfully.
     *
     * @memberof BaseHandler
     * @returns {Promise<void>}
     */
    public success?(): Promise<void>;

    /**
     * Called when the handler finishes, regardless of success or failure.
     *
     * @memberof BaseHandler
     * @param {Exception} exception The exception if the handler failed.
     * @returns {Promise<void>}
     */
    public finish?(exception?: Exception): Promise<void>;

    /**
     * Called after each failed attempt.
     *
     * Return a `RetryAction` to control the retry behavior.
     *
     * @param {Exception} exception Exception
     * @param {number} attempt The current attempt number.
     * @returns {Promise<RetryAction>} The action to take before the next retry.
     */
    public retrying?(exception: Exception, attempt: number): Promise<RetryAction>;

    /**
     * Called when all attempts have failed.
     *
     * Use this to handle final failure logic.
     * You should re-throw the exception if you want to propagate the error.
     *
     * @param {Exception} exception The final exception after all retries.
     * @returns {Promise<void>}
     */
    public failure?(exception: Exception): Promise<void>;

    /**
     * The time in milliseconds to wait before the next retry attempt.
     *
     * @abstract
     * @memberof BaseHandler
     * @returns {Promise<number>}
     */
    public sleep?(): Promise<number>;

    /**
     * Executes the handler with retry, failure, and finish logic.
     *
     * @returns {Promise<void>}
     */
    public async execute(): Promise<void> {
        try {
            const handlerSolution = await this.executeHandlerFunction();

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
     * A convenience method to return a success solution.
     *
     * @returns {Promise<HandlerSolutionType>}
     */
    public async successSolution(): Promise<HandlerSolutionType> {
        return RetryAction.Resolve;
    }

    private async executeHandlerFunction(): Promise<HandlerSolutionType | undefined> {
        const handlerSolution = await retry({
            callback: async () => {
                ++this.currentAttempt;
                const waitHandler = await this.waitForHandler();
                if (waitHandler instanceof Exception) {
                    return waitHandler;
                }

                return waitHandler.call(this);
            },
            times: await this.attempt(),
            sleep: await this.sleep?.(),
            when: this.retrying?.bind(this),
        });

        if (handlerSolution === RetryAction.Retry) {
            return this.executeHandlerFunction();
        }

        return handlerSolution;
    }

    /**
     * Waits for and returns the handler function to be executed.
     *
     * @abstract
     * @memberof BaseHandler
     * @returns {Promise<HandlerFunction>}
     */
    public abstract waitForHandler(): Promise<HandlerFunction>;

    /**
     * The total number of attempts to execute the handler.
     *
     * @abstract
     * @memberof BaseHandler
     * @returns {Promise<number>}
     */
    public abstract attempt(): Promise<number>;

}
