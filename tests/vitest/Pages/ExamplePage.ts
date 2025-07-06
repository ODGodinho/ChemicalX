import { Exception } from "@odg/exception";

import {
    BasePage,
    ODGDecorators,
    type PageEngineInterface,
    type SelectorType,
} from "../../../src";
import { type PageClassEngine } from "../playwright/engine";

@ODGDecorators.injectablePageOrHandler("ExamplePage")
@ODGDecorators.attemptableFlow()
export class ExamplePage extends BasePage<unknown, PageClassEngine & PageEngineInterface> {

    public $s: SelectorType = {};

    public testIndex = 0;

    public async execute(): Promise<void> {
        await this.preStart();

        await this.throwIfAttempt();
        await this.goto();
        expect(await this.page.waitForSelector("div", { timeout: 5000 })).toBeTruthy();
    }

    public async throwIfAttempt(): Promise<void> {
        if (this.testIndex++ === 0) throw new Exception("Test Attempt");
    }

    public async goto(): Promise<void> {
        this.page.goto("https://www.google.com", { waitUntil: "domcontentloaded" })
            .then(() => null)
            .catch(() => null);
    }

    public async success(): Promise<void> {
        await super.success?.();

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
