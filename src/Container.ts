import { TypedContainer } from "@inversifyjs/strongly-typed";

/**
 * @template ContainerType
 */
export class Container<
    ContainerType extends object = Record<string, unknown>,
> extends TypedContainer<ContainerType> {

    public getOptional<Name extends keyof ContainerType>(
        serviceIdentifier: Name,
    ): ContainerType[Name] | undefined {
        if (!this.isBound(serviceIdentifier)) return;

        return super.get(serviceIdentifier) as ContainerType[Name];
    }

}
