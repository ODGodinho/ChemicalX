import { vi, type MockInstance } from "vitest";

import { RetryAction } from "../../../src";
import { type PageClassEngine } from "../playwright/engine";

import { ExampleHandler } from "./mock/ExampleHandler";

describe("Handler Retry tests", () => {
    let handler: ExampleHandler;
    let handlerSolutionMock: MockInstance<unknown[], Promise<RetryAction>>;
    let handlerAttemptMock: MockInstance<unknown[], Promise<number>>;
    beforeEach(() => {
        handler = new ExampleHandler(undefined as unknown as PageClassEngine, {});
        handlerSolutionMock = vi.spyOn(handler, "testSolution");
        handlerAttemptMock = vi.spyOn(handler, "attempt");
    });

    test("Test Retry Solution 3 times", async () => {
        handlerSolutionMock.mockImplementation(async () => {
            if (handlerSolutionMock.mock.calls.length < 3) return RetryAction.Retry;

            return handler.successSolution();
        });
        handlerAttemptMock.mockImplementation(async () => Promise.resolve(4));

        await expect(handler.execute()).resolves.toBeUndefined();
        expect(handlerSolutionMock.mock.calls.length).toBe(3);
    });
});
