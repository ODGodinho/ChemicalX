/**
 * Is Native Variable
 *
 * @interface Native
 * @template {any} Type Example number, string, boolean
 */
export interface NativeInterface<Type> {

    /**
     * Convert To Native Variable
     *
     * @returns {Type}
     */
    toNative(): Type;
}
