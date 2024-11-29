import { ContainerMetadataClass } from "./ContainerMetadataClass";

describe("Container Test", () => {
    test("Test new Container", async () => {
        const instance = new ContainerMetadataClass();
        expect(instance.name).equal("example");
    });
});
