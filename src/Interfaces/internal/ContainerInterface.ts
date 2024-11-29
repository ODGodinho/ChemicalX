export interface ContainerMetadataInterface {
    name: string;
    target: new () => unknown;
}
