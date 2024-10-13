import esbuild from "esbuild";
import { createReadStream, createWriteStream } from "node:fs";
import { cp, mkdir, readdir, unlink } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { cwd } from "node:process";
import { pipeline } from "node:stream/promises";
import { OUTPUT_DIRECTORY, SOURCE_DIRECTORY, mapSourceToOutput, shouldBeCopied, shouldBeMinified } from "./path.js";

if (join(cwd(), "scripts") !== import.meta.dirname) {
    throw new Error("Not running from repository root.");
}

export async function clean () {
    const entries = await readdir(OUTPUT_DIRECTORY, { recursive: true, withFileTypes: true }).catch(() => []);
    await Promise.allSettled(entries.filter(e => e.isFile()).map(e => unlink(join(e.parentPath, e.name))));
    await mkdir(OUTPUT_DIRECTORY, { recursive: true });
}

export function logWatcherEvent (event, path) {
    switch (event) {
        case "add":
            console.log(`+ ${relative(OUTPUT_DIRECTORY, path) }`);
            break;
        case "change":
            console.log(`M ${relative(OUTPUT_DIRECTORY, path) }`);
            break;
        case "unlink":
            console.log(`- ${relative(OUTPUT_DIRECTORY, path) }`);
            break;
        default:
            return;
    }
}

export function bundleOBR () {
    return esbuild.build({
        bundle: true,
        entryPoints: ["@owlbear-rodeo/sdk"],
        format: "esm",
        minify: true,
        outfile: `${OUTPUT_DIRECTORY}/sdk.js`,
    });
}

export function createBuildContext (overrideSettings) {
    return esbuild.context(Object.assign({
        alias: {
            "@owlbear-rodeo/sdk": "../sdk.js",
        },
        bundle: true,
        entryPoints: [
            "nosdk.ts",
            "stylesheets/style.css",
        ].map(path => join(SOURCE_DIRECTORY, path)),
        external: [
            "../sdk.js",
        ],
        format: "esm",
        logLevel: "info",
        minify: true,
        outbase: SOURCE_DIRECTORY,
        outdir: OUTPUT_DIRECTORY,
        splitting: true,
        target: ["es2020", "chrome63", "firefox67", "safari12", "edge79"],
        treeShaking: true,
    }, overrideSettings));
}

export async function handleStaticFile (path) {
    if (shouldBeMinified(path))
        return minify(path);
    if (shouldBeCopied(path))
        return cp(path, mapSourceToOutput(path));
    console.warn(`Ignored path: ${path}`);
}

const pendingMinifications = new Map();

async function minify (path) {
    const pending = pendingMinifications.get(path);
    if (pending) pending.abort();
    const controller = new AbortController();
    pendingMinifications.set(path, controller);

    const outputPath = mapSourceToOutput(path);
    try {
        await mkdir(dirname(outputPath), { recursive: true });
        await pipeline(
            createReadStream(path, { encoding: "utf-8" }),
            collapseSpaces,
            createWriteStream(outputPath),
            { signal: controller.signal }
        );
    } catch (err) {
        if (err.name === "AbortError") {
            console.warn(`Aborted a partial rebuild of ${path}.`);
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
