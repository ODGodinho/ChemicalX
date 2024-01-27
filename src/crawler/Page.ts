import {
    type GetterAccessInterface, type PageChemicalXInterface,
    type PageEngineInterface,
} from "..";
import { getAccessDecorator } from "..";

@getAccessDecorator()
export class Page<
    PageEngineType extends PageEngineInterface,
> implements GetterAccessInterface, PageChemicalXInterface<PageEngineType> {

    public constructor(
        public readonly $pageInstance: PageEngineType,
    ) {

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
