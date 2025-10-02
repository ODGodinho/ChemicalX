import { Exception } from "@odg/exception";
import { vi, type MockInstance } from "vitest";

import { ExampleWaitHandlerReturnException } from "tests/vitest/Handlers/mock/ExampleWaitHandlerReturnException";

import { type RetryAction } from "../../../dist";
import { type PageClassEngine } from "../playwright/engine";

describe("Handler Retry tests", () => {
    let handler: ExampleWaitHandlerReturnException;
    let handlerRetryingMock: MockInstance<[_exception: Exception, _times: number], Promise<RetryAction>>;
    beforeEach(() => {
        handler = new ExampleWaitHandlerReturnException(undefined as unknown as PageClassEngine, {});
        handlerRetryingMock = vi.spyOn(handler, "retrying");
    });

    test("Test Handler Solution return Exception", async () => {
        await expect(handler.execute()).rejects.toThrow(new Exception("stop process"));
        expect(handlerRetryingMock.mock.calls.length).toBe(0);
    });
});
