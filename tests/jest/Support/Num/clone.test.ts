import { Num } from "../../../../src";

describe("Cloneable", () => {
    test("Clone", async () => {
        const myNumber = new Num(123);
        const clone = myNumber.clone();
        expect(clone).toBeInstanceOf(Num);
        expect(clone === myNumber).toBeFalsy();
        expect(clone.toNative()).toStrictEqual(myNumber.toNative());
    });
});
