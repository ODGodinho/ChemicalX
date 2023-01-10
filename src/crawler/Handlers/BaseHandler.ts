import { type Exception, UnknownException } from "@odg/exception";

import { type PageEngineInterface } from "..";
import { RetryAction, retry } from "../..";
import { HandlerSolution, type HandlerFunction, type HandlerInterface } from "../Interfaces/HandlerInterface";

export abstract class BaseHandler<
    SelectorBaseType,
    PageClassEngine extends PageEngineInterface,
> implements HandlerInterface {

    public constructor(
        public readonly page: PageClassEngine,
        public readonly $$s: SelectorBaseType,
    ) {
    }

    /**
     * Called if Handler end with success
     *
     * @returns {Promise<void>}
     * @memberof BaseHandler
     */
    public success?(): Promise<void>;

    /**
     * Called if Handler end with fail or success
     *
     * @param {Exception} exception Exception if finish with error
     * @returns {Promise<void>}
     * @memberof BaseHandler
     */
    public finish?(exception?: Exception): Promise<void>;

    /**
     * Execute step With retry fail and finish
     *
     * @memberof BasePage
     * @template {any} ReturnType Return Type function
     * @returns {Promise<ReturnType>}
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
     * @protected
     * @param {Exception} _exception Exception error
     * @returns {Promise<RetryAction>}
     * @memberof BaseHandler
     */
    public async failedWait(_exception: Exception): Promise<RetryAction> {
        return RetryAction.Default;
    }

    /**
     * Called if handler execute is failed
     * Add the throw at the end otherwise the handler will not transmit your exception
     *
     * @protected
     * @param {Exception} exception Exception error
     * @returns {Promise<void>}
     * @memberof BaseHandler
     */
    protected async failedHandler(exception: Exception): Promise<void> {
        throw exception;
    }

    /**
     * Wait for handler with Attempt and retry
     *
     * @protected
     * @returns {Promise<HandlerSolution | undefined>}
     * @memberof BaseHandler
     */
    protected async waitHandlerAttempt(): Promise<HandlerSolution | undefined> {
        const handler = await retry({
            callback: this.waitForHandler.bind(this),
            times: await this.attempt(),
            when: this.failedWait.bind(this),
        });

        return handler?.call(this);
    }

    /**
     * Possibility to wait for a handler
     *
     * @abstract
     * @returns {Promise<HandlerFunction>}
     * @memberof BaseHandler
     */
    public abstract waitForHandler(): Promise<HandlerFunction>;

    /**
     * Number of Attempt to waitForHandler
     *
     * @abstract
     * @returns {Promise<number>}
     * @memberof BaseHandler
     */
    public abstract attempt(): Promise<number>;

}
