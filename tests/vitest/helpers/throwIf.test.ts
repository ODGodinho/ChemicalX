import { Exception, UnknownException } from "@odg/exception";
import { vi } from "vitest";

import { throwIf } from "@helpers";

describe("throwIf Test", () => {
    test("Test condition true", async () => {
        const exception = new UnknownException("Exception Unknown Teste");
        expect(() => {
            throwIf(true, () => exception);
        }).toThrow(exception);
    });

    test("Test condition false", async () => {
        const calledToThrow = vi.fn(() => new Exception("Not Called"));
        expect(() => {
            throwIf(false, calledToThrow);
        }).not.toThrow();
        expect(calledToThrow).toHaveBeenCalledTimes(0);
    });
});
