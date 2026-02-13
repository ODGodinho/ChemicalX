import { AbortException, Exception, UnknownException } from "@odg/exception";
import { vi } from "vitest";

import { RetryAction } from "@enums";
import { RetryException } from "@exceptions/RetryException";
import { retry } from "@helpers";

describe("Retry Test", () => {
    test("Retry 0 times test", async () => {
        const testCallback = vi.fn(() => {
            // eslint-disable-next-line no-restricted-syntax
            throw new Error("Example");
        });

        await expect(retry({
            "times": 0,
            "callback": testCallback,
        })).rejects.toThrowError("Example");
        expect(testCallback).toHaveBeenCalledTimes(1);
    });

    test("Retry Test When Resolve", async () => {
        const testCallback = vi.fn(() => {
            // eslint-disable-next-line no-restricted-syntax
            throw new Error("Example");
        });
        const when = vi.fn(() => RetryAction.Resolve);

        await expect(retry({
            "times": 5,
            "callback": testCallback,
            when,
        })).resolves.toBeUndefined();
        expect(testCallback).toHaveBeenCalledTimes(1);
        expect(when).toHaveBeenCalledTimes(1);
    });

    test("Retry when not called", async () => {
        const testCallback = vi.fn(() => true);
        const when = vi.fn(() => RetryAction.Default);

        await expect(retry({
            "times": 5,
            "callback": testCallback,
            when,
        })).resolves.toBeTruthy();
        expect(testCallback).toHaveBeenCalledTimes(1);
        expect(when).toHaveBeenCalledTimes(0);
    });

    test("Retry when Sleep", async () => {
        // eslint-disable-next-line no-restricted-syntax
        const errorInstance = new Error("error 2");
        const errorParse = new UnknownException("error 2");

        errorParse.original = errorInstance;

        const testCallback = vi.fn(() => {
            throw errorInstance;
        });
        const when = vi.fn((_exception, times) => {
            if (times === 3) {
                return RetryAction.Throw;
            }

            return RetryAction.Default;
        });

        await expect(retry({
            "times": 5,
            "callback": testCallback,
            when,
        })).rejects.toThrow(errorParse);
        expect(testCallback).toHaveBeenCalledTimes(3);
    });

    test("Retry Unknown Exception", async () => {
        const testCallback = vi.fn(() => {
            throw new Exception("Anything");
        });

        await expect(retry({
            "times": 0,
            "callback": testCallback,
        })).rejects.toThrow(Exception);
    });

    test("Retry Unknown Exception", async () => {
        const testCallback = vi.fn((times) => {
            if (times === 1) {
                throw new Exception("error");
            }
        });

        await expect(retry({
            "times": 3,
            "callback": testCallback,
            "sleep": 5,
        })).resolves.toBeUndefined();

        expect(testCallback).toHaveBeenCalledTimes(2);
    });

    test("All Retry errors", async () => {
        const testCallback = vi.fn(() => {
            // eslint-disable-next-line no-restricted-syntax
            throw new Error("Example");
        });

        await expect(retry({
            "times": 4,
            "callback": testCallback,
        })).rejects.toThrowError("Example");
        expect(testCallback).toHaveBeenCalledTimes(4);
    });

    test("First Time retry resolve", async () => {
        const testCallback = vi.fn(() => {
            // eslint-disable-next-line no-restricted-syntax
            throw new Error("RetryResolve");
        });

        await expect(retry({
            "times": 1,
            "callback": testCallback,
            "when": () => RetryAction.Resolve,
        })).resolves.toBeUndefined();
    });

    test("Throw if invalid times", async () => {
        const callbackTest = vi.fn(() => {
            // eslint-disable-next-line no-restricted-syntax
            throw new Error("RetryResolve");
        });

        await expect(retry({
            "times": undefined as unknown as number,
            "callback": callbackTest,
            "when": () => RetryAction.Resolve,
        })).rejects.toThrow(RetryException);
    });

    test("Throw if aborted", async () => {
        const testCallback = vi.fn(() => {
            // eslint-disable-next-line no-restricted-syntax
            throw new Error("RetryErrorBeforeAbort");
        });
        const signalController = new AbortController();
        const when = vi.fn(() => {
            signalController.abort("Not required");

            return RetryAction.Default;
        });

        await expect(retry({
            "times": 10,
            "callback": testCallback,
            when,
            "signal": signalController.signal,
        })).rejects.toThrow(AbortException);

        expect(when).toHaveBeenCalledTimes(1);
    });

    test("Throw if aborted after sleep", async () => {
        const callbackTest = vi.fn(() => {
            // eslint-disable-next-line no-restricted-syntax
            throw new Error("RetryErrorBeforeAbort");
        });
        const signalController = new AbortController();
        const when = vi.fn(() => {
            setTimeout(() => {
                signalController.abort("Abort Sleep");
            }, 100);

            return RetryAction.Default;
        });

        await expect(retry({
            "times": 10,
            "callback": callbackTest,
            when,
            "sleep": 700,
            "signal": signalController.signal,
        })).rejects.toThrow(AbortException);

        expect(when).toHaveBeenCalledTimes(1);
    });
});
