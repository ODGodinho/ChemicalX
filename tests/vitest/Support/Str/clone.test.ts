import { Str } from "../../../../src";

describe("Cloneable", () => {
    test("Clone", async () => {
        const myString = new Str("");
        const clone = myString.clone();
        expect(clone).toBeInstanceOf(Str);
        expect(clone === myString).toBeFalsy();
        expect(clone.toNative()).toStrictEqual(myString.toNative());
    });
});
