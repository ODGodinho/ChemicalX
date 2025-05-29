import { Container } from "inversify";

import { ODGDecorators } from "src";

import { ExampleEventListeners } from "./ExampleEventListeners";

describe("Container Test", () => {
    test("Test event listner notation", async () => {
        const container = new Container();
        container.bind("ExampleEventListeners").to(ExampleEventListeners);
        const events = ODGDecorators.getEvents(container);

        expect(events).has.keys([ "ExampleEvent" ]);
        expect(Object.keys(events)).length(1);
        expect(events["ExampleEvent"].length).toEqual(2);
    });
});
