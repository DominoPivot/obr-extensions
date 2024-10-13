import Watcher from "watcher";
import { shouldBeHandledByEsbuild } from "./path.js";
import { bundleOBR, clean, createBuildContext, handleStaticFile, logWatcherEvent } from "./utils.js";

await new Promise(resolve =>
    new Watcher("out", { recursive: true, ignoreInitial: true, persistent: false })
        .once("ready", resolve)
        .on("all", logWatcherEvent)
);

await clean();
await bundleOBR();

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
            if ((event === "change" || event === "add") && !shouldBeHandledByEsbuild(path))
                handleStaticFile(path);
        })
);
