import { randomInt } from "node:crypto";

import { InvalidArgumentException } from "@exceptions";

import type { CloneableInterface } from "../Interfaces";

/**
 * Arr Class Helper
 *
 * @template {unknown[]} Type - The array type. Use `Type[number]` to reference the element type.
 * @class Arr
 * @implements {CloneableInterface}
 */
export class Arr<Type extends unknown[]> implements CloneableInterface {

    public constructor(
        private readonly subject: Type,
    ) {
    }

    public clone(): Arr<Array<Type[number]>> {
        return new Arr<Array<Type[number]>>([ ...this.subject ]);
    }

    /**
     * Returns random element(s) from the array.
     *
     * @param {number} length The number of elements to return.
     * @throws {InvalidArgumentException} If length is invalid or exceeds array length.
     * @returns {Array<Type[number]>} Return undefined if array is empty
     */
    public random(length: number = 1): Array<Type[number]> {
        if (this.subject.length === 0) {
            throw new InvalidArgumentException(
                "Cannot get random element(s) from an empty array",
            );
        }

        if (Number.isNaN(length) || length < 1 || length > this.subject.length) {
            throw new InvalidArgumentException(
                `Argument #1 (length) must be between 1 and ${this.subject.length}`,
            );
        }

        const indices = Array.from({ length: this.subject.length }, (_unused, index) => index);

        for (let index = indices.length - 1; index > indices.length - length - 1; index--) {
            const randomIndex = randomInt(0, index + 1);

            [ indices[randomIndex], indices[index] ] = [ indices[index], indices[randomIndex] ];
        }

        return indices.slice(-length).map((index) => this.subject[index]);
    }

    /**
     * Get Array Class Properties
     *
     * @memberof Arr
     * @returns {Type}
     */
    public toArray(): Type {
        return this.subject;
    }

}
