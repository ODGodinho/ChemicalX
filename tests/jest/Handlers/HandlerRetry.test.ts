import { HandlerSolution } from "../../../src";
import { type PageClassEngine } from "../playwright/engine";

import { ExampleHandler } from "./mock/ExampleHandler";

describe("Handler Retry tests", () => {
    let handler: ExampleHandler;
    let handlerSolutionMock: jest.SpyInstance<Promise<HandlerSolution>, unknown[]>;
    let handlerAttemptMock: jest.SpyInstance<Promise<number>, unknown[]>;
    beforeEach(() => {
        handler = new ExampleHandler(undefined as unknown as PageClassEngine, {});
        handlerSolutionMock = jest.spyOn(handler, "testSolution");
        handlerAttemptMock = jest.spyOn(handler, "attempt");
    });

    test("Test Retry Solution 3 times", async () => {
        handlerSolutionMock.mockImplementation(async () => {
            if (handlerSolutionMock.mock.calls.length < 3) return HandlerSolution.Retry;

            return handler.successSolution();
        });
        handlerAttemptMock.mockImplementation(async () => Promise.resolve(4));

        await expect(handler.execute()).resolves.toBeUndefined();
        expect(handlerSolutionMock.mock.calls.length).toBe(3);
    });
});
