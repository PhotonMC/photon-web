import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const target = join(
  process.cwd(),
  "node_modules",
  "@opennextjs",
  "cloudflare",
  "dist",
  "cli",
  "build",
  "patches",
  "plugins",
  "load-manifest.js"
);

if (existsSync(target)) {
  let content = readFileSync(target, "utf-8");
  let modified = false;

  if (!content.includes("preview-props")) {
    content = content.replace(
      "**/{*-manifest,required-server-files,prefetch-hints}.json",
      "**/{*-manifest,required-server-files,prefetch-hints,preview-props,functions-config-manifest}.json"
    );
    content = content.replace(
      'p.endsWith("fallback-build-manifest") ||',
      'p.endsWith("fallback-build-manifest") ||\n        p.endsWith("preview-props") ||'
    );
    modified = true;
  }

  if (modified) {
    writeFileSync(target, content, "utf-8");
    console.log("[patch-opennext] Applied preview-props patch to @opennextjs/cloudflare");
  }
}
