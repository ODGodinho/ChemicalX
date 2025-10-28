import { Exception } from "@odg/exception";
import { vi, type MockInstance } from "vitest";

import { type HandlerSolutionType } from "@interfaces";
import { ExampleSolutionReturnErrorHandler } from "tests/vitest/Handlers/mock/ExampleSolutionReturnErrorHandler";

import { type PageClassEngine } from "../playwright/engine";

describe("Handler Retry tests", () => {
    let handler: ExampleSolutionReturnErrorHandler;
    let handlerSolutionMock: MockInstance<unknown[], Promise<HandlerSolutionType>>;
    beforeEach(() => {
        handler = new ExampleSolutionReturnErrorHandler(undefined as unknown as PageClassEngine, {});
        handlerSolutionMock = vi.spyOn(handler, "testSolution");
    });

    test("Test Handler Solution return Exception", async () => {
        const handlerRetrying = vi.spyOn(handler, "retrying");

        await expect(handler.execute()).rejects.toThrow(new Exception("force stop"));
        expect(handlerRetrying.mock.calls.length).toBe(0);
    });

    test("Test Handler Solution return Exception after 2 times", async () => {
        const handlerRetrying = vi.spyOn(handler, "retrying");
        handlerSolutionMock.mockImplementation(async () => {
            if (handlerSolutionMock.mock.calls.length < 3) {
                throw new Exception("Action force to retry");
            }

            return new Exception("mock error");
        });

        await expect(handler.execute()).rejects.toThrow(new Exception("mock error"));
        expect(handlerRetrying.mock.calls.length).toBe(2);
    });
});
