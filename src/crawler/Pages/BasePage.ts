import { type Exception, UnknownException } from "@odg/exception";

import { type PromiseOrSyncType, type FunctionReturnType } from "#types/index";

import { type RetryAction, type PageInterface, retry } from "../..";
import { type PageEngineInterface } from "../index";
import { type SelectorType } from "../Selectors/SelectorsType";

export abstract class BasePage<SelectorBaseType, PageClassEngine extends PageEngineInterface> implements PageInterface {

    /**
     * Current attempt number
     *
     * @type {number}
     * @memberof BasePage
     */
    protected currentAttempt: number = 0;

    public constructor(
        public readonly page: PageClassEngine,
        public readonly $$s: SelectorBaseType,
    ) {
    }

    /**
     * Pre Start Page
     *
     * @memberof BasePage
     */
    public async preStart(): Promise<void> {
        this.currentAttempt++;
    }

    /**
     * Action to do when the page is success
     *
     * @memberof BasePage
     * @returns {Promise<void>}
     */
    public async success(): Promise<void> {
        this.currentAttempt = 0;
    }

    public finish?(exception?: Exception | undefined): Promise<void>;

    public failure?(exception: Exception): Promise<void>;

    public retrying?(exception: Exception, attempt: number): Promise<RetryAction>;

    /** @deprecated use retrying function */
    public failedAttempt?(exception: Exception, attempt: number): Promise<RetryAction>;

    /** @deprecated use failure function */
    public failedPage?(exception: Exception): Promise<void>;

    /**
     * Execute step With retry fail and finish
     *
     * @deprecated Use @ODGDecorators.attemptableFlow() in class decorators and rename (failedAttempt, failedPage)
     * @memberof BasePage
     * @param {FunctionReturnType<PromiseOrSyncType<void>>} callback Start Step CallbackFunction
     * @returns {Promise<void>}
     */
    protected async start(callback: FunctionReturnType<PromiseOrSyncType<void>>): Promise<void> {
        return retry(
            {
                times: await this.attempt(),
                sleep: 0,
                callback: callback,
                when: this.failedAttempt?.bind(this),
            },
        ).then(async () => {
            await this.finish?.();

            return this.success();
        }).catch(this.executeCatcher.bind(this));
    }

    private async executeCatcher(exception: unknown): Promise<void> {
        const exceptionParsed = UnknownException.parseOrDefault(exception, "Page UnknownException");
        await this.finish?.(exceptionParsed);

        if (this.failedPage) await this.failedPage(exceptionParsed);
        else throw exceptionParsed;
    }

    /**
     * Selector of this page
     *
     * @type {SelectorType}
     * @memberof BasePage
     */
    // eslint-disable-next-line sort-class-members/sort-class-members
    public abstract readonly $s: SelectorType;

    public abstract execute(): Promise<void>;

    public abstract attempt(): Promise<number>;

}
