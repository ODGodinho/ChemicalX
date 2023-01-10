import { Exception } from "@odg/exception";

import { RetryAction, retry } from "../../../src/Helpers/index";

describe("Retry Test", () => {
    test("Retry 0 times test", async () => {
        const callback = jest.fn(() => {
            throw new Error("Example");
        });

        await expect(retry({
            times: 0,
            callback: callback,
        })).rejects.toThrowError("Example");
        expect(callback).toHaveBeenCalledTimes(1);
    });

    test("Retry Test When Resolve", async () => {
        const callback = jest.fn(() => {
            throw new Error("Example");
        });
        const when = jest.fn(() => RetryAction.Resolve);

        await expect(retry({
            times: 5,
            callback: callback,
            when: when,
        })).resolves.toBeUndefined();
        expect(callback).toHaveBeenCalledTimes(1);
        expect(when).toHaveBeenCalledTimes(1);
    });

    test("Retry when not called", async () => {
        const callback = jest.fn(() => true);
        const when = jest.fn(() => RetryAction.Default);

        await expect(retry({
            times: 5,
            callback: callback,
            when: when,
        })).resolves.toBeTruthy();
        expect(callback).toHaveBeenCalledTimes(1);
        expect(when).toHaveBeenCalledTimes(0);
    });

    test("Retry when Sleep", async () => {
        const callback = jest.fn(() => {
            throw new Error("error 2");
        });
        const when = jest.fn((_exception, times) => {
            if (times === 2) {
                return RetryAction.Throw;
            }

            return RetryAction.Default;
        });

        await expect(retry({
            times: 5,
            callback: callback,
            when: when,
        })).rejects.toThrow(new Exception("error 2"));
        expect(callback).toHaveBeenCalledTimes(3);
        expect(callback).toHaveBeenCalledTimes(3);
    });

    test("Retry Unknown Exception", async () => {
        const callback = jest.fn(() => {
            // eslint-disable-next-line @typescript-eslint/no-throw-literal
            throw new Exception("Anything");
        });

        await expect(retry({
            times: 0,
            callback: callback,
        })).rejects.toThrow(Exception);
    });

    test("Retry Unknown Exception", async () => {
        const callback = jest.fn((times) => {
            if (times === 0) {
                throw new Exception("error");
            }
        });

        await expect(retry({
            times: 3,
            callback: callback,
            sleep: 5,
        })).resolves.toBeUndefined();

        expect(callback).toHaveBeenCalledTimes(2);
    });

    test("All Retry errors", async () => {
        const callback = jest.fn(() => {
            throw new Error("Example");
        });

        await expect(retry({
            times: 4,
            callback: callback,
        })).rejects.toThrowError("Example");
        expect(callback).toHaveBeenCalledTimes(4);
    });

    test("First Time retry resolve", async () => {
        const callback = jest.fn(() => {
            throw new Error("RetryResolve");
        });

        await expect(retry({
            times: 1,
            callback: callback,
            when: () => RetryAction.Resolve,
        })).resolves.toBeUndefined();
    });
});
