import { getAccessDecorator } from "@support/Decorators";

import {
    type PageOptionsLibraryInterface,
    type ContextChemicalXInterface,
    type ContextEngineInterface,
    type CreatePageFactoryType,
    type GetterAccessInterface,
    type PageChemicalXInterface,
    type PageEngineInterface,
} from "..";

@getAccessDecorator()
export class Context<
    ContextEngineType extends ContextEngineInterface,
    PageEngineType extends PageEngineInterface,
> implements GetterAccessInterface, ContextChemicalXInterface<ContextEngineType> {

    public constructor(
        public readonly $contextInstance: ContextEngineType,
        public readonly $newPage: CreatePageFactoryType<PageEngineType>,
    ) {

    }

    public async defaultPageOptions(): Promise<PageOptionsLibraryInterface> {
        return {
        };
    }

    public async newPage(
        options?: Record<string, unknown>,
    ): Promise<PageChemicalXInterface<PageEngineType> & PageEngineType> {
        return this.$newPage(
            await this.$contextInstance.newPage(this.$contextInstance, {
                ...await this.defaultPageOptions(),
                ...options,
            }) as PageEngineType,
        ) as PageChemicalXInterface<PageEngineType> & PageEngineType;
    }

    public __get(key: PropertyKey): unknown {
        if (key in this) {
            return Reflect.get(this, key);
        }

        const propertyClass = (this.$contextInstance as Record<PropertyKey, unknown>)[key];

        return typeof propertyClass === "function"
            ? propertyClass.bind(this.$contextInstance)
            : Reflect.get(this.$contextInstance, key);
    }

}
