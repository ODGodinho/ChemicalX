import { Exception } from "@odg/exception";
import { type Mock, vi } from "vitest";

import { RetryAction } from "@enums";
import type { HandlerFunction, HandlerSolutionType } from "@interfaces";

import type { PageClassEngine } from "../playwright/engine";

import { ExampleFailedAttemptHandler, ExampleHandler } from "./mocks";

describe("Handler Test Invalid Exception", () => {
    let handler: ExampleHandler;
    let handlerSolutionMock: Mock<() => Promise<HandlerSolutionType>>;
    let handlerWaitForHandlerMock: Mock<() => Promise<HandlerFunction>>;

    beforeEach(() => {
        handler = new ExampleHandler(undefined as unknown as PageClassEngine, {});
        handlerSolutionMock = vi.spyOn(handler, "testSolution");
        handlerWaitForHandlerMock = vi.spyOn(handler, "waitForHandler");
    });

    test("Test solution exception code", async () => {
        handlerSolutionMock.mockImplementation(async () => {
            // Force teste unknown error
            // eslint-disable-next-line @typescript-eslint/only-throw-error
            throw undefined;
        });

        await expect(handler.execute()).rejects.toThrowError("Retry Unknown Exception");
        expect(handlerSolutionMock.mock.calls.length).toBe(1);
    });

    test("Test solution invalid exception", async () => {
        handlerWaitForHandlerMock.mockImplementation(async () => {
            throw new Exception("Anything");
        });
        const handlerFailed = new ExampleFailedAttemptHandler(undefined as unknown as PageClassEngine, {});

        const handlerFailWaitMock = vi.spyOn(handlerFailed, "retrying");

        handlerFailWaitMock.mockImplementation(async () => RetryAction.Resolve);

        await expect(handlerFailed.execute()).resolves.toBeUndefined();
        expect(handlerSolutionMock.mock.calls.length).toBe(0);
    });
});
