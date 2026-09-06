#!/usr/bin/env node
/** Ensure vendor/page-assistant exists and is built (preinstall clone + postinstall build). */
import { existsSync, rmSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "vendor", "page-assistant");
const coreDist = path.join(dir, "packages", "core", "dist", "index.js");
const manifest = path.join(dir, "package.json");

/**
 * The exact page-assistant commit this app is built and tested against (0.5.0).
 * Previously this script cloned whatever `main` happened to be at build time, so
 * two deploys of the same app commit could ship two different assistants — and
 * did: `main` moved on mid-upgrade. Bump this deliberately, with a build.
 */
const PIN = "6b4017943eab6624d054318739e94e752b81f073";
const cloneOnly = process.argv.includes("--clone-only");
const buildOnly = process.argv.includes("--build-only");

function clone() {
  if (existsSync(coreDist)) return;
  // npm can create the empty file: dependency directory before this runs, so an
  // existing `dir` is not proof of a checkout — look for the repo's manifest.
  if (!existsSync(manifest)) {
    console.log(`[page-assistant] cloning ${PIN.slice(0, 7)}…`);
    rmSync(dir, { recursive: true, force: true });
    execSync("git clone --filter=blob:none https://github.com/philipposk/page-assistant.git vendor/page-assistant", {
      cwd: root,
      stdio: "inherit",
    });
    execSync(`git checkout --detach ${PIN}`, { cwd: dir, stdio: "inherit" });
  }
}

function build() {
  if (existsSync(coreDist)) return;
  if (!existsSync(manifest)) {
    console.warn("[page-assistant] vendor/page-assistant missing");
    return;
  }
  console.log("[page-assistant] building packages…");
  execSync("npm ci --include=dev && npm run build", { cwd: dir, stdio: "inherit" });
}

if (!buildOnly) clone();
if (!cloneOnly) build();
