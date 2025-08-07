import "reflect-metadata";
import {
    type EventListener,
    type EventListenerNotation,
    type EventNameType,
    type EventObjectType,
    type EventOptions,
} from "@odg/events";
import { UnknownException } from "@odg/exception";
import {
    type Container,
    ContainerModule,
    decorate,
    injectable,
} from "inversify";

import { retry } from "@helpers";
import { type AttemptableInterface } from "@interfaces";
import { type ContainerMetadataInterface } from "@interfaces/internal/ContainerInterface";

export class ODGDecorators {

    protected static readonly metaData: string = "odg:bind-page-metadata";

    protected static readonly metaDataEvent: string = "odg:bind-events-metadata";

    public static injectablePageOrHandler(name: string): CallableFunction {
        return (target: object) => {
            decorate(injectable(), target);
            const previousMetadata = Reflect.getMetadata(ODGDecorators.metaData, Reflect) as [] | undefined;

            const newMetadata = [ {
                target,
                name,
            }, ...previousMetadata ?? [] ];
            Reflect.defineMetadata(ODGDecorators.metaData, newMetadata, Reflect);
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static attemptableFlow<T extends new (...constructors: any[]) => AttemptableInterface>() {
        return (constructor: T): T => class extends constructor implements AttemptableInterface {

            public async execute(): Promise<void> {
                try {
                    await retry({
                        times: await this.attempt(),
                        sleep: await this.sleep?.(),
                        callback: super.execute.bind(this),
                        when: this.retrying?.bind(this),
                    });

                    await this.finish?.();

                    return await this.success?.();
                } catch (error: unknown) {
                    const exception = UnknownException.parseOrDefault(error, "Page UnknownException");

                    await this.finish?.(exception);
                    if (this.failure) await this.failure(exception);
                    else throw exception;
                }
            }

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

            Reflect.defineMetadata(ODGDecorators.metaDataEvent, previousMetadata, Reflect);
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
                ODGDecorators.metaData,
                Reflect,
            ) as ContainerMetadataInterface[] | undefined ?? [];

            type PageFactoryType = (page: unknown) => unknown;

            for (const metadata of provideMetadata) {
                containerInstance.bind<PageFactoryType>(metadata.name)
                    .toFactory(() => ODGDecorators.bindPageOrHandler(metadata, containerInstance));
            }
        });
    }

    private static bindPageOrHandler(
        metadata: ContainerMetadataInterface,
        containerInstance: Container,
    ): (page: unknown) => unknown {
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

        return Reflect.getMetadata(ODGDecorators.metaDataEvent, Reflect) as EventListenerNotation<
            Events,
            keyof Events
        > | undefined ?? defaultItens;
    }

}
