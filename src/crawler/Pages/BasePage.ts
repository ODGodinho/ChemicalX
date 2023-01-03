import { type PageEngineInterface } from "../index";
import { type SelectorType } from "../Selectors/SelectorsTypo";

export abstract class BasePage<SelectorBaseType, PageClassEngine extends PageEngineInterface> {

    /**
     * Current attempt number
     *
     * @type {number}
     * @memberof BasePage
     */
    protected currentAttempt: number = 0;

    /**
     * Selector of this page
     *
     * @abstract
     * @type {SelectorType}
     * @memberof BasePage
     */
    public readonly abstract $s: SelectorType;

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

}
