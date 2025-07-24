import { ODGDecorators } from "src";
import { Container } from "src/Container";
import "./Pages/ExamplePage";

describe("Container Test", () => {
    test("Test new Container", async () => {
        const exampleContainer = "ExamplePage";
        const container = new Container<{
            [exampleContainer](page: unknown): { page: unknown };
        }>();

        container.load(ODGDecorators.loadModule(container));
        expect(() => container.get(exampleContainer)).not.toThrow();
        const factory = container.get(exampleContainer);
        expect(factory(123).page).toBe(123);
    });
    test("Test Clear Metadata", async () => {
        const container = new Container();

        Reflect.defineMetadata(ODGDecorators["metaData"], undefined, Reflect);
        const loader = ODGDecorators.loadModule(container);

        expect(() => {
            container.load(loader);
        }).not.toThrow();
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
