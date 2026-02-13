import { Exception } from "@odg/exception";

import {
    BasePage,
    ODGDecorators,
    type PageEngineInterface,
    type SelectorType,
} from "../../../../src";
import type { PageClassEngine } from "../../playwright/engine";

@ODGDecorators.attemptableFlow()
export class ExamplePageWithFinish extends BasePage<PageClassEngine & PageEngineInterface> {

    public $s: SelectorType = {};

    public $$s = {};

    private testAttempt = 0;

    public async execute(): Promise<void> {
        if (this.testAttempt++ === 0) throw new Exception("Test Finish");
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

    public async failure(): Promise<void> {
        // Ignore failed only
    }

}
