import { type Exception } from "@odg/exception";

import { type RetryAction, type PageInterface } from "../..";
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

    public success?(): Promise<void>;

    public finish?(exception?: Exception | undefined): Promise<void>;

    public failure?(exception: Exception): Promise<void>;

    public retrying?(exception: Exception, attempt: number): Promise<RetryAction>;

    public sleep?(): Promise<number>;

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
