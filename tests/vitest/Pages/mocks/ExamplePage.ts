import { Exception } from "@odg/exception";

import {
    BasePage,
    ODGDecorators,
    type PageEngineInterface,
    type SelectorType,
} from "../../../../src";
import type { PageClassEngine } from "../../playwright/engine";

@ODGDecorators.injectablePageOrHandler("ExamplePage")
@ODGDecorators.attemptableFlow()
export class ExamplePage extends BasePage<PageClassEngine & PageEngineInterface> {

    public $s: SelectorType = {};

    public $$s = {};

    public declare page: PageClassEngine & PageEngineInterface;

    public testIndex = 0;

    public async execute(): Promise<void> {
        await this.throwIfAttempt();
        await this.goto();
        expect(await this.page.waitForSelector("div", { timeout: 5000 })).toBeTruthy();
    }

    public async throwIfAttempt(): Promise<void> {
        if (this.testIndex++ === 0) throw new Exception("Test Attempt");
    }

    public async goto(): Promise<void> {
        await this.page.goto("about:blank", { waitUntil: "domcontentloaded" })
            .then(() => null)
            .catch(() => null);
        await this.page.evaluate(() => {
            const newDiv = document.createElement("div");

            newDiv.textContent = "myDiv";
            document.body.append(newDiv);
        });
    }

    public async success(): Promise<void> {
        await super.success?.();

        this.testIndex++;
    }

    public async finish(_exception?: Exception): Promise<void> {
        ++this.testIndex;
    }

    public async attempt(): Promise<number> {
        // Only for test
        return 3;
    }

}
