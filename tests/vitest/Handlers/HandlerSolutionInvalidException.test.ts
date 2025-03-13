import { Exception } from "@odg/exception";
import { vi, type MockInstance } from "vitest";

import { RetryAction, type HandlerSolution, type HandlerFunction } from "../../../src";
import { type PageClassEngine } from "../playwright/engine";

import { ExampleHandler, ExampleFailedAttemptHandler } from "./mock";

describe("Handler Test Invalid Exception", () => {
    let handler: ExampleHandler;
    let handlerSolutionMock: MockInstance<unknown[], Promise<HandlerSolution>>;
    let handlerWaitForHandlerMock: MockInstance<unknown[], Promise<HandlerFunction>>;

    beforeEach(() => {
        handler = new ExampleHandler(undefined as unknown as PageClassEngine, {});
        handlerSolutionMock = vi.spyOn(handler, "testSolution");
        handlerWaitForHandlerMock = vi.spyOn(handler, "waitForHandler");
    });

    test("Test solution invalid exception", async () => {
        handlerSolutionMock.mockImplementation(async () => {
            // eslint-disable-next-line no-throw-literal
            throw undefined;
        });

        await expect(handler.execute()).rejects.toThrowError("Handler UnknownException");
        expect(handlerSolutionMock.mock.calls.length).toBe(1);
    });

    test("Test solution invalid exception", async () => {
        handlerWaitForHandlerMock.mockImplementation(async () => {
            throw new Exception("Anything");
        });
        const handlerFailed = new ExampleFailedAttemptHandler(undefined as unknown as PageClassEngine, {});

        const handlerFailWaitMock: MockInstance<
            [_exception: Exception, _attempt: number],
            Promise<RetryAction>
        > = vi.spyOn(handlerFailed, "failedAttempt");

        handlerFailWaitMock.mockImplementation(async () => RetryAction.Resolve);

        await expect(handlerFailed.execute()).resolves.toBeUndefined();
        expect(handlerSolutionMock.mock.calls.length).toBe(0);
    });
});
