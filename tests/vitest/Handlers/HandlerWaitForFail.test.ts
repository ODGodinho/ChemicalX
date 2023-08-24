import { Exception } from "@odg/exception";
import { vi, type SpyInstance } from "vitest";

import { type HandlerFunction } from "../../..";
import { type PageClassEngine } from "../playwright/engine";

import { ExampleHandler } from "./mock/ExampleHandler";

describe("Handler Attempt", () => {
    let handler: ExampleHandler;
    let handlerWaitMock: SpyInstance<unknown[], Promise<HandlerFunction>>;
    let handlerAttemptMock: SpyInstance<unknown[], Promise<number>>;
    beforeEach(() => {
        handler = new ExampleHandler(undefined as unknown as PageClassEngine, {});
        handlerWaitMock = vi.spyOn(handler, "waitForHandler");
        handlerAttemptMock = vi.spyOn(handler, "attempt");
    });

    test("test execute exception", async () => {
        const message = "Exception called 2 times";
        handlerWaitMock.mockImplementation(async () => {
            throw new Exception(message);
        });
        handlerAttemptMock.mockImplementation(async () => Promise.resolve(2));

        await expect(handler.execute()).rejects.toThrowError(message);
        expect(handlerWaitMock.mock.calls.length).toBe(2);
    });

    test("Test execute exception one time", async () => {
        const message = "Exception Called 1 time";
        handlerWaitMock.mockImplementation(async () => {
            throw new Exception(message);
        });
        handlerAttemptMock.mockImplementation(async () => Promise.resolve(1));

        await expect(handler.execute()).rejects.toThrowError(message);
        expect(handlerWaitMock.mock.calls.length).toBe(1);
    });
});
