#!/usr/bin/env node
/** Ensure vendor/page-assistant exists and is built (preinstall clone + postinstall build). */
import { existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "vendor", "page-assistant");
const coreDist = path.join(dir, "packages", "core", "dist", "index.js");
const cloneOnly = process.argv.includes("--clone-only");
const buildOnly = process.argv.includes("--build-only");

function clone() {
  if (existsSync(coreDist)) return;
  if (!existsSync(dir)) {
    console.log("[page-assistant] cloning…");
    execSync("git clone --depth 1 https://github.com/philipposk/page-assistant.git vendor/page-assistant", {
      cwd: root,
      stdio: "inherit",
    });
  }
}

function build() {
  if (existsSync(coreDist)) return;
  if (!existsSync(dir)) {
    console.warn("[page-assistant] vendor/page-assistant missing");
    return;
  }
  console.log("[page-assistant] building packages…");
  execSync("npm ci --include=dev && npm run build", { cwd: dir, stdio: "inherit" });
}

if (!buildOnly) clone();
if (!cloneOnly) build();
