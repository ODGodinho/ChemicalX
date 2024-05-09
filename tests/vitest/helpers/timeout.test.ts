import { vi } from "vitest";

import { InvalidArgumentException, TimeoutException } from "@exceptions";
import { timeout } from "@helpers";

describe("Retry Test", () => {
    test("Timeout Without name", async () => {
        const callback = vi.fn(async () => new Promise(() => {
            // Ignore
        }));

        await expect(timeout({
            timeout: 10,
            callback: callback,
        })).rejects.toThrowError(TimeoutException);
        expect(callback).toHaveBeenCalledTimes(1);
    });

    test("Timeout With name", async () => {
        const callback = vi.fn(async () => new Promise(() => {
            // Ignore
        }));

        await expect(timeout({
            timeout: 5,
            callback: callback,
            name: "Test",
        })).rejects.toThrowError("Test - Timeout 5ms exceeded");
        expect(callback).toHaveBeenCalledTimes(1);
    });

    test("Timeout not Error", async () => {
        const callback = vi.fn(() => 123);

        await expect(timeout({
            timeout: 5000,
            callback: callback,
        })).resolves.toBe(123);
        expect(callback).toHaveBeenCalledTimes(1);
    });

    test("Timeout Invalid Number", async () => {
        await expect(timeout({
            timeout: "a" as unknown as number,
            callback: () => null,
        })).rejects.toThrowError(InvalidArgumentException);
    });

    test("Timeout NaN", async () => {
        await expect(timeout({
            timeout: Number.NaN,
            callback: () => null,
        })).rejects.toThrowError(InvalidArgumentException);
    });
});
