import { InvalidArgumentException } from "@exceptions";
import { TimeoutException } from "@exceptions/TimeoutException";
import type {
    TimeoutOptionsInterface,
} from "@interfaces";

import { sleep } from ".";

export async function timeout<ReturnType>(
    options: TimeoutOptionsInterface<ReturnType>,
): Promise<ReturnType> {
    if (typeof options.timeout !== "number" || Number.isNaN(options.timeout)) {
        throw new InvalidArgumentException("Timeout is not a number");
    }

    return Promise.race([
        Promise.resolve()
            .then(async () => options.callback()),
        sleep(options.timeout).then(() => {
            throw new TimeoutException(`${options.name! || "Default"} - Timeout ${options.timeout}ms exceeded`);
        }),
    ]);
}
