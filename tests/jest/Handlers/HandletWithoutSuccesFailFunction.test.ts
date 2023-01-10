import { Exception } from "@odg/exception";

import { HandlerSolution } from "../../..";
import { type PageClassEngine } from "../playwright/engine";

import { WithoutFunctionHandler } from "./mock/WithoutFunctionHandler";

describe("Handler success Function", () => {
    let handler: WithoutFunctionHandler;
    let handlerSolutionMock: jest.SpyInstance<Promise<HandlerSolution>, unknown[]>;

    beforeEach(() => {
        handler = new WithoutFunctionHandler(undefined as unknown as PageClassEngine, {});
        handlerSolutionMock = jest.spyOn(handler, "testSolution");
    });

    test("Test success without optional functions", async () => {
        handlerSolutionMock.mockImplementation(async () => HandlerSolution.Resolve);

        await expect(handler.execute()).resolves.toBeUndefined();
        expect(handlerSolutionMock.mock.calls.length).toBe(1);
    });

    test("Test fail without optional functions", async () => {
        handlerSolutionMock.mockImplementation(async () => {
            throw new Exception("Example");
        });

        await expect(handler.execute()).rejects.toThrowError(Exception);
        expect(handlerSolutionMock.mock.calls.length).toBe(1);
    });
});
