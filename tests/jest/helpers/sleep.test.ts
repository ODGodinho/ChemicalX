import { sleep } from "../../../src/Helpers/index";

describe("Sleep Testes", () => {
    test("Sleep Test 300ms", async () => {
        const start = new Date().getTime();
        const sleepTime = 300;
        await sleep(sleepTime);
        const end = new Date().getTime();
        expect(end - start).toBeGreaterThan(sleepTime * 0.95);
    });
});
