import { type CloneableInterface, type NativeInterface } from "..";
import { MoneyNotFoundException } from "../Exceptions";
import { MoneyMultipleResultException } from "../Exceptions/MoneyMultipleResultException";

import { Arr } from "./Arr";
import { Num } from "./Num";

/**
 * Class Helper to manipulate string
 *
 * @class Str
 * @implements {CloneableInterface}
 * @implements {NativeInterface<string>}
 */
export class Str implements CloneableInterface, NativeInterface<string> {

    // eslint-disable-next-line security/detect-unsafe-regex
    private readonly moneyRegex = /(?<value>\d+)(?:[,.]\d{3})*(?<blockCents>(?<separatorCent>[,.])(?<cents>\d{1,2}))?/;

    public constructor(
        private subject: string,
    ) { }

    /**
     * Get a money value from a string and return a Num class
     * "$ 122.324,43" => 122_324.43
     * "$ 122,324.43" => 122_324.43
     *
     * @throws {MoneyNotFoundException} If no money value is found
     * @throws {MoneyMultipleResultException} If multiple money values are found
     * @returns {Num} Num Class with the money value
     */
    public money(): Num {
        const match = this.subject.match(this.moneyRegex) ?? undefined;

        if (!match?.groups) throw new MoneyNotFoundException("No results found");
        if (this.moneyAllOccurrences().length > 1) throw new MoneyMultipleResultException("Multiple results found");

        const centLength = (match.groups.cents as string | undefined)?.length ?? 0;
        const stringCurrent = new Str(match[0]).onlyNumbers().toString();

        return new Num(
            +(`${stringCurrent.slice(0, Math.max(0, stringCurrent.length - centLength))}`
                + `${match.groups.separatorCent ? "." : ""}`
                + `${match.groups.separatorCent ? stringCurrent.slice(stringCurrent.length - centLength) : ""}`),
        );
    }

    /**
     * Get all money values from a string and return a Arr<Num[]>
     * "$ 122.324,43" => 122_324.43
     * "$ 122,324.43" => 122_324.43
     *
     * @throws {MoneyNotFoundException} If no money value is found
     * @throws {MoneyMultipleResultException} If multiple money values are found
     * @returns {Arr<Num[]>} Num Class with the money value
     */
    public moneys(): Arr<Num[]> {
        return new Arr<Num[]>(
            this.moneyAllOccurrences()
                .map((match) => new Str(match).money()),
        );
    }

    /**
     * Extract Only Numbers of string
     * `abc 123.34 def` -> `12334`
     *
     * @returns {this}
     */
    public onlyNumbers(): this {
        this.subject = this.subject.replaceAll(/\D/g, "");

        return this;
    }

    /**
     * Extract Only [a-zA-Z0-9_] of string
     * `abc 123.34 def` -> `abc12334def`
     *
     * @returns {this}
     */
    public onlyWordsCaracteres(): this {
        this.subject = this.subject.replaceAll(/\W/g, "");

        return this;
    }

    /**
     * Replace variable of string with value
     *
     * - {{ variable }}
     * - {{variable}}
     *
     * @returns {this}
     */
    public formatUnicorn(data: Record<string, number | string>): this {
        for (const key in data) {
            this.subject = this.subject.replaceAll(
                // eslint-disable-next-line security/detect-non-literal-regexp
                new RegExp(`\\{\\{\\s*${key.toString()}\\s*\\}\\}`, "gi"),
                String(data[key]),
            );
        }

        return this;
    }

    /**
     * Make a string's first character uppercase.
     *
     * @returns {this}
     */
    public ucFirst(): this {
        this.subject = this.subject.charAt(0).toUpperCase() + this.subject.slice(1);

        return this;
    }

    /**
     * Convert To Number
     *
     * @returns {string}
     */
    public toNative(): string {
        return this.subject;
    }

    /**
     * Clone This Object
     *
     * @returns {Str}
     */
    public clone(): Str {
        return new Str(this.subject);
    }

    /**
     * Convert To String
     *
     * @returns {string}
     */
    public toString(): string {
        return this.subject;
    }

    /**
     * Return all occurrences from moneyRegex.
     *
     * @returns {never[] | RegExpMatchArray}
     */
    private moneyAllOccurrences(): never[] | RegExpMatchArray {
        // eslint-disable-next-line security/detect-non-literal-regexp
        return this.subject.match(new RegExp(this.moneyRegex, "g")) ?? [];
    }

}
