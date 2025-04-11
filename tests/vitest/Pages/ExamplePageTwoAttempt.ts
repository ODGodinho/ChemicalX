import { Exception } from "@odg/exception";
import { vi } from "vitest";

import {
    BasePage, ODGDecorators, type PageEngineInterface, type SelectorType,
} from "../../../src";
import { type PageClassEngine } from "../playwright/engine";

@ODGDecorators.attemptableFlow()
export class ExamplePageTwoAttempt extends BasePage<unknown, PageClassEngine & PageEngineInterface> {

    public $s: SelectorType = {};

    public startFunction: () => void;

    public constructor(page: PageClassEngine & PageEngineInterface, $$s: unknown) {
        super(page, $$s);

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

    public async finish(): Promise<void> {
        // Only for test
    }

    public async failure(exception: Exception): Promise<void> {
        throw exception;
    }

}
