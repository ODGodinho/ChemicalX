/**
 * Is Native Variable
 *
 * @template {any} Type Example number, string, boolean
 * @interface Native
 */
export interface NativeInterface<Type> {

    /**
     * Convert To Native Variable
     *
     * @returns {Type}
     */
    toNative(): Type;
}
