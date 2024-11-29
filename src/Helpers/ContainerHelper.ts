import {
    type Container, ContainerModule,
    decorate,
    injectable,
} from "inversify";

import { type ContainerMetadataInterface } from "../Interfaces/internal/ContainerInterface";
import "reflect-metadata";

export class ContainerHelper {

    protected static readonly metaData: string = "odg:bind-page-metadata";

    public static injectablePage(name: string): CallableFunction {
        return (target: object) => {
            decorate(injectable(), target);
            const previousMetadata = Reflect.getMetadata(ContainerHelper.metaData, Reflect) as [] | undefined;

            const newMetadata = [ {
                target,
                name,
            }, ...previousMetadata ?? [] ];
            Reflect.defineMetadata(ContainerHelper.metaData, newMetadata, Reflect);
        };
    }

    public static loadModule(containerInstance: Container): ContainerModule {
        return new ContainerModule(() => {
            const provideMetadata = Reflect.getMetadata(
                ContainerHelper.metaData,
                Reflect,
            ) as ContainerMetadataInterface[] | undefined ?? [];

            for (const metadata of provideMetadata) {
                containerInstance.bind(metadata.name)
                    .toFactory(() => ContainerHelper.bindPage(metadata, containerInstance));
            }
        });
    }

    private static bindPage(metadata: ContainerMetadataInterface, containerInstance: Container) {
        return (page: unknown): unknown => {
            const container = `PageOrHandler${metadata.name}`;
            containerInstance.bind(container).to(metadata.target);
            const value = containerInstance.get(container);
            containerInstance.unbind(container);
            (value as { page: unknown }).page = page;

            return value;
        };
    }

}
