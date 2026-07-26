import vm from "node:vm";
import {
  extractInlineScripts,
  readProjectFile
} from "./lib/project-validation.mjs";

const htmlFiles = ["index.html", "design-system.html"];
let blockCount = 0;

for (const htmlFile of htmlFiles) {
  const scripts = extractInlineScripts(readProjectFile(htmlFile));
  scripts.forEach((source, index) => {
    new vm.Script(source, { filename: `${htmlFile}:inline-${index + 1}.js` });
    blockCount += 1;
  });
}

console.log(`Inline JavaScript syntax passed: ${blockCount} block(s).`);
