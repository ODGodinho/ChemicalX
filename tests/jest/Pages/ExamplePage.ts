import { Exception } from "@odg/exception";

import {
    BasePage, RetryAction, type PageEngineInterface, type SelectorType,
} from "../../../src";
import { type PageClassEngine } from "../playwright/engine";

export class ExamplePage extends BasePage<unknown, PageClassEngine & PageEngineInterface> {

    public $s: SelectorType = {};

    public testIndex = 0;

    public async execute(): Promise<void> {
        await this.start(async () => {
            await this.preStart();

            await this.throwIfAttempt();
            await this.goto();
            expect(await this.page.waitForSelector("div", { timeout: 5000 })).toBeTruthy();
        });
    }

    public async throwIfAttempt(): Promise<void> {
        if (this.testIndex++ === 0) throw new Exception("Test Attempt");
    }

    public async goto(): Promise<void> {
        void this.page.goto("https://www.google.com", { waitUntil: "domcontentloaded" })
            .catch(() => null);
    }

    public async failedAttempt(_exception: Exception): Promise<RetryAction> {
        return RetryAction.Default;
    }

    public async success(): Promise<void> {
        await super.success();

        this.testIndex++;
    }

    public async finish(_exception?: Exception | undefined): Promise<void> {
        ++this.testIndex;
    }

    public async attempt(): Promise<number> {
        // Only for test
        return 3;
    }

}
