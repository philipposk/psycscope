#!/usr/bin/env node
/** Ensure vendor/page-assistant exists and is built (preinstall clone + postinstall build). */
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "vendor", "page-assistant");
const coreDist = path.join(dir, "packages", "core", "dist", "index.js");
const manifest = path.join(dir, "package.json");

/**
 * The exact page-assistant commit this app is built and tested against (0.5.1 plus
 * account chat history). Previously this script cloned whatever `main` happened to
 * be at build time, so two deploys of the same app commit could ship two different
 * assistants — and did: `main` moved on mid-upgrade. Bump this deliberately, with a
 * build.
 */
const PIN = "d0d8856ccb28be4e18ce97e9c470083dd3b764ea";
const REPO = "https://github.com/philipposk/page-assistant.git";
const cloneOnly = process.argv.includes("--clone-only");
const buildOnly = process.argv.includes("--build-only");

/** The commit checked out in vendor/page-assistant, or null if it isn't a git checkout. */
function checkedOut() {
  try {
    return execSync("git rev-parse HEAD", { cwd: dir, stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch {
    return null;
  }
}

function clone() {
  // A checkout left over from an earlier PIN would otherwise be kept (and its old
  // build reused) forever, so a PIN bump never reached an existing working copy.
  if (existsSync(manifest) && checkedOut() !== PIN) {
    console.log(`[page-assistant] vendor is not at ${PIN.slice(0, 7)}; re-cloning…`);
    rmSync(dir, { recursive: true, force: true });
  }
  if (existsSync(coreDist)) return;
  // npm can create the empty file: dependency directory before this runs, so an
  // existing `dir` is not proof of a checkout — look for the repo's manifest.
  if (!existsSync(manifest)) {
    // Fetch the commit itself, not a branch: the PIN keeps working after the branch it
    // was made on is merged and deleted.
    console.log(`[page-assistant] fetching ${PIN.slice(0, 7)}…`);
    rmSync(dir, { recursive: true, force: true });
    mkdirSync(dir, { recursive: true });
    for (const cmd of [
      "git init -q",
      `git remote add origin ${REPO}`,
      `git fetch --depth 1 origin ${PIN}`,
      "git checkout -q FETCH_HEAD",
    ]) {
      execSync(cmd, { cwd: dir, stdio: "inherit" });
    }
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
