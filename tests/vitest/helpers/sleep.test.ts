import { sleep } from "../../../src/Helpers/index";

describe("Sleep Testes", () => {
    test("Sleep Test 300ms", async () => {
        const start = Date.now();
        const sleepTime = 300;

        await sleep(sleepTime);
        const end = Date.now();

        expect(end - start).toBeGreaterThan(sleepTime * 0.95);
    });
    test("Sleep Test Abort", async () => {
        const start = Date.now();
        const sleepTime = 5000;
        const controller = new AbortController();

        controller.abort("aborted");
        await sleep(sleepTime, { signal: controller.signal });
        const end = Date.now();

        expect(end - start).toBeLessThanOrEqual(100); // Abort should be fast
    });

    test("Sleep lower Interval", async () => {
        const start = Date.now();
        const sleepTime = 5000;
        const controller = new AbortController();

        setTimeout(() => {
            controller.abort("Abort Process");
        }, 250);

        await sleep(sleepTime, { signal: controller.signal });
        const end = Date.now();

        expect(end - start).toBeLessThanOrEqual(500); // Abort should be fast
    });
});
