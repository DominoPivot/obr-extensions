import { cp } from "node:fs/promises";
import { join, relative } from "node:path";
import { cwd } from "node:process";
import Watcher from "watcher";
import { OUTPUT, SOURCE, createBuildContext, expectation } from "./config.js";
import { minify } from "./minify.js";

if (join(cwd(), "scripts") !== import.meta.dirname) {
    throw new Error("Not running from repository root.");
}

await new Promise(resolve =>
    new Watcher("out", { recursive: true, ignoreInitial: true, persistent: false })
        .once("ready", resolve)
        .on("all", (event, path) => {
            switch (event) {
                case "add":
                    console.log(`+ ${relative(OUTPUT, path) }`);
                    break;
                case "change":
                    console.log(`M ${relative(OUTPUT, path) }`);
                    break;
                case "unlink":
                    console.log(`- ${relative(OUTPUT, path) }`);
                    break;
                default:
                    return;
            }
        })
);

const ctx = await createBuildContext({ sourcemap: true });
await ctx.serve({
    servedir: "out",
    onRequest ({ method, path, timeInMS }) {
        console.log(`${method} ${path} ${timeInMS}ms`);
    },
});

await new Promise(resolve =>
    new Watcher("src", { recursive: true })
        .once("ready", resolve)
        .on("all", (event, path) => {
            if (event === "change" || event === "add") {
                switch (expectation(path)) {
                    case "minify":
                        return minify(path, join(OUTPUT, relative(SOURCE, path)));
                    case "copy":
                        return cp(path, join(OUTPUT, relative(SOURCE, path)));
                    case "build":
                        return; // handled by esbuild
                    default:
                        console.warn(`Ignored source: ${path}`);
                }
            }
        })
);
