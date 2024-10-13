import { rm } from "node:fs/promises";
import { OUTPUT_DIRECTORY } from "./path.js";

await rm(OUTPUT_DIRECTORY, { recursive: true, force: true });
