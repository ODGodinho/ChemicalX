import type * as ContainerMetadata from "@interfaces/internal/ContainerInterface";

export class ContainerMetadataClass implements ContainerMetadata.ContainerMetadataInterface {

    public name: string = "example";

    public target: new () => unknown = ContainerMetadataClass;

}
