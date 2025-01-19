import { Container } from "inversify";

import { ContainerHelper } from "@helpers";

import { ExampleEventListeners } from "./ExampleEventListeners";

describe("Container Test", () => {
    test("Test event listner notation", async () => {
        const container = new Container();
        container.bind("ExampleEventListeners").to(ExampleEventListeners);
        const events = ContainerHelper.getEvents(container);

        expect(events).has.keys([ "ExampleEvent" ]);
        expect(Object.keys(events)).length(1);
        expect(events["ExampleEvent"].length).toEqual(2);
    });
});
