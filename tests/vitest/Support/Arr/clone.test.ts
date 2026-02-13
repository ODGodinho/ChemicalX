import { Arr } from "../../../../src";

describe("Cloneable", () => {
    test("Clone", async () => {
        const myArray = new Arr([ "" ]);
        const clone = myArray.clone();

        expect(clone).toBeInstanceOf(Arr);
        expect(clone === myArray).toBeFalsy();
    });
});
