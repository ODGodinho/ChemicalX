import { type AttemptableInterface } from "../../Interfaces/AttemptableFlow";

export type HandlerFunction = () => Promise<HandlerSolution>;

/**
 * State Handler Function
 *
 * Resolve - To Resolve Handler
 * Retry - To Execute Handler retry
 *
 * @enum {string}
 */
export enum HandlerSolution {
    Resolve = "Resolve",
    Retry = "Retry",
}

export interface HandlerInterface extends AttemptableInterface {

    /**
     * Execute step
     *
     * @memberof HandlerInterface
     * @returns {Promise<HandlerFunction>}
     */
    waitForHandler(): Promise<HandlerFunction>;

}
