import { TypedContainerModule, type TypedContainer } from "@inversifyjs/strongly-typed";
import type {
    EventListener,
    EventListenerNotation,
    EventNameType,
    EventObjectType,
    EventOptions,
} from "@odg/events";
import { UnknownException } from "@odg/exception";
import {
    decorate,
    injectable,
    injectFromHierarchy,
} from "inversify";
import "reflect-metadata";

import { retry } from "@helpers";
import type { AttemptableInterface, GetterAccessInterface } from "@interfaces";
import type { ContainerMetadataInterface } from "@interfaces/internal/ContainerInterface";

export class ODGDecorators {

    protected static readonly metaDataPageOrHandler: string = "odg:bind-page-metadata";

    protected static readonly metaDataEvent: string = "odg:bind-events-metadata";

    public static injectablePageOrHandler(name: string): CallableFunction {
        return (target: new (...parameters: unknown[]) => unknown) => {
            decorate(injectable(), target);
            decorate(injectFromHierarchy({
                extendConstructorArguments: true,
                extendProperties: true,
                lifecycle: {
                    extendPostConstructMethods: true,
                    extendPreDestroyMethods: true,
                },
            }), target);

            const previousMetadata = Reflect.getMetadata(
                ODGDecorators.metaDataPageOrHandler,
                Reflect,
            ) as [] | undefined;

            const newMetadata = [
                { target, name },
                ...previousMetadata ?? [],
            ];

            Reflect.defineMetadata(ODGDecorators.metaDataPageOrHandler, newMetadata, Reflect);
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static attemptableFlow<T extends new (...constructors: any[]) => AttemptableInterface>() {
        return (constructor: T): T => class extends constructor implements AttemptableInterface {

            public currentAttempt: number = 0;

            public async execute(): Promise<void> {
                try {
                    this.currentAttempt = 1;
                    await retry({
                        times: await this.attempt(),
                        sleep: await this.sleep?.(),
                        callback: async (attempt, signal) => {
                            this.currentAttempt = attempt;

                            return super.execute.call(this, attempt, signal);
                        },
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

    public static getterAccess<T extends new (..._ignore: never[]) => GetterAccessInterface>(): (targetClass: T) => T {
        return (targetClass: T): T => this.createGetterPropertyIntercept(targetClass);
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
                containerName,
                options,
            });

            Reflect.defineMetadata(ODGDecorators.metaDataEvent, previousMetadata, Reflect);
        };
    }

    public static getEvents<Events extends EventObjectType>(
        containerInstance: TypedContainer,
    ): EventListener<Events, keyof Events> {
        const allEvents = this.getReflectEvents();

        for (const [ , listeners ] of Object.entries(allEvents)) {
            for (const listener of listeners) {
                listener.listener = containerInstance.get(listener.containerName);
            }
        }

        return allEvents as EventListener<Events, keyof Events>;
    }

    public static loadModule(containerInstance: TypedContainer): TypedContainerModule {
        return new TypedContainerModule(() => {
            const provideMetadata = Reflect.getMetadata(
                ODGDecorators.metaDataPageOrHandler,
                Reflect,
            ) as ContainerMetadataInterface[] | undefined ?? [];

            for (const metadata of provideMetadata) {
                containerInstance
                    .bind(metadata.name)
                    .to(metadata.target)
                    .inTransientScope();
            }
        });
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

    private static createGetterPropertyIntercept<T extends new (..._ignore: never[]) => GetterAccessInterface>(
        targetClass: T,
    ): T {
        return new Proxy(targetClass, {
            construct(target, argumentsList, newTarget): GetterAccessInterface {
                const instance: GetterAccessInterface = Reflect.construct(
                    target,
                    argumentsList,
                    newTarget,
                ) as GetterAccessInterface;

                return new Proxy(instance, {
                    get(object, property): unknown {
                        const getter = "__get";

                        return object[getter](property, (object as unknown as Record<PropertyKey, unknown>)[property]);
                    },
                });
            },
        });
    }

}
