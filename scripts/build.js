import { build } from "esbuild";
import { cp, readdir } from "node:fs/promises";
import { join, relative } from "node:path";
import { cwd } from "node:process";
import { OUTPUT, SOURCE, STATIC, createBuildContext, expectation } from "./config.js";
import { minify } from "./minify.js";

if (join(cwd(), "scripts") !== import.meta.dirname) {
    throw new Error("Not running from repository root.");
}

await Promise.all([
    build({
        bundle: true,
        entryPoints: ["@owlbear-rodeo/sdk"],
        format: "esm",
        minify: true,
        outfile: `${OUTPUT}/sdk.js`,
    }),

    cp(STATIC, OUTPUT, { recursive: true }),

    createBuildContext().then(ctx => ctx
        .rebuild().finally(() => ctx
            .dispose())),

    readdir(SOURCE, { recursive: true, withFileTypes: true })
        .then(dir => Promise.all(dir
            .filter(entry => entry.isFile())
            .map(entry => join(entry.parentPath, entry.name))
            .map(path => {
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
            }))),
]);
