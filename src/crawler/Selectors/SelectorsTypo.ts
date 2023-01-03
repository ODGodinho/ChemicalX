export type SelectorValuesType = Record<string, SelectorType | string> | string;

export interface SelectorType extends Record<string, SelectorValuesType> {
}
