import { join } from "node:path";
import { cwd, stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";
import { SOURCE_DIRECTORY } from "./path.js";
import { mkdir, writeFile } from "node:fs/promises";

if (join(cwd(), "scripts") !== import.meta.dirname) {
    throw new Error("Not running from repository root.");
}

const rli = createInterface(stdin, stdout, undefined, true);

const path = await rli.question(`path: `);
console.assert(path, "path cannot be empty.");

await mkdir(join(SOURCE_DIRECTORY, path));

const name = await rli.question("name: ");
console.assert(name, "name cannot be empty.");

const manifest = {
    name,
    version: "0.0.0",
    manifest_version: 1,
    icon: `/${path}/icon.svg`,
    author: "DominoPivot",
};

const description = await rli.question("description: ");
if (description) manifest.description = description;

if ((await rli.question("Create an action popover? (y/n) ")).trim().startsWith("y")) {
    manifest.action = {
        title: manifest.name,
        icon: manifest.icon,
        popover: `/${path}/popover.html`,
    };
    await writeFile(
        join(SOURCE_DIRECTORY, path, "popover.html"),
        popoverHtml(manifest.name),
        { flag: "wx" },
    );
    await writeFile(
        join(SOURCE_DIRECTORY, path, "popover.ts"),
        popoverTs(),
        { flag: "wx" },
    );
    console.log(`Remember to add "${path}/popover.ts" as an entrypoint.`);
} else {
    manifest.background_url = `/${path}/background.html`;
    await writeFile(
        join(SOURCE_DIRECTORY, path, "background.html"),
        backgroundHtml(manifest.name),
        { flag: "wx" },
    );
    await writeFile(
        join(SOURCE_DIRECTORY, path, "background.ts"),
        backgroundTs(),
        { flag: "wx" },
    );
    console.log(`Remember to add "${path}/background.ts" as an entrypoint.`);
}

await writeFile(
    join(SOURCE_DIRECTORY, path, "manifest.json"),
    JSON.stringify(manifest, undefined, 4),
    { flag: "wx" },
);

rli.close();

function popoverHtml (title) {
    return `<!DOCTYPE html>
<html lang=en>
<title>${title}</title>
<meta name=viewport content="width=device-width, initial-scale=1">
<script type=module crossorigin>
import { onAction } from "../nosdk.js";
onAction(async () => {
    await import("./popover.js");
});
</script>
<main id=main></main>
`;
}

function popoverTs () {
    return `import OBR from "@owlbear-rodeo/sdk";
import { handleThemeChange } from "../theme.js";
OBR.onReady(async () => {
    OBR.theme.getTheme().then(handleThemeChange);
    OBR.theme.onChange(handleThemeChange);
});
`;
}

function backgroundHtml (title) {
    return `<!DOCTYPE html><title>${title}</title><script type=module src=background.js crossorigin></script>
`;
}

function backgroundTs () {
    return `import OBR from "@owlbear-rodeo/sdk";
OBR.onReady(async () => {});
`;
}
