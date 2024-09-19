import { vi, type MockInstance } from "vitest";

import { type PageClassEngine } from "../playwright/engine";

import { FailedIgnoreHandler } from "./mock/FailedIgnoreHandler";

describe("Handler Attempt", () => {
    let handler: FailedIgnoreHandler;
    let handlerAttemptMock: MockInstance<unknown[], Promise<number>>;
    beforeEach(() => {
        handler = new FailedIgnoreHandler(undefined as unknown as PageClassEngine, {});
        handlerAttemptMock = vi.spyOn(handler, "attempt");
    });

    test("test execute exception", async () => {
        handlerAttemptMock.mockImplementation(async () => Promise.resolve(2));

        await expect(handler.execute()).resolves.toBeUndefined();
    });
});
