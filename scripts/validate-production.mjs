import fs from "node:fs";
import { parse } from "parse5";
import {
  assertCheck,
  attributesOf,
  localResourcePath,
  projectPath,
  readProjectFile,
  walkHtml
} from "./lib/project-validation.mjs";

const indexHtml = readProjectFile("index.html");
const showcaseHtml = readProjectFile("design-system.html");
const serviceWorker = readProjectFile("sw.js");
const manifest = JSON.parse(readProjectFile("manifest.webmanifest"));
const designSystem = readProjectFile("styles/design-system.css");
const parseErrors = [];
const document = parse(indexHtml, { onParseError: error => parseErrors.push(error) });

assertCheck(parseErrors.length === 0, `index.html parse error(s): ${parseErrors.map(error => error.code).join(", ")}`);

const localReferences = new Set();
const navigationTargets = new Set();
let manifestLinkFound = false;
let viewportFound = false;

walkHtml(document, node => {
  const attributes = attributesOf(node);
  if (node.nodeName === "meta" && attributes.name === "viewport") viewportFound = true;
  if (node.nodeName === "link" && attributes.rel === "manifest") manifestLinkFound = true;
  if (attributes["data-view"]) navigationTargets.add(attributes["data-view"]);
  for (const attributeName of ["href", "src"]) {
    const resource = localResourcePath(attributes[attributeName]);
    if (resource) localReferences.add(resource);
  }
});

assertCheck(viewportFound, "Production HTML requires a viewport meta tag.");
assertCheck(manifestLinkFound, "Production HTML requires a manifest link.");
for (const target of ["today", "calendar", "reports", "ai", "settings"]) {
  assertCheck(navigationTargets.has(target), `Missing primary navigation target: ${target}`);
}
for (const resource of localReferences) {
  assertCheck(fs.existsSync(projectPath(resource)), `Production HTML resource is missing: ${resource}`);
}

const cacheMatch = serviceWorker.match(/const CACHE_NAME = "([^"]+)"/);
assertCheck(cacheMatch, "Service Worker cache name is missing.");
assertCheck(/^driver-pay-pro-v\d+$/.test(cacheMatch[1]), `Invalid Service Worker cache name: ${cacheMatch[1]}`);

const shellMatch = serviceWorker.match(/const APP_SHELL = (\[[\s\S]*?\]);/);
assertCheck(shellMatch, "Service Worker App Shell is missing.");
const appShell = JSON.parse(shellMatch[1]);
for (const resource of appShell) {
  if (resource === "./") continue;
  const relativePath = resource.replace(/^\.\//, "");
  assertCheck(fs.existsSync(projectPath(relativePath)), `Service Worker cache resource is missing: ${resource}`);
}
assertCheck(appShell.includes("./index.html"), "Service Worker App Shell must include index.html.");
assertCheck(appShell.includes("./manifest.webmanifest"), "Service Worker App Shell must include the manifest.");
assertCheck(/event\.request\.mode === "navigate"/.test(serviceWorker), "Service Worker navigation detection is missing.");
assertCheck(/caches\.match\("\.\/index\.html"\)/.test(serviceWorker), "Service Worker navigation fallback is missing.");
assertCheck(!/window\.location\.reload\(\)/.test(indexHtml), "PWA update must not reload an interactive page.");
assertCheck(!/skipWaiting\(\)|clients\.claim\(\)/.test(serviceWorker), "Service Worker update must wait for the next natural app launch.");

assertCheck(manifest.start_url === "./" && manifest.scope === "./", "Manifest start_url and scope must remain relative.");
for (const icon of manifest.icons || []) {
  assertCheck(fs.existsSync(projectPath(icon.src)), `Manifest icon is missing: ${icon.src}`);
}

const productionSources = {
  "index.html": indexHtml,
  "design-system.html": showcaseHtml,
  "styles/design-system.css": designSystem,
  "sw.js": serviceWorker,
  "manifest.webmanifest": JSON.stringify(manifest)
};
const combinedProductionSource = Object.values(productionSources).join("\n");
const storageKeys = [...combinedProductionSource.matchAll(/driverPayApp\.v\d+/g)].map(match => match[0]);

assertCheck(storageKeys.length > 0, "Canonical localStorage key is missing.");
assertCheck(storageKeys.every(key => key === "driverPayApp.v2"), `Unexpected localStorage key found: ${storageKeys.join(", ")}`);

const forbiddenPatterns = [
  { label: "localhost URL", pattern: /https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?/i },
  { label: "Cloudflare QA tunnel URL", pattern: /https?:\/\/[^\s"'<>]*trycloudflare\.com/i },
  { label: "Vercel Preview share token", pattern: /_vercel_share|VERCEL_AUTOMATION_BYPASS_SECRET/i },
  { label: "development test fixture", pattern: /tests\/fixtures|__TEST_DATA__|QA_TUNNEL_URL/i },
  { label: "obvious embedded secret", pattern: /(?:api[_-]?key|client[_-]?secret|access[_-]?token)\s*[:=]\s*["'][^"']{12,}["']/i }
];

for (const { label, pattern } of forbiddenPatterns) {
  assertCheck(!pattern.test(combinedProductionSource), `Production source contains ${label}.`);
}

assertCheck(!/<nav class="nav"/.test(showcaseHtml), "Design System showcase must not include Bottom Navigation.");
assertCheck(!appShell.includes("./design-system.html"), "Design System showcase must remain outside the App Shell.");

console.log(`Production validation passed: ${localReferences.size} HTML resource(s), ${appShell.length} App Shell resource(s), cache ${cacheMatch[1]}.`);
