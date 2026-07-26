import { spawnSync } from "node:child_process";
import { projectRoot } from "./lib/project-validation.mjs";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const steps = [
  ["Lint", npmCommand, ["run", "lint"]],
  ["All Node tests", npmCommand, ["test"]],
  ["Reports targeted tests", npmCommand, ["run", "test:reports"]],
  ["Calendar targeted tests", npmCommand, ["run", "test:calendar"]],
  ["Inline JavaScript", npmCommand, ["run", "check:inline"]],
  ["Service Worker syntax", npmCommand, ["run", "check:sw"]],
  ["Manifest validation", npmCommand, ["run", "check:manifest"]],
  ["Production validation", npmCommand, ["run", "validate:production"]],
  ["Git unstaged whitespace check", "git", ["diff", "--check"]],
  ["Git staged whitespace check", "git", ["diff", "--cached", "--check"]]
];

for (const [label, command, args] of steps) {
  console.log(`\n=== ${label} ===`);
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    env: process.env,
    stdio: "inherit"
  });
  if (result.error) {
    console.error(`${label} could not start: ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error(`${label} failed with exit code ${result.status}.`);
    process.exit(result.status || 1);
  }
}

console.log("\nRelease check passed.");
