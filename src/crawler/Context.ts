import {
    type BrowserChemicalXInterface,
    type BrowserEngineInterface,
} from "./@types/Browser";
import {
    type ContextChemicalXInterface,
    type ContextOptionsLibraryInterface,
    type ContextChemicalXConstructorTypo,
    type ContextEngineInterface,
} from "./@types/Context";
import {
    type PageChemicalXInterface,
    type PageChemicalXConstructorTypo,
    type PageEngineInterface,
} from "./@types/Page";
import { Page } from "./Page";

export abstract class Context<
    BrowserTypeEngine,
    BrowserClassEngine extends BrowserEngineInterface,
    ContextClassEngine extends ContextEngineInterface,
    PageClassEngine extends PageEngineInterface,
> implements ContextChemicalXInterface<ContextClassEngine> {

    public $contextInstance!: ContextClassEngine;

    public constructor(
        public readonly $browserInstance: BrowserChemicalXInterface<BrowserClassEngine, ContextClassEngine>,
        public readonly $contextClass:
        ContextChemicalXConstructorTypo<BrowserTypeEngine, BrowserClassEngine, ContextClassEngine, PageClassEngine>,
        public readonly $pageClass:
        PageChemicalXConstructorTypo<BrowserTypeEngine, BrowserClassEngine, ContextClassEngine, PageClassEngine>,
        public readonly $options?: ContextOptionsLibraryInterface,
    ) {
    }

    public static async create<
        BrowserTypeEngine,
        BrowserClassEngine extends BrowserEngineInterface,
        ContextClassEngine extends ContextEngineInterface,
        PageClassEngine extends PageEngineInterface,
    >(
        $browserInstance: BrowserChemicalXInterface<BrowserClassEngine, ContextClassEngine>,
        $contextClass: ContextChemicalXConstructorTypo<
            BrowserTypeEngine, BrowserClassEngine, ContextClassEngine, PageClassEngine
        >,
        $pageClass: PageChemicalXConstructorTypo<
            BrowserTypeEngine, BrowserClassEngine, ContextClassEngine, PageClassEngine
        >,
        $options?: ContextOptionsLibraryInterface,
    ): Promise<ContextChemicalXInterface<ContextClassEngine> & ContextClassEngine> {
        const contextInstance = new $contextClass(
            $browserInstance,
            $contextClass,
            $pageClass,
            $options,
        );

        const prepareContext = (
            $browserInstance.$browserInstance.newContext
            ?? $browserInstance.$browserInstance.createIncognitoBrowserContext
        ) as unknown as (options: ContextOptionsLibraryInterface) => Promise<ContextClassEngine>;
        contextInstance.$contextInstance = await prepareContext.call($browserInstance.$browserInstance, {
            ...await contextInstance.contextOptions(),
            ...$options,
        });

        return new Proxy(contextInstance, {
            get(
                target: Context<
                BrowserTypeEngine,
                BrowserClassEngine,
                ContextClassEngine,
                PageClassEngine
                >,
                property: string,
            ): unknown {
                if (property in target) {
                    return Reflect.get(target, property);
                }

                const propertyClass = (contextInstance.$contextInstance as Record<string, unknown>)[property];

                return typeof propertyClass === "function"
                    ? propertyClass.bind(contextInstance.$contextInstance)
                    : Reflect.get(contextInstance.$contextInstance, property);
            },
        }) as ContextChemicalXInterface<ContextClassEngine> & ContextClassEngine;
    }

    public async contextOptions(): Promise<ContextOptionsLibraryInterface> {
        return {
            timeout: 30_000,
        };
    }

    public async newPage(): Promise<PageChemicalXInterface<PageClassEngine> & PageEngineInterface> {
        return Page.create(
            this.$browserInstance,
            this,
            this.$pageClass,
        );
    }

}
