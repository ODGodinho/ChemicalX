import type { Exception } from "@odg/exception";

import type { PageInterface, RetryAction } from "../..";
import type { PageEngineInterface } from "../index";
import type { SelectorType } from "../Selectors/SelectorsType";

export abstract class BasePage<
    PageClassEngine extends PageEngineInterface,
> implements PageInterface {

    /**
     * Current attempt number
     *
     * @type {number}
     * @memberof BasePage
     */
    public currentAttempt: number = 0;

    public page?: PageClassEngine;

    /**
     * Selector of this page
     *
     * @type {SelectorType}
     * @memberof BasePage
     */
    public abstract readonly $s?: SelectorType;

    public abstract readonly $$s?: Record<number | string | symbol, SelectorType>;

    public setPage(page: PageClassEngine): this {
        this.page = page;

        return this;
    }

    public success?(): Promise<void>;

    public finish?(exception?: Exception): Promise<void>;

    public failure?(exception: Exception): Promise<void>;

    public retrying?(exception: Exception, attempt: number): Promise<RetryAction>;

    public sleep?(): Promise<number>;

    public abstract execute(): Promise<void>;

    public abstract attempt(): Promise<number>;

}
