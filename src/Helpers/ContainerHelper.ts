import {
    type EventListener,
    type EventListenerNotation, type EventObjectType,
    type EventNameType, type EventOptions,
} from "@odg/events";
import {
    type Container, ContainerModule,
    decorate,
    injectable,
} from "inversify";

import { type ContainerMetadataInterface } from "../Interfaces/internal/ContainerInterface";

import "reflect-metadata";

export class ContainerHelper {

    protected static readonly metaData: string = "odg:bind-page-metadata";

    protected static readonly metaDataEvent: string = "odg:bind-events-metadata";

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

    public static registerListener(
        eventName: EventNameType,
        containerName: string,
        options: EventOptions,
    ): CallableFunction {
        return () => {
            const previousMetadata = this.getReflectEvents();
            previousMetadata[eventName] ??= [];
            previousMetadata[eventName].push({
                containerName: containerName,
                options: options,
            });

            Reflect.defineMetadata(ContainerHelper.metaDataEvent, previousMetadata, Reflect);
        };
    }

    public static getEvents<Events extends EventObjectType>(
        containerInstance: Container,
    ): EventListener<Events, keyof Events> {
        const allEvents = this.getReflectEvents();
        for (const [ , listeners ] of Object.entries(allEvents)) {
            for (const listener of listeners) {
                listener.listener = containerInstance.get(listener.containerName);
            }
        }

        return allEvents as EventListener<Events, keyof Events>;
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

    private static getReflectEvents<Events extends EventObjectType>(): EventListenerNotation<Events, keyof Events> {
        const defaultItens = {} as unknown as EventListenerNotation<
            Events,
            keyof Events
        >;

        return Reflect.getMetadata(ContainerHelper.metaDataEvent, Reflect) as EventListenerNotation<
            Events,
            keyof Events
        > | undefined ?? defaultItens;
    }

}
