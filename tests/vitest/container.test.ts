import { type BasePage, type PageEngineInterface, ODGDecorators } from "src";
import { Container } from "src/Container";
import "./Pages/mocks/ExamplePage";

describe("Container Test", () => {
    test("Test new Container", async () => {
        const exampleContainer = "ExamplePage";
        const container = new Container<{
            [exampleContainer]: BasePage<PageEngineInterface>;
        }>();

        await container.load(ODGDecorators.loadModule(container));
        expect(() => container.get(exampleContainer)).not.toThrow();

        const examplePageInstance = container.get(exampleContainer);

        expect(examplePageInstance.page).toBe(undefined);
        examplePageInstance.setPage(123 as unknown as PageEngineInterface);
        expect(examplePageInstance.page).toBe(123);

        const examplePageInstance2 = container.get(exampleContainer);

        expect(examplePageInstance2.page).toBe(undefined);
        examplePageInstance2.setPage(345 as unknown as PageEngineInterface);
        expect(examplePageInstance2.page).not.toBe(examplePageInstance.page);
    });

    test("Test Clear Metadata", async () => {
        const container = new Container();

        Reflect.defineMetadata(ODGDecorators["metaDataPageOrHandler"], undefined, Reflect);
        const loader = ODGDecorators.loadModule(container);

        await expect((async (): Promise<void> => {
            await container.load(loader);
        })()).resolves.not.toThrow();
    });

    test("Test getOptional", async () => {
        const container = new Container();

        expect(container.getOptional("optional")).toBeUndefined();

        container.bind("optional").toConstantValue("exists");
        expect(container.getOptional("optional")).toBe("exists");
    });

    test("Test getAsync", async () => {
        const container = new Container();

        container.bind("async").toConstantValue(Promise.resolve("async-data"));
        await expect(container.getAsync("async")).resolves.toBe("async-data");
    });
});
