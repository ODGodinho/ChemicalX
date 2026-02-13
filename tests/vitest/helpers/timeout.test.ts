import { vi } from "vitest";

import { InvalidArgumentException, TimeoutException } from "@exceptions";
import { timeout } from "@helpers";

describe("Timeout Test", () => {
    test("Timeout Without name", async () => {
        const testCallback = vi.fn(async () => new Promise(() => {
            // Ignore
        }));

        await expect(timeout({
            "timeout": 10,
            "callback": testCallback,
        })).rejects.toThrowError(TimeoutException);
        expect(testCallback).toHaveBeenCalledTimes(1);
    });

    test("Timeout With name", async () => {
        const testCallback = vi.fn(async () => new Promise(() => {
            // Ignore
        }));

        await expect(timeout({
            "timeout": 5,
            "callback": testCallback,
            "name": "Test",
        })).rejects.toThrowError("Test - Timeout 5ms exceeded");
        expect(testCallback).toHaveBeenCalledTimes(1);
    });

    test("Timeout not Error", async () => {
        const testCallback = vi.fn(() => 123);

        await expect(timeout({
            "timeout": 5000,
            "callback": testCallback,
        })).resolves.toBe(123);
        expect(testCallback).toHaveBeenCalledTimes(1);
    });

    test("Timeout Invalid Number", async () => {
        await expect(timeout({
            "timeout": "a" as unknown as number,
            "callback": () => null,
        })).rejects.toThrowError(InvalidArgumentException);
    });

    test("Timeout NaN", async () => {
        await expect(timeout({
            "timeout": Number.NaN,
            "callback": () => null,
        })).rejects.toThrowError(InvalidArgumentException);
    });
});
