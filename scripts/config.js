import { context } from "esbuild";
import { extname, join } from "node:path";
import { cwd } from "node:process";

if (join(cwd(), "scripts") !== import.meta.dirname) {
    throw new Error("Not running from repository root.");
}

export const OUTPUT = "out";
export const STATIC = "static";
export const SOURCE = "src";

export function createBuildContext (overrideSettings) {
    return context(Object.assign({
        alias: {
            "@owlbear-rodeo/sdk": "/sdk.js",
        },
        bundle: true,
        entryPoints: [
            "nosdk.ts",
            "oranges/popover.ts",
            "style.css",
        ].map(path => join(SOURCE, path)),
        external: [
            "/sdk.js",
        ],
        format: "esm",
        logLevel: "info",
        minify: true,
        outbase: SOURCE,
        outdir: OUTPUT,
        splitting: true,
        target: ["es2020", "chrome63", "firefox67", "safari12", "edge79"],
        treeShaking: true,
    }, overrideSettings));
}

export const EXTENSIONS_HANDLED_BY_ESBUILD = [".css", ".js", ".ts"];
export const EXTENSIONS_TO_MINIFY = [".html", ".json", ".svg"];
export const EXTENSIONS_TO_COPY = [".jpg", ".md", ".png", ".txt", ".webp"];

/**
 * Returns a string describing what should be done with a given source file.
 * @returns {"build" | "copy" | "minify" | "ignore"}
 */
export function expectation (pathLike) {
    if (EXTENSIONS_HANDLED_BY_ESBUILD.includes(extname(pathLike)))
        return "build";
    if (EXTENSIONS_TO_MINIFY.includes(extname(pathLike)))
        return "minify";
    if (EXTENSIONS_TO_COPY.includes(extname(pathLike)))
        return "copy";
    return "ignore";
}
