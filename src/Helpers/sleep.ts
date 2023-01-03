/**
 * Sleep async function
 *
 * @param {number} milliseconds sleep time in milliseconds
 * @returns {Promise<void>}
 */
export async function sleep(milliseconds: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

export default sleep;
