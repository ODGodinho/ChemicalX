import type { GetterAccessInterface } from "@interfaces";
import { ODGDecorators } from "@support/Decorators";

import {
    CreateContextFactoryType,
    CreatePageFactoryType,
    type BrowserChemicalXInterface,
    type BrowserEngineInterface,
    type ContextChemicalXInterface,
    type ContextEngineInterface,
    type ContextOptionsLibraryInterface,
    type PageEngineInterface,
} from ".";

@ODGDecorators.getterAccess()
export class Browser<
    BrowserClassEngine extends BrowserEngineInterface,
    ContextClassEngine extends ContextEngineInterface,
    PageClassEngine extends PageEngineInterface,
> implements GetterAccessInterface, BrowserChemicalXInterface<BrowserClassEngine, ContextClassEngine> {

    public constructor(
        public readonly $browserInstance: BrowserClassEngine,
        private readonly $newContext: CreateContextFactoryType<ContextClassEngine, PageClassEngine>,
        private readonly $newPage: CreatePageFactoryType<
            ContextChemicalXInterface<ContextClassEngine>,
            PageClassEngine
        >,
    ) {

    }

    public async defaultContextOptions(): Promise<ContextOptionsLibraryInterface> {
        return {
        };
    }

    public async newContext(
        options?: ContextOptionsLibraryInterface,
    ): Promise<ContextChemicalXInterface<ContextClassEngine> & ContextClassEngine> {
        const makeContext = (
            this.$browserInstance.newContext
            ?? this.$browserInstance.createIncognitoBrowserContext
            ?? this.$browserInstance.createBrowserContext
        ) as (...arguments_: unknown[]) => Promise<ContextClassEngine>;

        return this.$newContext(
            await makeContext.call(this.$browserInstance, {
                ...await this.defaultContextOptions(),
                ...options,
            }),
            this.$newPage,
        ) as ContextChemicalXInterface<ContextClassEngine> & ContextClassEngine;
    }

    public contexts(): Array<ContextChemicalXInterface<ContextClassEngine> & ContextClassEngine> {
        const defaultContext = "contexts" in this.$browserInstance
            && typeof this.$browserInstance.contexts === "function"
            && (this.$browserInstance.contexts as () => ContextClassEngine[])();
        const contexts = defaultContext || [];

        return contexts.map((context) => this.$newContext(
            context,
            this.$newPage,
        ) as ContextChemicalXInterface<ContextClassEngine> & ContextClassEngine);
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
