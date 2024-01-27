import { type GetterAccessInterface } from "@interfaces";
import { getAccessDecorator } from "@support/Decorators";

import {
    type BrowserChemicalXInterface, type ContextChemicalXInterface,
    type ContextEngineInterface, type ContextOptionsLibraryInterface,
    type PageEngineInterface,
    CreateContextFactoryType, CreatePageFactoryType, type BrowserEngineInterface,
} from ".";

@getAccessDecorator()
export class Browser<
    BrowserEngineType extends BrowserEngineInterface,
    ContextEngineType extends ContextEngineInterface,
    PageEngineType extends PageEngineInterface,
> implements GetterAccessInterface, BrowserChemicalXInterface<BrowserEngineType, ContextEngineType> {

    public constructor(
        public readonly $browserInstance: BrowserEngineType,
        private readonly $newContext: CreateContextFactoryType<ContextEngineType, PageEngineType>,
        private readonly $newPage: CreatePageFactoryType<PageEngineType>,
    ) {

    }

    public async defaultContextOptions(): Promise<ContextOptionsLibraryInterface> {
        return {
        };
    }

    public async newContext(
        options?: ContextOptionsLibraryInterface,
    ): Promise<ContextChemicalXInterface<ContextEngineType> & ContextEngineType> {
        const makeContext = (
            this.$browserInstance.newContext ?? this.$browserInstance.createIncognitoBrowserContext!
        ) as (...arguments_: unknown[]) => Promise<ContextEngineType>;

        return this.$newContext(
            await makeContext.call(this.$browserInstance, {
                ...await this.defaultContextOptions(),
                options,
            }),
            this.$newPage,
        ) as ContextChemicalXInterface<ContextEngineType> & ContextEngineType;
    }

    public __get(key: PropertyKey): unknown {
        if (key in this) {
            return Reflect.get(this, key);
        }

        const propertyClass = (this.$browserInstance as Record<PropertyKey, unknown>)[key];

        return typeof propertyClass === "function"
            ? propertyClass.bind(this.$browserInstance)
            : Reflect.get(this.$browserInstance, key);
    }

}
