import { Str } from "src";

describe("ucFirst", () => {
    const words = {
        "test": "Test",
        "userName": "UserName",
    };

    test.each(Object.keys(words))("ucFirst word", async (word) => {
        const myString = new Str(word);
        const format = myString.ucFirst();

        expect(format).toBeInstanceOf(Str);
        expect(format.toString()).toBe(words[word as keyof typeof words]);
    });
});
