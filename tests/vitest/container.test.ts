import { Container } from "inversify";

import { ContainerHelper } from "@helpers/ContainerHelper";
import "./Pages/ExamplePage";

describe("Container Test", () => {
    test("Test new Container", async () => {
        const container = new Container();

        const loader = ContainerHelper.loadModule(container);
        container.load(loader);
        expect(() => container.get("ExamplePage")).not.toThrow();
        const factory = container.get<(page: unknown) => { page: unknown }>("ExamplePage");
        expect(factory(123).page).toBe(123);
    });
    test("Test Clear Metadata", async () => {
        const container = new Container();

        Reflect.defineMetadata(ContainerHelper["metaData"], undefined, Reflect);
        const loader = ContainerHelper.loadModule(container);

        expect(() => {
            container.load(loader);
        }).not.toThrow();
    });
});
