import {
    type BindToFluentSyntax,
    Container as ContainerInversify,
} from "inversify";

/**
 * @template {Record<string, unknown>} ContainerType
 * @template {string} Name Keyof of interface
 */
export class Container<
    ContainerType extends Record<string, unknown> = Record<string, unknown>,
> extends ContainerInversify {

    /**
     * Get Container Item
     *
     * @template {string} Name Keyof of interface
     * @param {Name} serviceIdentifier containerName
     * @returns {ContainerType[Name]}
     */
    public get<Name extends keyof ContainerType>(serviceIdentifier: Name): ContainerType[Name] {
        return super.get<ContainerType[Name]>(serviceIdentifier as string);
    }

    /**
     * Get Container Item
     *
     * @template {string} Name
     * @param {Name} serviceIdentifier containerName
     * @returns {ContainerType[Name] | undefined}
     */
    public getOptional<Name extends keyof ContainerType>(serviceIdentifier: Name): ContainerType[Name] | undefined {
        if (!this.isBound(serviceIdentifier as string)) return;

        return super.get(serviceIdentifier as string);
    }

    public bind<Name>(serviceIdentifier: string): BindToFluentSyntax<Name>;

    /**
     * Bind Container Item
     *
     * @template {string} Name
     * @param {Name} serviceIdentifier containerName
     * @returns {BindToFluentSyntax<ContainerType[Name]>}
     */
    public bind<Name extends keyof ContainerType>(
        serviceIdentifier: Name,
    ): BindToFluentSyntax<ContainerType[Name]> {
        return super.bind(serviceIdentifier as string);
    }

    /**
     * Get Async Container Item
     *
     * @template {string} Name
     * @param {Name} serviceIdentifier containerName
     * @returns {Promise<ContainerType[Name]>}
     */
    public async getAsync<Name extends keyof ContainerType>(serviceIdentifier: Name): Promise<ContainerType[Name]> {
        return super.getAsync(serviceIdentifier as string);
    }

    public isBound<Name>(serviceIdentifier: string): Name;

    /**
     * Get Container Item
     *
     * @template {string} Name
     * @param {Name} serviceIdentifier containerName
     * @returns {boolean}
     */
    public isBound<Name extends keyof ContainerType>(serviceIdentifier: Name): boolean {
        return super.isBound(serviceIdentifier as string);
    }

}
