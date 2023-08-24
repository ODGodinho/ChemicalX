import { Exception } from "@odg/exception";

import * as Exceptions from "../../../src/Exceptions";

describe.each(Object.values(Exceptions))("test All exception", (ExceptionClass) => {
    test("test instance", () => {
        expect(new ExceptionClass("test")).toBeInstanceOf(Exception);
    });
});
