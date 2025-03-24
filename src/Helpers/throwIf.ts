import { type Exception } from "@odg/exception";

export function throwIf(
    condition: true,
    exception: () => Exception,
): never;

export function throwIf(
    condition: false,
    exception: () => Exception,
): void;

export function throwIf(
    condition: boolean,
    exception: () => Exception,
): never | void;

/**
 * The throw_if function throws the given exception
 * if a given boolean expression evaluates to true:
 *
 * @param {boolean} condition sleep time in milliseconds
 * @param {() => Exception} exception sleep time in milliseconds
 * @throws {Exception} If given true in condition
 * @returns {never | void}
 */
export function throwIf(condition: boolean, exception: () => Exception): never | void {
    if (condition) {
        throw exception();
    }
}
