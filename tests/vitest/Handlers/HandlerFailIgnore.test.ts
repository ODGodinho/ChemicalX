import { type Mock, vi } from "vitest";

import { FailedIgnoreHandler } from "./mocks/FailedIgnoreHandler";

describe("Handler Attempt", () => {
    let handler: FailedIgnoreHandler;
    let handlerAttemptMock: Mock<() => Promise<number>>;

    beforeEach(() => {
        handler = new FailedIgnoreHandler();
        handlerAttemptMock = vi.spyOn(handler, "attempt");
    });

    test("test execute exception", async () => {
        handlerAttemptMock.mockImplementation(async () => Promise.resolve(2));

        await expect(handler.execute()).resolves.toBeUndefined();
    });
});
