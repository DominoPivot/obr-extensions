import { createReadStream, createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { cwd } from "node:process";
import { pipeline } from "node:stream/promises";

if (join(cwd(), "scripts") !== import.meta.dirname) {
    throw new Error("Not running from repository root.");
}

const pendingMinifications = new Map();

export async function minify (source, destination) {
    const pending = pendingMinifications.get(source);
    if (pending) pending.abort();
    const controller = new AbortController();
    pendingMinifications.set(source, controller);
;
    try {
        await mkdir(dirname(destination), { recursive: true });
        await pipeline(
            createReadStream(source, { encoding: "utf-8" }),
            collapseSpaces,
            createWriteStream(destination),
            { signal: controller.signal }
        );
    } catch (err) {
        if (err.name === "AbortError") {
            console.warn(`Aborted a partial rebuild of ${source}.`);
        } else {
            throw err;
        }
    }
}

async function* collapseSpaces (source, { signal }) {
    let carry = "";
    for await (const chunk of source) {
        signal.throwIfAborted();
        const collapsed = (carry + chunk).replaceAll(/(\s)\s*/g, "$1");
        carry = collapsed.slice(-1);
        if (/\s/.test(carry)) {
            yield collapsed.slice(0, -1);
        } else {
            yield collapsed;
            carry = "";
        }
    }
    if (carry) yield carry;
}
