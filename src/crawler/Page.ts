import {
    ContextChemicalXInterface,
    ContextEngineInterface,
    type GetterAccessInterface, type PageChemicalXInterface,
    type PageEngineInterface,
    getAccessDecorator,
} from "..";

@getAccessDecorator()
export class Page<
    ContextEngineType extends ContextEngineInterface,
    PageEngineType extends PageEngineInterface,
> implements GetterAccessInterface, PageChemicalXInterface<PageEngineType> {

    public constructor(
        public readonly $context: ContextChemicalXInterface<ContextEngineType>,
        public readonly $pageInstance: PageEngineType,
    ) {

    }

    public context(): ContextChemicalXInterface<ContextEngineType> {
        return this.$context;
    }

    public __get(key: PropertyKey): unknown {
        if (key in this) {
            return Reflect.get(this, key);
        }

        const propertyClass = (this.$pageInstance as Record<PropertyKey, unknown>)[key];

        return typeof propertyClass === "function"
            ? propertyClass.bind(this.$pageInstance)
            : Reflect.get(this.$pageInstance, key);
    }

}
