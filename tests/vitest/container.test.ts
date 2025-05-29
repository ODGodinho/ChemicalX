import { Container } from "inversify";

import "./Pages/ExamplePage";
import { ODGDecorators } from "src";

describe("Container Test", () => {
    test("Test new Container", async () => {
        const container = new Container();

        const loader = ODGDecorators.loadModule(container);
        container.load(loader);
        expect(() => container.get("ExamplePage")).not.toThrow();
        const factory = container.get<(page: unknown) => { page: unknown }>("ExamplePage");
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
});
