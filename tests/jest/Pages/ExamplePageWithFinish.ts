import { Exception } from "@odg/exception";

import {
    BasePage, type PageEngineInterface, type SelectorType,
} from "../../../src";
import { type PageClassEngine } from "../playwright/engine";

export class ExamplePageWithFinish extends BasePage<unknown, PageClassEngine & PageEngineInterface> {

    public $s: SelectorType = {};

    private testAttempt = 0;

    public async execute(): Promise<void> {
        await this.start(async () => {
            if (this.testAttempt++ === 0) throw new Exception("Test Finish");
        });
    }

    public async success(): Promise<void> {
        // Only Test
    }

    public async attempt(): Promise<number> {
        // Only for test
        return 3;
    }

    public async finish(): Promise<void> {
        // Only for test
    }

    public async failedPage(): Promise<void> {
        // Ignore failed only
    }

}
