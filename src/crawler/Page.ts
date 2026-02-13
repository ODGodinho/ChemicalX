import {
    ContextChemicalXInterface,
    ContextEngineInterface,
    type GetterAccessInterface,
    ODGDecorators,
    type PageChemicalXInterface,
    type PageEngineInterface,
} from "..";

@ODGDecorators.getterAccess()
export class Page<
    ContextClassEngine extends ContextEngineInterface,
    PageClassEngine extends PageEngineInterface,
> implements GetterAccessInterface, PageChemicalXInterface<PageClassEngine> {

    public constructor(
        public readonly $context: ContextChemicalXInterface<ContextClassEngine>,
        public readonly $pageInstance: PageClassEngine,
    ) {

    }

    public context(): ContextChemicalXInterface<ContextClassEngine> & ContextClassEngine {
        return this.$context as ContextChemicalXInterface<ContextClassEngine> & ContextClassEngine;
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
