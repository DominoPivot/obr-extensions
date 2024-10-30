import { rm } from "node:fs/promises";
import { join, resolve } from "node:path";
import { cwd, stdin as input, stdout as output } from "node:process";
import { createInterface } from "node:readline/promises";
import { OUTPUT } from "./config.js";

if (join(cwd(), "scripts") !== import.meta.dirname) {
    throw new Error("Not running from repository root.");
}

const absolutePath = resolve(cwd(), OUTPUT);
const rl = createInterface({ input, output });

try {
    console.log(`This action will recursively remove the following path:\n${absolutePath}`);
    if (["yes", "y"].includes(await rl.question(`Type yes to proceed: `))) {
        await rm(absolutePath, { recursive: true });
        console.log("Done.");
    } else {
        console.log("Aborted.");
    }
} finally {
    rl.close();
}
