import { readdir } from "node:fs/promises";
import { join } from "node:path";
import Watcher from "watcher";
import { OUTPUT_DIRECTORY, SOURCE_DIRECTORY, shouldBeHandledByEsbuild } from "./path.js";
import { bundleOBR, clean, createBuildContext, handleStaticFile, logWatcherEvent } from "./utils.js";

await new Promise(resolve =>
    new Watcher(OUTPUT_DIRECTORY, { recursive: true, ignoreInitial: true, persistent: false })
        .once("ready", resolve)
        .on("all", logWatcherEvent)
);

await clean();

await Promise.all([
    bundleOBR(),

    createBuildContext().then(ctx => ctx
        .rebuild().finally(() => ctx
            .dispose())),

    readdir(SOURCE_DIRECTORY, { recursive: true, withFileTypes: true })
        .then(dir => Promise.all(dir
            .filter(entry => entry.isFile() && !shouldBeHandledByEsbuild(entry.name))
            .map(entry => handleStaticFile(join(entry.parentPath, entry.name))))),
]);
