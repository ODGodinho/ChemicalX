import {
    type BrowserChemicalXInterface,
    type BrowserEngineInterface,
} from "./@types/Browser";
import {
    type ContextChemicalXInterface,
    type ContextEngineInterface,
} from "./@types/Context";
import {
    type PageChemicalXInterface,
    type PageChemicalXConstructorTypo,
    type PageEngineInterface,
} from "./@types/Page";

export abstract class Page<
    BrowserTypeEngine,
    BrowserClassEngine extends BrowserEngineInterface,
    ContextClassEngine extends ContextEngineInterface,
    PageClassEngine extends PageEngineInterface,
> implements PageChemicalXInterface<PageClassEngine> {

    public $pageInstance!: PageClassEngine;

    public constructor(
        public readonly $browserInstance: BrowserChemicalXInterface<BrowserClassEngine, ContextClassEngine>,
        public readonly $contextClass: ContextChemicalXInterface<ContextClassEngine>,
        public readonly $pageClass:
        PageChemicalXConstructorTypo<BrowserTypeEngine, BrowserClassEngine, ContextClassEngine, PageClassEngine>,
    ) {
    }

    public static async create<
        BrowserTypeEngine,
        BrowserClassEngine extends BrowserEngineInterface,
        ContextClassEngine extends ContextEngineInterface,
        PageClassEngine extends PageEngineInterface,
    >(
        $browserInstance: BrowserChemicalXInterface<BrowserClassEngine, ContextClassEngine>,
        $contextClass: ContextChemicalXInterface<ContextClassEngine>,
        $pageClass: PageChemicalXConstructorTypo<
            BrowserTypeEngine, BrowserClassEngine, ContextClassEngine, PageClassEngine
        >,
    ): Promise<PageChemicalXInterface<PageClassEngine> & PageClassEngine> {
        const pageInstance = new $pageClass(
            $browserInstance,
            $contextClass,
            $pageClass,
        );
        pageInstance.$pageInstance = await $contextClass.$contextInstance.newPage() as unknown as PageClassEngine;

        return new Proxy(pageInstance, {
            get(
                target: Page<BrowserTypeEngine, BrowserClassEngine, ContextClassEngine, PageClassEngine>,
                property: string,
            ): unknown {
                if (property in target) {
                    return Reflect.get(target, property);
                }

                const propertyClass = (pageInstance.$pageInstance as Record<string, unknown>)[property];

                return typeof propertyClass === "function"
                    ? propertyClass.bind(pageInstance.$pageInstance)
                    : Reflect.get(pageInstance.$pageInstance, property);
            },
        }) as PageChemicalXInterface<PageClassEngine> & PageClassEngine;
    }

}
