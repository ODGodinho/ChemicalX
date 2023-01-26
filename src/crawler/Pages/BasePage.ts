import { type Exception, UnknownException } from "@odg/exception";

import { type RetryAction, retry } from "../..";
import { type FunctionReturnType } from "../../types/FunctionType";
import { type PromiseOrSyncType } from "../../types/PromiseSyncType";
import { type PageInterface, type PageEngineInterface } from "../index";
import { type SelectorType } from "../Selectors/SelectorsTypo";

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

    public failedAttempt?(exception: Exception, attempt: number): Promise<RetryAction>;

    public failedPage?(exception: Exception): Promise<void>;

    /**
     * Execute step With retry fail and finish
     *
     * @memberof BasePage
     * @param {FunctionReturnType<PromiseOrSyncType<void>>} callback Start Step CallbackFunction
     * @returns {Promise<void>}
     */
    protected async start(callback: FunctionReturnType<PromiseOrSyncType<void>>): Promise<void> {
        return retry(
            {
                times: await this.attempt() - 1,
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
     * @abstract
     * @type {SelectorType}
     * @memberof BasePage
     */
    public abstract readonly $s: SelectorType;

    public abstract execute(): Promise<void>;

    public abstract attempt(): Promise<number>;

}
