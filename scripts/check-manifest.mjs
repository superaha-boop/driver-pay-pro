import fs from "node:fs";
import {
  assertCheck,
  projectPath,
  readProjectFile
} from "./lib/project-validation.mjs";

const manifest = JSON.parse(readProjectFile("manifest.webmanifest"));

assertCheck(manifest.name === "Driver Pay Pro", "Manifest name must remain Driver Pay Pro.");
assertCheck(manifest.start_url === "./", "Manifest start_url must remain ./.");
assertCheck(manifest.scope === "./", "Manifest scope must remain ./.");
assertCheck(manifest.display === "standalone", "Manifest display must remain standalone.");
assertCheck(Array.isArray(manifest.icons) && manifest.icons.length >= 2, "Manifest requires PWA icons.");

for (const icon of manifest.icons) {
  assertCheck(icon.src && fs.existsSync(projectPath(icon.src)), `Manifest icon is missing: ${icon.src}`);
  assertCheck(icon.sizes && icon.type === "image/png", `Manifest icon metadata is incomplete: ${icon.src}`);
}

console.log(`Manifest validation passed: ${manifest.icons.length} icon(s).`);
