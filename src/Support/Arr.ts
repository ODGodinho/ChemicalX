import { type CloneableInterface } from "../Interfaces";

/**
 * Arr Class Helper
 *
 * @template {any[]} Type Array Type
 * @class Arr
 * @implements {CloneableInterface}
 */
export class Arr<Type extends unknown[]> implements CloneableInterface {

    public constructor(
        private readonly subject: Type,
    ) { }

    /**
     * Clone This Object
     *
     * @memberof Arr
     * @returns {Arr<Array<Type[number]>>}
     */
    public clone(): Arr<Array<Type[number]>> {
        return new Arr([ ...this.subject ]);
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
