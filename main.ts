// gta6-meme-x-01 entry: the program the grader runs.
//
// The entry itself is the X post — the GTA 6 meme and its text, posted from
// @FanywayT. This program only hands the post's address to the gate: it copies
// POST.json from the repository root into the output directory, byte for byte.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(OUTPUT_DIR, { recursive: true });
const POST_PATH = join(BOT_DIR, "POST.json");
let post: unknown;
try {
  post = JSON.parse(readFileSync(POST_PATH, "utf8"));
} catch (err) {
  console.error(`POST.json could not be read or parsed at ${POST_PATH}: ${(err as Error).message}`);
  process.exit(1);
}
if (
  typeof post !== "object" ||
  post === null ||
  typeof (post as { url?: unknown }).url !== "string" ||
  !(post as { url: string }).url.startsWith("https://x.com/")
) {
  console.error(
    `POST.json is not a valid X post address at ${POST_PATH}: expected {"url": "https://x.com/<handle>/status/<id>"}`,
  );
  process.exit(1);
}
try {
  copyFileSync(POST_PATH, join(OUTPUT_DIR, "POST.json"));
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
