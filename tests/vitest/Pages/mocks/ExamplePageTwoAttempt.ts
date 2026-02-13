import { Exception } from "@odg/exception";
import { vi } from "vitest";

import {
    BasePage,
    ODGDecorators,
    type PageEngineInterface,
    type SelectorType,
} from "../../../../src";
import type { PageClassEngine } from "../../playwright/engine";

@ODGDecorators.attemptableFlow()
export class ExamplePageTwoAttempt extends BasePage<PageClassEngine & PageEngineInterface> {

    public $s: SelectorType = {};

    public $$s = {};

    public startFunction: () => void;

    public constructor() {
        super();

        this.startFunction = vi.fn(() => {
            throw new Exception("Test Finish");
        });
    }

    public async execute(): Promise<void> {
        this.startFunction();
    }

    public async success(): Promise<void> {
        // Only Test
    }

    public async attempt(): Promise<number> {
        // Only for test
        return 2;
    }

    public async sleep(): Promise<number> {
        // Only for test
        return 400;
    }

    public async finish(): Promise<void> {
        // Only for test
    }

    public async failure(exception: Exception): Promise<void> {
        throw exception;
    }

}
