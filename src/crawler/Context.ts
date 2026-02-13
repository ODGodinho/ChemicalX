import {
    ODGDecorators,
    type ContextChemicalXInterface,
    type ContextEngineInterface,
    type CreatePageFactoryType,
    type GetterAccessInterface,
    type PageChemicalXInterface,
    type PageEngineInterface,
    type PageOptionsLibraryInterface,
} from "..";

@ODGDecorators.getterAccess()
export class Context<
    ContextClassEngine extends ContextEngineInterface,
    PageClassEngine extends PageEngineInterface,
> implements GetterAccessInterface, ContextChemicalXInterface<ContextClassEngine> {

    public constructor(
        public readonly $contextInstance: ContextClassEngine,
        public readonly $newPage: CreatePageFactoryType<ContextChemicalXInterface<ContextClassEngine>, PageClassEngine>,
    ) {

    }

    public async defaultPageOptions(): Promise<PageOptionsLibraryInterface> {
        return {
        };
    }

    public async newPage(
        options?: Record<string, unknown>,
    ): Promise<PageChemicalXInterface<PageClassEngine> & PageClassEngine> {
        return this.$newPage(
            this,
            await (this.$contextInstance.newPage as (...itens: unknown[]) => Promise<PageClassEngine>)(
                this.$contextInstance,
                {
                    ...await this.defaultPageOptions(),
                    ...options,
                },
            ),
        ) as PageChemicalXInterface<PageClassEngine> & PageClassEngine;
    }

    public pages(): Array<PageChemicalXInterface<PageClassEngine> & PageClassEngine> {
        const pages = (this.$contextInstance.pages as () => PageClassEngine[])();

        return pages.map((page) => this.$newPage(
            this,
            page,
        ) as PageChemicalXInterface<PageClassEngine> & PageClassEngine);
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
