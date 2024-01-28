import { type GetterAccessInterface } from "@interfaces";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getAccessDecorator(): any {
    return (targetClass: new () => GetterAccessInterface) => new Proxy(targetClass, {
        construct: function(target, argumentsList, newTarget): GetterAccessInterface {
            const instance: GetterAccessInterface = Reflect.construct(
                target,
                argumentsList,
                newTarget,
            ) as GetterAccessInterface;

            return new Proxy(instance, {
                get: function(object, property): unknown {
                    const getter = "__get";

                    return object[getter](property, (object as unknown as Record<PropertyKey, unknown>)[property]);
                },
            });
        },
    });
}
