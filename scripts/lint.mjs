import path from "node:path";
import { ESLint } from "eslint";
import {
  extractInlineScripts,
  projectRoot,
  readProjectFile
} from "./lib/project-validation.mjs";

process.chdir(projectRoot);

const eslint = new ESLint();
const results = await eslint.lintFiles([
  "eslint.config.mjs",
  "scripts/**/*.mjs",
  "tests/**/*.js",
  "sw.js"
]);

for (const htmlFile of ["index.html", "design-system.html"]) {
  const scripts = extractInlineScripts(readProjectFile(htmlFile));
  for (const [index, source] of scripts.entries()) {
    const wrappedSource = `(() => {\n${source}\n})();`;
    const [result] = await eslint.lintText(wrappedSource, {
      filePath: path.join(projectRoot, `${path.basename(htmlFile)}-${index + 1}.browser.js`)
    });
    results.push(result);
  }
}

const formatter = await eslint.loadFormatter("stylish");
const output = formatter.format(results);
if (output) process.stdout.write(output);

const errorCount = results.reduce((total, result) => total + result.errorCount, 0);
const warningCount = results.reduce((total, result) => total + result.warningCount, 0);

console.log(`Lint completed: ${errorCount} error(s), ${warningCount} warning(s).`);
if (errorCount > 0) process.exitCode = 1;
