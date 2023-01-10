import { type Exception } from "@odg/exception";

import {
    BasePage, RetryAction, type PageEngineInterface, type SelectorType,
} from "../../../src";
import { type PageClassEngine } from "../playwright/engine";

export class ExamplePageWithoutFinish extends BasePage<unknown, PageClassEngine & PageEngineInterface> {

    public $s: SelectorType = {};

    public async execute(): Promise<void> {
        await this.start(async () => {
            await this.preStart();

            // Test only
        });
    }

    public async failedAttempt(_exception: Exception): Promise<RetryAction> {
        return RetryAction.Default;
    }

    public async attempt(): Promise<number> {
        // Only for test
        return 1;
    }

}
