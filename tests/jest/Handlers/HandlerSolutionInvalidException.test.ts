import { Exception } from "@odg/exception";

import { RetryAction, type HandlerSolution, type HandlerFunction } from "../../../src";
import { type PageClassEngine } from "../playwright/engine";

import { ExampleHandler } from "./mock/ExampleHandler";

describe("Handler Test Invalid Exception", () => {
    let handler: ExampleHandler;
    let handlerSolutionMock: jest.SpyInstance<Promise<HandlerSolution>, unknown[]>;
    let handlerWaitForHandlerMock: jest.SpyInstance<Promise<HandlerFunction>, unknown[]>;
    let handlerFailWaitMock: jest.SpyInstance<Promise<RetryAction>, [_exception: Exception, _attempt: number]>;
    beforeEach(() => {
        handler = new ExampleHandler(undefined as unknown as PageClassEngine, {});
        handlerSolutionMock = jest.spyOn(handler, "testSolution");
        handlerWaitForHandlerMock = jest.spyOn(handler, "waitForHandler");
        handlerFailWaitMock = jest.spyOn(handler, "failedAttempt");
    });

    test("Test solution invalid exception", async () => {
        handlerSolutionMock.mockImplementation(async () => {
            // eslint-disable-next-line @typescript-eslint/no-throw-literal
            throw undefined;
        });

        await expect(handler.execute()).rejects.toThrowError("Handler UnknownException");
        expect(handlerSolutionMock.mock.calls.length).toBe(1);
    });

    test("Test solution invalid exception", async () => {
        handlerWaitForHandlerMock.mockImplementation(async () => {
            throw new Exception("Anything");
        });
        handlerFailWaitMock.mockImplementation(async () => RetryAction.Resolve);

        await expect(handler.execute()).resolves.toBeUndefined();
        expect(handlerSolutionMock.mock.calls.length).toBe(0);
    });
});
