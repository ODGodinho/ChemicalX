import { Exception } from "@odg/exception";
import { type Mock, vi } from "vitest";

import { RetryAction } from "@enums";
import type { HandlerSolutionType } from "@interfaces";

import { WithoutFunctionHandler } from "./mocks/WithoutFunctionHandler";

describe("Handler success Function", () => {
    let handler: WithoutFunctionHandler;
    let handlerSolutionMock: Mock<() => Promise<HandlerSolutionType>>;

    beforeEach(() => {
        handler = new WithoutFunctionHandler();
        handlerSolutionMock = vi.spyOn(handler, "testSolution");
    });

    test("Test success without optional functions", async () => {
        handlerSolutionMock.mockImplementation(async () => RetryAction.Resolve);

        await expect(handler.execute()).resolves.toBeUndefined();
        expect(handlerSolutionMock.mock.calls.length).toBe(1);
    });

    test("Test fail without optional functions", async () => {
        handlerSolutionMock.mockImplementation(async () => {
            throw new Exception("Example");
        });

        await expect(handler.execute()).rejects.toThrowError(Exception);
        expect(handlerSolutionMock.mock.calls.length).toBe(1);
    });
});
