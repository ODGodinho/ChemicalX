import { Str } from "../../../../src";

describe("isJson", () => {
    const words = {
        "{}": true,
        "{'a': 1}": false,
        "{\"a\": 1}": true,
        "z": false,
        "": false,
    };

    test.each(Object.keys(words))("isJson tests", async (word) => {
        const myString = new Str(word);
        const bool = myString.isJson();

        expect(bool).toBeTypeOf("boolean");
        expect(bool).toBe(words[word as keyof typeof words]);
    });
});
