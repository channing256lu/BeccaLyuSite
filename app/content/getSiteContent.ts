import type { SiteContent } from "./siteContent";
import siteMarkdown from "../../content/site.md?raw";
import sharedMarkdown from "../../content/pages/00-shared.md?raw";
import homeMarkdown from "../../content/pages/01-home.md?raw";
import aboutMarkdown from "../../content/pages/02-about.md?raw";
import philosophyMarkdown from "../../content/pages/03-philosophy.md?raw";
import evidenceMarkdown from "../../content/pages/04-evidence.md?raw";
import contactMarkdown from "../../content/pages/05-contact.md?raw";

const editableMarkdown = [
  sharedMarkdown,
  homeMarkdown,
  aboutMarkdown,
  philosophyMarkdown,
  evidenceMarkdown,
  contactMarkdown,
].join("\n\n");

type EditableValue = string | string[];

export function getSiteContent(): SiteContent {
  const jsonBlock = siteMarkdown.match(/```json\s*([\s\S]*?)```/);

  if (!jsonBlock) {
    throw new Error("content/site.md must contain a fenced json block.");
  }

  const content = JSON.parse(jsonBlock[1]) as SiteContent;

  if (!editableMarkdown) {
    return content;
  }

  return applyEditableMarkdown(content, editableMarkdown);
}

function applyEditableMarkdown(
  content: SiteContent,
  markdown: string,
): SiteContent {
  const next = structuredClone(content);
  const fieldPattern =
    /<!--\s*site:\s*([^>]+?)\s*-->\s*([\s\S]*?)\s*<!--\s*\/site\s*-->/g;

  for (const match of markdown.matchAll(fieldPattern)) {
    const pathParts = match[1].trim().split(".");
    const value = parseEditableValue(match[2]);

    if (value.length === 0) {
      continue;
    }

    setDeepValue(next, pathParts, value);
  }

  return next;
}

function parseEditableValue(raw: string): EditableValue {
  const value = raw.trim();
  const lines = value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length > 0 && lines.every((line) => line.startsWith("- "))) {
    return lines.map((line) => line.slice(2).trim());
  }

  return value.replace(/\n{3,}/g, "\n\n");
}

function setDeepValue(
  target: Record<string, unknown>,
  pathParts: string[],
  value: EditableValue,
) {
  let cursor: unknown = target;

  pathParts.slice(0, -1).forEach((part) => {
    if (Array.isArray(cursor)) {
      cursor = cursor[Number(part)];
      return;
    }

    if (cursor && typeof cursor === "object") {
      cursor = (cursor as Record<string, unknown>)[part];
    }
  });

  const key = pathParts.at(-1);
  if (!key || !cursor || typeof cursor !== "object") {
    return;
  }

  if (Array.isArray(cursor)) {
    cursor[Number(key)] = value;
    return;
  }

  (cursor as Record<string, unknown>)[key] = value;
}
