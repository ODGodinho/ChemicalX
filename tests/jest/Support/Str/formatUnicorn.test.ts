import { Str } from "../../../../src";

describe("formatUnicorn", () => {
    const words = {
        "message {{ test }}": "message replaced",
        "message {{test}}": "message replaced",
    };

    test.each(Object.keys(words))("Message replace", async (word) => {
        const myString = new Str(word);
        const format = myString.formatUnicorn({
            "test": "replaced",
        });
        expect(format).toBeInstanceOf(Str);
        expect(format.toString()).toBe(words[word as keyof typeof words]);
    });
});
