import { Str } from "../../../../src";

describe("Only Words Caracteres", () => {
    const words = {
        "abc 123.34 def": "abc12334def",
        "abc+def": "abcdef",
        "abc-def": "abcdef",
        "abc_def": "abc_def",
    };

    test.each(Object.keys(words))("Test onlyWordsCaracteres Result", async (word) => {
        const myString = new Str(word);
        expect(myString.onlyWordsCaracteres()).toBeInstanceOf(Str);
        expect(myString.onlyWordsCaracteres().toString()).toBe(words[word as keyof typeof words]);
    });
});
