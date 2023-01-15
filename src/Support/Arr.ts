import { type CloneableInterface } from "../Interfaces";

/**
 * Arr Class Helper
 *
 * @class Arr
 * @implements {CloneableInterface}
 * @template {any[]} Type Array Type
 */
export class Arr<Type extends unknown[]> implements CloneableInterface {

    public constructor(
        private readonly subject: Type,
    ) { }

    /**
     * Clone This Object
     *
     * @returns {Arr<Array<Type[number]>>}
     * @memberof Arr
     */
    public clone(): Arr<Array<Type[number]>> {
        return new Arr([ ...this.subject ]);
    }

    /**
     * Get Array Class Properties
     *
     * @returns {Type}
     * @memberof Arr
     */
    public toArray(): Type {
        return this.subject;
    }

}
