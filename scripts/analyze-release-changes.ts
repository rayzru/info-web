#!/usr/bin/env bun

/**
 * Release Changes Analyzer
 *
 * Analyzes git diff between branches/tags and creates structured summary
 * of all changes for release notes.
 *
 * Usage:
 *   bun run scripts/analyze-release-changes.ts [from] [to]
 *   bun run scripts/analyze-release-changes.ts main HEAD
 *   bun run scripts/analyze-release-changes.ts v0.1.0 v0.2.0
 */

import { $ } from "bun";
import { writeFile } from "fs/promises";

interface FileChange {
  file: string;
  additions: number;
  deletions: number;
  type: "added" | "modified" | "deleted" | "renamed";
}

interface CategoryChanges {
  category: string;
  files: FileChange[];
  totalAdditions: number;
  totalDeletions: number;
}

async function getChangedFiles(from: string, to: string): Promise<FileChange[]> {
  const changes: FileChange[] = [];

  // Get numstat (additions, deletions per file)
  const numstat = await $`git diff ${from}..${to} --numstat`.text();
  const lines = numstat.trim().split("\n").filter(Boolean);

  for (const line of lines) {
    const [additions, deletions, file] = line.split("\t");

    if (!file) continue;

    // Check if file was renamed
    let filename = file;
    let type: FileChange["type"] = "modified";

    if (file.includes(" => ")) {
      type = "renamed";
      filename = file.split(" => ")[1] ?? file;
    }

    changes.push({
      file: filename,
      additions: additions === "-" ? 0 : parseInt(additions),
      deletions: deletions === "-" ? 0 : parseInt(deletions),
      type,
    });
  }

  // Get added/deleted files
  const statusOutput = await $`git diff ${from}..${to} --name-status`.text();
  const statusLines = statusOutput.trim().split("\n").filter(Boolean);

  for (const line of statusLines) {
    const [status, ...pathParts] = line.split("\t");
    const path = pathParts.join("\t");

    if (status === "A") {
      const existing = changes.find((c) => c.file === path);
      if (existing) {
        existing.type = "added";
      }
    } else if (status === "D") {
      const existing = changes.find((c) => c.file === path);
      if (existing) {
        existing.type = "deleted";
      }
    }
  }

  return changes;
}

function categorizeChanges(changes: FileChange[]): CategoryChanges[] {
  const categories = new Map<string, FileChange[]>();

  for (const change of changes) {
    const category = detectCategory(change.file);
    const existing = categories.get(category) ?? [];
    existing.push(change);
    categories.set(category, existing);
  }

  return Array.from(categories.entries())
    .map(([category, files]) => ({
      category,
      files,
      totalAdditions: files.reduce((sum, f) => sum + f.additions, 0),
      totalDeletions: files.reduce((sum, f) => sum + f.deletions, 0),
    }))
    .sort((a, b) => b.totalAdditions - a.totalAdditions);
}

function detectCategory(file: string): string {
  // Database & Migrations
  if (file.startsWith("drizzle/") || file.startsWith("src/server/db/")) {
    return "Database & Migrations";
  }

  // API & Backend
  if (file.startsWith("src/server/api/")) {
    return "API & Backend";
  }

  // Server Logic
  if (file.startsWith("src/server/")) {
    return "Server Logic";
  }

  // UI Components
  if (file.startsWith("src/components/")) {
    return "UI Components";
  }

  // Pages & Routes
  if (file.startsWith("src/app/")) {
    return "Pages & Routes";
  }

  // Authentication
  if (file.includes("auth")) {
    return "Authentication";
  }

  // Configuration
  if (
    file.endsWith(".config.js") ||
    file.endsWith(".config.ts") ||
    file.endsWith(".json") ||
    file === "tsconfig.json" ||
    file === "package.json"
  ) {
    return "Configuration";
  }

  // Documentation
  if (file.endsWith(".md") || file.startsWith("docs/")) {
    return "Documentation";
  }

  // Scripts & Tools
  if (file.startsWith("scripts/") || file.startsWith(".claude/")) {
    return "Scripts & Tools";
  }

  // Styling
  if (file.endsWith(".css") || file.includes("tailwind")) {
    return "Styling";
  }

  // Dependencies
  if (file === "package.json" || file === "bun.lock" || file === "package-lock.json") {
    return "Dependencies";
  }

  // Other
  return "Other";
}

async function getCommitSummaries(from: string, to: string): Promise<string[]> {
  const log = await $`git log ${from}..${to} --oneline`.text();
  return log.trim().split("\n").filter(Boolean);
}

