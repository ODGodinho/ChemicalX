import { EventListenerInterface } from "@odg/events";
import { injectable } from "inversify";
import { vi } from "vitest";

import { ODGDecorators } from "../../../src";

@ODGDecorators.registerListener("ExampleEvent", "ExampleEventListeners", {})
@ODGDecorators.registerListener("ExampleEvent", "ExampleEventListeners", {})
@injectable()
export class ExampleEventListeners implements EventListenerInterface<Record<string, unknown>, string> {

    public handler = vi.fn(() => this.test as never);

    private readonly test: string = "containerEvent";

}
