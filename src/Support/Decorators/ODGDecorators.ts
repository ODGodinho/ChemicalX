import { UnknownException } from "@odg/exception";

import { retry } from "@helpers";
import { type AttemptableInterface } from "@interfaces";

export class ODGDecorators {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static attemptableFlow<T extends new (...constructors: any[]) => AttemptableInterface>() {
        return (constructor: T): T => class extends constructor implements AttemptableInterface {

            public async execute(): Promise<void> {
                try {
                    await retry({
                        times: await this.attempt(),
                        sleep: 0,
                        callback: super.execute.bind(this),
                        when: this.retrying?.bind(this),
                    });

                    await this.finish?.();

                    return await this.success?.();
                } catch (error: unknown) {
                    const exception = UnknownException.parseOrDefault(error, "Page UnknownException");

                    await this.finish?.(exception);
                    if (this.failure) await this.failure(exception);
                    else throw exception;
                }
            }

        };
    }

}
