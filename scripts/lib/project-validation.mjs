import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const projectRoot = fileURLToPath(new URL("../..", import.meta.url));

export function projectPath(relativePath) {
  return path.join(projectRoot, relativePath);
}

export function readProjectFile(relativePath) {
  return fs.readFileSync(projectPath(relativePath), "utf8");
}

export function extractInlineScripts(html) {
  return [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
    .map(match => match[1])
    .filter(source => source.trim());
}

export function assertCheck(condition, message) {
  if (!condition) throw new Error(message);
}

export function localResourcePath(url) {
  if (!url || /^(?:[a-z]+:|#|\/\/)/i.test(url)) return null;
  const normalized = url.split(/[?#]/, 1)[0].replace(/^\.?\//, "");
  return normalized || null;
}

export function walkHtml(node, visitor) {
  visitor(node);
  for (const child of node.childNodes || []) walkHtml(child, visitor);
  if (node.content) walkHtml(node.content, visitor);
}

export function attributesOf(node) {
  return Object.fromEntries((node.attrs || []).map(attribute => [attribute.name, attribute.value]));
}