async function generateReport(from: string, to: string): Promise<string> {
  console.log(`📊 Analyzing changes from ${from} to ${to}...`);

  const changes = await getChangedFiles(from, to);
  const categories = categorizeChanges(changes);
  const commits = await getCommitSummaries(from, to);

  const totalAdditions = changes.reduce((sum, c) => sum + c.additions, 0);
  const totalDeletions = changes.reduce((sum, c) => sum + c.deletions, 0);
  const netChange = totalAdditions - totalDeletions;

  let report = `# 📋 Release Changes Analysis\n\n`;
  report += `**Period**: \`${from}\` → \`${to}\`\n`;
  report += `**Date**: ${new Date().toISOString().split("T")[0]}\n\n`;

  report += `## 📊 Summary Statistics\n\n`;
  report += `- **Files changed**: ${changes.length}\n`;
  report += `- **Lines added**: +${totalAdditions.toLocaleString()}\n`;
  report += `- **Lines deleted**: -${totalDeletions.toLocaleString()}\n`;
  report += `- **Net change**: ${netChange >= 0 ? "+" : ""}${netChange.toLocaleString()}\n`;
  report += `- **Commits**: ${commits.length}\n\n`;

  report += `## 🗂️ Changes by Category\n\n`;

  for (const category of categories) {
    report += `### ${category.category}\n\n`;
    report += `**Impact**: +${category.totalAdditions} -${category.totalDeletions} lines | ${category.files.length} files\n\n`;

    const addedFiles = category.files.filter((f) => f.type === "added");
    const modifiedFiles = category.files.filter((f) => f.type === "modified");
    const deletedFiles = category.files.filter((f) => f.type === "deleted");
    const renamedFiles = category.files.filter((f) => f.type === "renamed");

    if (addedFiles.length > 0) {
      report += `**New files** (${addedFiles.length}):\n`;
      for (const file of addedFiles.slice(0, 10)) {
        report += `- ✨ \`${file.file}\` (+${file.additions})\n`;
      }
      if (addedFiles.length > 10) {
        report += `- *... and ${addedFiles.length - 10} more*\n`;
      }
      report += `\n`;
    }

    if (modifiedFiles.length > 0) {
      report += `**Modified files** (${modifiedFiles.length}):\n`;
      const significantChanges = modifiedFiles
        .filter((f) => f.additions + f.deletions > 10)
        .sort((a, b) => b.additions + b.deletions - (a.additions + a.deletions))
        .slice(0, 10);

      for (const file of significantChanges) {
        report += `- 📝 \`${file.file}\` (+${file.additions} -${file.deletions})\n`;
      }

      const minorChanges = modifiedFiles.filter((f) => f.additions + f.deletions <= 10).length;
      if (minorChanges > 0) {
        report += `- *... and ${minorChanges} files with minor changes*\n`;
      }
      report += `\n`;
    }

    if (deletedFiles.length > 0) {
      report += `**Deleted files** (${deletedFiles.length}):\n`;
      for (const file of deletedFiles.slice(0, 5)) {
        report += `- 🗑️ \`${file.file}\`\n`;
      }
      if (deletedFiles.length > 5) {
        report += `- *... and ${deletedFiles.length - 5} more*\n`;
      }
      report += `\n`;
    }

    if (renamedFiles.length > 0) {
      report += `**Renamed files** (${renamedFiles.length}):\n`;
      for (const file of renamedFiles.slice(0, 5)) {
        report += `- 🔄 \`${file.file}\`\n`;
      }
      report += `\n`;
    }
  }

  report += `## 📝 Recent Commits\n\n`;
  report += `<details>\n<summary>Show ${commits.length} commits</summary>\n\n`;
  for (const commit of commits.slice(0, 50)) {
    report += `- ${commit}\n`;
  }
  if (commits.length > 50) {
    report += `\n*... and ${commits.length - 50} more commits*\n`;
  }
  report += `\n</details>\n\n`;

  report += `---\n\n`;
  report += `*Generated with \`scripts/analyze-release-changes.ts\`*\n`;

  return report;
}

async function main() {
  const args = process.argv.slice(2);
  const from = args[0] ?? "main";
  const to = args[1] ?? "HEAD";

  try {
    const report = await generateReport(from, to);

    const outputFile = `RELEASE_CHANGES_${from}_to_${to}.md`.replace(/\//g, "_");
    await writeFile(outputFile, report);

    console.log(`\n✅ Analysis complete!`);
    console.log(`📄 Report saved to: ${outputFile}\n`);
    console.log(report);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

main();
