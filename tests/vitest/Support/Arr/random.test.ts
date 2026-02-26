import { InvalidArgumentException } from "@exceptions";

import { Arr } from "../../../../src";

describe("Arr.random", () => {
    describe("default parameter (no argument)", () => {
        test("should use default value of 1 when called without arguments", () => {
            const array = new Arr([ 1, 2, 3, 4, 5 ]);
            const result = array.random();

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(1);
            expect([ 1, 2, 3, 4, 5 ]).toContain(result[0]);
        });

        test("should return undefined when array is empty and no argument provided", () => {
            const array = new Arr<number[]>([]);

            expect(() => array.random()).toThrow(InvalidArgumentException);
        });

        test("should work with default value on string arrays", () => {
            const array = new Arr([ "a", "b", "c", "d" ]);
            const result = array.random();

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(1);
            expect([ "a", "b", "c", "d" ]).toContain(result[0]);
        });

        test("should work with default value on object arrays", () => {
            const object1 = { id: 1 };
            const object2 = { id: 2 };
            const object3 = { id: 3 };
            const array = new Arr([ object1, object2, object3 ]);
            const result = array.random();

            expect(result).toBeDefined();
            expect(result.length).toBe(1);
            expect([ object1, object2, object3 ]).toContain(result[0]);
        });

        test("should return different elements on multiple calls without arguments (probabilistic)", () => {
            const array = new Arr([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]);
            const results = new Set();

            // Run multiple times to increase chance of getting different values
            for (let index = 0; index < 50; index++) {
                const result = array.random();

                results.add(result);
            }

            // With 50 calls on 10 elements, we should get at least 2 different values
            expect(results.size).toBeGreaterThan(1);
        });
    });

    describe("length === 1 (single element)", () => {
        test("should return a single random element from the array", () => {
            const array = new Arr([ 1, 2, 3, 4, 5 ]);
            const result = array.random(1);

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(1);
            expect([ 1, 2, 3, 4, 5 ]).toContain(result[0]);
        });

        test("should return undefined when array is empty", () => {
            const array = new Arr<number[]>([]);

            expect(() => array.random(1)).toThrow(InvalidArgumentException);
        });

        test("should return element from array with single element", () => {
            const array = new Arr([ 42 ]);
            const result = array.random(1);

            expect(result).toStrictEqual([ 42 ]);
        });

        test("should return different elements on multiple calls (probabilistic)", () => {
            const array = new Arr([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]);
            const results = new Set();

            // Run multiple times to increase chance of getting different values
            for (let index = 0; index < 50; index++) {
                const result = array.random(1);

                results.add(result);
            }

            // With 50 calls on 10 elements, we should get at least 2 different values
            expect(results.size).toBeGreaterThan(1);
        });

        test("should work with string arrays", () => {
            const array = new Arr([ "a", "b", "c", "d" ]);
            const result = array.random(1);

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(1);
            expect([ "a", "b", "c", "d" ]).toContain(result[0]);
        });

        test("should work with object arrays", () => {
            const object1 = { id: 1 };
            const object2 = { id: 2 };
            const object3 = { id: 3 };
            const array = new Arr([ object1, object2, object3 ]);
            const result = array.random(1);

            expect(result).toBeDefined();
            expect(result.length).toBe(1);
            expect([ object1, object2, object3 ]).toContain(result[0]);
        });
    });

    describe("length > 1 (multiple elements)", () => {
        test("should return array of unique random elements", () => {
            const array = new Arr([ 1, 2, 3, 4, 5 ]);
            const result = array.random(3);

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(3);

            // Check all elements are unique
            const uniqueResults = new Set(result);

            expect(uniqueResults.size).toBe(3);

            // Check all elements are from original array
            for (const element of result) {
                expect([ 1, 2, 3, 4, 5 ]).toContain(element);
            }
        });

        test("should return all elements when length equals array length", () => {
            const array = new Arr([ 1, 2, 3, 4, 5 ]);
            const result = array.random(5);

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(5);

            // Should contain all elements (order may differ)
            const sortedResult = result.toSorted((first, second) => first - second);
            const expectedSorted = [ 1, 2, 3, 4, 5 ].toSorted((first, second) => first - second);

            expect(sortedResult).toEqual(expectedSorted);
        });

        test("should throw InvalidArgumentException when length exceeds array size", () => {
            const array = new Arr([ 1, 2 ]);

            expect(() => {
                array.random(3);
            }).toThrow(InvalidArgumentException);
        });

        test("should return different combinations on multiple calls (probabilistic)", () => {
            const array = new Arr([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]);
            const results = new Set();

            // Run multiple times to increase chance of getting different combinations
            for (let index = 0; index < 50; index++) {
                const result = array.random(3);

                results.add(result.toSorted((first, second) => first - second).join(","));
            }

            // With 50 calls selecting 3 from 10, we should get different combinations
            expect(results.size).toBeGreaterThan(1);
        });

        test("should work with string arrays", () => {
            const array = new Arr([ "a", "b", "c", "d", "e" ]);
            const result = array.random(3);

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(3);

            for (const element of result) {
                expect([ "a", "b", "c", "d", "e" ]).toContain(element);
            }

            // Check uniqueness
            expect(new Set(result).size).toBe(3);
        });

        test("should work with object arrays", () => {
            const object1 = { id: 1 };
            const object2 = { id: 2 };
            const object3 = { id: 3 };
            const object4 = { id: 4 };
            const array = new Arr([ object1, object2, object3, object4 ]);
            const result = array.random(2);

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(2);

            for (const element of result) {
                expect([ object1, object2, object3, object4 ]).toContain(element);
            }

            // Check uniqueness
            expect(new Set(result).size).toBe(2);
        });
    });

    describe("validation errors", () => {
        test("should throw InvalidArgumentException when length is NaN", () => {
            const array = new Arr([ 1, 2, 3 ]);

            expect(() => {
                array.random(Number.NaN);
            }).toThrow(InvalidArgumentException);
        });

        test("should throw InvalidArgumentException when length is less than 1", () => {
            const array = new Arr([ 1, 2, 3 ]);

            expect(() => {
                array.random(0);
            }).toThrow(InvalidArgumentException);

            expect(() => {
                array.random(-1);
            }).toThrow(InvalidArgumentException);
        });

        test("should throw InvalidArgumentException when length exceeds array length", () => {
            const array = new Arr([ 1, 2, 3 ]);

            expect(() => {
                array.random(4);
            }).toThrow(InvalidArgumentException);

            expect(() => {
                array.random(10);
            }).toThrow(InvalidArgumentException);
        });

        test("should throw InvalidArgumentException with correct message", () => {
            const array = new Arr([ 1, 2, 3 ]);

            expect(() => {
                array.random(5);
            }).toThrow("Argument #1 (length) must be between 1 and 3");
        });
    });

    describe("edge cases", () => {
        test("should handle array with duplicate values", () => {
            const array = new Arr([ 1, 1, 2, 2, 3, 3 ]);
            const result = array.random(3);

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(3);

            // Elements should be from original array
            for (const element of result) {
                expect([ 1, 2, 3 ]).toContain(element);
            }
        });

        test("should return multiple elements from large array", () => {
            const largeArray = Array.from({ length: 1000 }, (_unused, index) => index);
            const array = new Arr(largeArray);
            const result = array.random(100);

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(100);

            // Check uniqueness
            expect(new Set(result).size).toBe(100);

            // Check all elements are valid
            for (const element of result) {
                expect(element).toBeGreaterThanOrEqual(0);
                expect(element).toBeLessThan(1000);
            }
        });
    });
});
