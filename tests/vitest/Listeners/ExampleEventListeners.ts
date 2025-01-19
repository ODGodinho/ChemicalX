import { EventListenerInterface } from "@odg/events";
import { injectable } from "inversify";
import { vi } from "vitest";

import { ContainerHelper } from "../../../src";

@ContainerHelper.registerListener("ExampleEvent", "ExampleEventListeners", {})
@ContainerHelper.registerListener("ExampleEvent", "ExampleEventListeners", {})
@injectable()
export class ExampleEventListeners implements EventListenerInterface<Record<string, unknown>, string> {

    public handler = vi.fn<unknown[], never>(() => this.test as never);

    private readonly test: string = "containerEvent";

}
