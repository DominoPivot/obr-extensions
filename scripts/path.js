import { extname, join, relative } from "node:path";
import { cwd } from "node:process";

if (join(cwd(), "scripts") !== import.meta.dirname) {
    throw new Error("Not running from repository root.");
}

/** Relative path from the project root to the output directory. */
export const OUTPUT_DIRECTORY = "out";
/** Relative path from the project root to the source directory. */
export const SOURCE_DIRECTORY = "src";

const EXTENSIONS_HANDLED_BY_ESBUILD = [".js", ".ts", ".css"];
const EXTENSIONS_TO_MINIFY = [".html", ".svg", ".json"];
const EXTENSIONS_TO_COPY = [".jpg", ".md", ".png", ".webp"];
const PATHS_TO_COPY = [".nojekyll", "CNAME"];

/**
 * Determines if a file should be handled by esbuild based on its extname.
 * @param {string} pathLike Path-like string or file name.
 */
export function shouldBeHandledByEsbuild (pathLike) {
    return EXTENSIONS_HANDLED_BY_ESBUILD.includes(extname(pathLike));
}

/**
 * Determines if a file should be minified manually based on its extname.
 * @param {string} pathLike Path-like string or file name.
 */
export function shouldBeMinified (pathLike) {
    return EXTENSIONS_TO_MINIFY.includes(extname(pathLike));
}

/**
 * Determines if a file should be copied unchanged based on its path.
 * @param {string} path Path of a source file relative to the root of the project.
 */
export function shouldBeCopied (path) {
    return EXTENSIONS_TO_COPY.includes(extname(path)) || PATHS_TO_COPY.includes(relative(SOURCE_DIRECTORY, path));
}

/**
 * Maps a path for a source file to the corresponding output file.
 * @param {string} path Path in `SOURCE_DIRECTORY` relative to the project.
 * @returns {string} Path in `OUTPUT_DIRECTORY` relative to the project.
 */
export function mapSourceToOutput (path) {
    return join(OUTPUT_DIRECTORY, relative(SOURCE_DIRECTORY, path));
}
