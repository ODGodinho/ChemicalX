/* eslint-disable @typescript-eslint/sort-type-constituents */
import {
    type BrowserOptionsLibraryInterface,
    type BrowserChemicalXInterface,
    type BrowserChemicalXConstructorTypo,
    type BrowserEngineInterface,
} from "./@types/Browser";
import {
    type ContextChemicalXInterface,
    type ContextEngineInterface,
    type ContextOptionsLibraryInterface,
    type ContextChemicalXConstructorTypo,
} from "./@types/Context";
import { type PageEngineInterface, type PageChemicalXConstructorTypo } from "./@types/Page";
import { Context } from "./Context";
import { BrowserInstanceException } from "./Exceptions/BrowserInstanceException";

export abstract class Browser<
    BrowserTypeEngine,
    BrowserClassEngine extends BrowserEngineInterface,
    ContextClassEngine extends ContextEngineInterface,
    PageClassEngine extends PageEngineInterface,
> implements BrowserChemicalXInterface<BrowserClassEngine, ContextClassEngine> {

    public $browserInstance!: BrowserClassEngine;

    public constructor(
        public readonly $browserEngine: BrowserTypeEngine,
        public readonly $browserClass: BrowserChemicalXConstructorTypo<
            BrowserTypeEngine, BrowserClassEngine, ContextClassEngine, PageClassEngine
        >,
        public readonly $contextClass: ContextChemicalXConstructorTypo<
            BrowserTypeEngine, BrowserClassEngine, ContextClassEngine, PageClassEngine
        >,
        public readonly $pageClass: PageChemicalXConstructorTypo<
            BrowserTypeEngine, BrowserClassEngine, ContextClassEngine, PageClassEngine
        >,
    ) {
    }

    public static create<
        BrowserTypeEngine,
        BrowserClassEngine extends BrowserEngineInterface,
        ContextClassEngine extends ContextEngineInterface,
        PageClassEngine extends PageEngineInterface,
    >(
        $browserEngine: BrowserTypeEngine,
        $browserClass: BrowserChemicalXConstructorTypo<
            BrowserTypeEngine, BrowserClassEngine, ContextClassEngine, PageClassEngine
        >,
        $contextClass: ContextChemicalXConstructorTypo<
            BrowserTypeEngine, BrowserClassEngine, ContextClassEngine, PageClassEngine
        >,
        $pageClass: PageChemicalXConstructorTypo<
            BrowserTypeEngine, BrowserClassEngine, ContextClassEngine, PageClassEngine
        >,
    ): BrowserClassEngine & BrowserChemicalXInterface<BrowserClassEngine, ContextClassEngine> {
        const browserInstance = new $browserClass(
            $browserEngine,
            $browserClass,
            $contextClass,
            $pageClass,
        );

        return new Proxy(browserInstance, {
            get(
                target: BrowserChemicalXInterface<BrowserClassEngine, ContextClassEngine>,
                property: string,
            ): unknown {
                if (property in target) {
                    return Reflect.get(target, property);
                }

                if (!(target.$browserInstance as unknown)) {
                    throw new BrowserInstanceException("use browser.setUp() to init browser");
                }

                const propertyClass = (target.$browserInstance as Record<string, unknown>)[property];

                return typeof propertyClass === "function"
                    ? propertyClass.bind(target.$browserInstance)
                    : Reflect.get(target.$browserInstance, property);
            },
        }) as BrowserChemicalXInterface<BrowserClassEngine, ContextClassEngine> & BrowserClassEngine;
    }

    public async browserOptions(): Promise<BrowserOptionsLibraryInterface> {
        return {
            headless: false,
        };
    }

    public async newContext(
        options?: ContextOptionsLibraryInterface,
    ): Promise<ContextChemicalXInterface<ContextClassEngine> & ContextClassEngine> {
        return Context.create(
            this,
            this.$contextClass,
            this.$pageClass,
            options,
        );
    }

    public abstract setUp(): Promise<this>;

}
