import type { CloneableInterface, NativeInterface } from "../Interfaces";

/**
 * Class Helper to manipulate number
 *
 * @class Str
 * @implements {CloneableInterface}
 * @implements {NativeInterface<string>}
 */
export class Num implements CloneableInterface, NativeInterface<number> {

    public constructor(
        private readonly subject: number,
    ) {
    }

    /**
     * Clone This Object
     *
     * @returns {Num}
     */
    public clone(): Num {
        return new Num(this.subject);
    }

    /**
     * Convert To Number
     *
     * @returns {number}
     */
    public toNative(): number {
        return this.subject;
    }

    /**
     * Convert To Number
     *
     * @returns {number}
     */
    public toNumber(): number {
        return this.subject;
    }

}
