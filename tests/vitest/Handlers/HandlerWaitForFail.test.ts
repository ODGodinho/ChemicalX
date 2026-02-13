import { Exception } from "@odg/exception";
import { type Mock, vi } from "vitest";

import type { HandlerFunction } from "@interfaces";

import type { PageClassEngine } from "../playwright/engine";

import { ExampleHandler } from "./mocks/ExampleHandler";

describe("Handler Attempt", () => {
    let handler: ExampleHandler;
    let handlerWaitMock: Mock<() => Promise<HandlerFunction>>;
    let handlerAttemptMock: Mock<() => Promise<number>>;

    beforeEach(() => {
        handler = new ExampleHandler();
        handlerWaitMock = vi.spyOn(handler, "waitForHandler");
        handlerAttemptMock = vi.spyOn(handler, "attempt");
    });

    test("Test init page instance", () => {
        expect(handler.page).toBeUndefined();
        expect(handler.setPage(123 as unknown as PageClassEngine)).toBe(handler);
        expect(handler.page).toBe(123);
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
