import {
    MoneyNotFoundException,
    MoneyMultipleResultException,
    Num,
    Str,
} from "../../../../src";

const values = [
    {
        original: "5",
        expected: 5,
    },
    {
        original: "5.1",
        expected: 5.1,
    },
    {
        original: "5.10",
        expected: 5.1,
    },
    {
        original: "500,000",
        expected: 500_000,
    },
    {
        original: "500,000.1",
        expected: 500_000.1,
    },
    {
        original: "500,000.10",
        expected: 500_000.1,
    },
    {
        original: "100,000,000.53",
        expected: 100_000_000.53,
    },
    {
        original: "100,000,000,5",
        expected: 100_000_000.5,
    },
    {
        original: "1,20",
        expected: 1.2,
    },
    {
        original: "2.634,91",
        expected: 2634.91,
    },
    {
        original: "13,3",
        expected: 13.3,
    },
];

const notFound = [
    {
        original: "Stanley",
        expected: undefined,
    },
];

const multiple = [
    {
        original: "This costs 10,00 or 20,00",
        expected: undefined,
    },
];

describe.each(values)("Test Money extract", (option) => {
    test(`Test Money extract ${option.expected}`, () => {
        const money = new Str(option.original).money();

        expect(money).toBeInstanceOf(Num);
        expect(money.toNumber()).toEqual(option.expected);
    });
});

describe.each(notFound)("Test NotFound Money", (option) => {
    test(`Test Money of Invalid Text: ${option.original}`, () => {
        expect(() => new Str(option.original).money()).toThrowError(MoneyNotFoundException);
    });
});

describe.each(multiple)("Test Multiple Results Money", (option) => {
    test(`Test Multiple Money error: ${option.original}`, () => {
        expect(() => new Str(option.original).money()).toThrowError(MoneyMultipleResultException);
    });
});
