import { Arr, Str } from "../../../../src";

const values = [
    {
        original: "This costs 10,00 or 20,00",
        expected: [
            10.0,
            20.0,
        ],
    },
    {
        original: "This costs 10,50 or 20,01",
        expected: [
            10.5,
            20.01,
        ],
    },
];

const notMatch = [
    {
        original: "This costs or ",
        expected: undefined,
    },
];

describe.each(values)("Test Moneys extract", (option) => {
    test(`Test Money extract ${option.original}`, () => {
        const moneys = new Str(option.original).moneys();

        expect(moneys).toBeInstanceOf(Arr);
        expect(moneys.toArray().map((item) => item.toNumber())).toEqual(option.expected);
    });
});

describe.each(notMatch)("Test Moneys extract Not Match", (option) => {
    test(`Test Money extract Invalid Text: ${option.original}`, () => {
        const moneys = new Str(option.original).moneys();

        expect(moneys).toBeInstanceOf(Arr);
        expect(moneys.toArray().length).toEqual(0);
    });
});
