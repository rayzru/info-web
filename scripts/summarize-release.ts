#!/usr/bin/env bun

/**
 * AI-Powered Release Summarizer
 *
 * Uses git diff analysis + AI to generate human-readable release notes
 * for announcing updates on the website.
 *
 * Usage:
 *   bun run scripts/summarize-release.ts [from] [to]
 */

import { $ } from "bun";
import { writeFile, readFile } from "fs/promises";

interface ReleaseContext {
  from: string;
  to: string;
  filesChanged: number;
  linesAdded: number;
  linesDeleted: number;
  commits: string[];
  majorChanges: string[];
  categories: Record<string, number>;
}

async function analyzeChanges(from: string, to: string): Promise<ReleaseContext> {
  console.log(`📊 Analyzing changes from ${from} to ${to}...`);

  // Get commit messages
  const log = await $`git log ${from}..${to} --oneline`.text();
  const commits = log.trim().split("\n").filter(Boolean);

  // Get stats
  const diffStat = await $`git diff ${from}..${to} --shortstat`.text();
  const statsMatch = diffStat.match(/(\d+) files? changed(?:, (\d+) insertions?\(\+\))?(?:, (\d+) deletions?\(-\))?/);

  const filesChanged = statsMatch ? parseInt(statsMatch[1] ?? "0") : 0;
  const linesAdded = statsMatch ? parseInt(statsMatch[2] ?? "0") : 0;
  const linesDeleted = statsMatch ? parseInt(statsMatch[3] ?? "0") : 0;

  // Get major file changes (>100 lines changed)
  const numstat = await $`git diff ${from}..${to} --numstat`.text();
  const majorChanges: string[] = [];
  const categories: Record<string, number> = {};

  for (const line of numstat.split("\n")) {
    if (!line) continue;
    const [adds, dels, file] = line.split("\t");
    if (!file) continue;

    const added = adds === "-" ? 0 : parseInt(adds);
    const deleted = dels === "-" ? 0 : parseInt(dels);
    const total = added + deleted;

    if (total > 100) {
      majorChanges.push(`${file} (+${added} -${deleted})`);
    }

    // Categorize
    const category = getCategoryFromPath(file);
    categories[category] = (categories[category] ?? 0) + total;
  }

  return {
    from,
    to,
    filesChanged,
    linesAdded,
    linesDeleted,
    commits,
    majorChanges: majorChanges.slice(0, 20),
    categories,
  };
}

function getCategoryFromPath(path: string): string {
  if (path.startsWith("drizzle/")) return "Database";
  if (path.startsWith("src/server/api/")) return "API";
  if (path.startsWith("src/components/")) return "Components";
  if (path.startsWith("src/app/")) return "Pages";
  if (path.includes("auth")) return "Authentication";
  if (path.endsWith(".md")) return "Documentation";
  if (path.startsWith("scripts/")) return "Scripts";
  return "Other";
}

async function generateAISummary(context: ReleaseContext): Promise<string> {
  console.log("🤖 Generating AI summary...");

  const prompt = `Analyze these git changes and create a concise, user-friendly release announcement in Russian.

Context:
- Files changed: ${context.filesChanged}
- Lines added: ${context.linesAdded}
- Lines deleted: ${context.linesDeleted}
- Period: ${context.from} → ${context.to}

Recent commits:
${context.commits.slice(0, 10).join("\n")}

Major changes by category:
${Object.entries(context.categories)
  .sort(([, a], [, b]) => b - a)
  .map(([cat, lines]) => `- ${cat}: ${lines} lines changed`)
  .join("\n")}

Top changed files:
${context.majorChanges.slice(0, 10).join("\n")}

Create a release summary with:
1. Headline in Russian (exciting, user-focused)
2. 3-5 key improvements (user benefits, not technical details)
3. Brief technical summary for developers
4. Keep it concise and engaging

Format as markdown.`;

  // For now, create a template. Later can integrate with AI API
  const summary = `# 🎉 Обновление системы

## Основные улучшения

### Что нового:

${generateKeyPoints(context)}

## Технические изменения

${generateTechnicalSummary(context)}

---

**Статистика**: ${context.filesChanged} файлов изменено | +${context.linesAdded} / -${context.linesDeleted} строк
**Коммитов**: ${context.commits.length}
`;

  return summary;
}

function generateKeyPoints(context: ReleaseContext): string {
  const points: string[] = [];

  // Analyze commit messages for patterns
  const commitText = context.commits.join(" ").toLowerCase();

  if (commitText.includes("migration") || context.categories["Database"] > 1000) {
    points.push("✅ **Обновление базы данных** - добавлены новые данные о квартирах");
  }

  if (commitText.includes("component") || context.categories["Components"] > 500) {
    points.push("🎨 **Улучшен интерфейс** - обновлены компоненты для лучшего опыта");
  }

  if (commitText.includes("api") || context.categories["API"] > 500) {
    points.push("⚡ **Оптимизация API** - улучшена производительность");
  }

  if (commitText.includes("fix") || commitText.includes("bug")) {
    points.push("🐛 **Исправления** - устранены обнаруженные ошибки");
  }

  if (points.length === 0) {
    points.push("🔧 **Технические улучшения** - обновление и оптимизация системы");
  }

  return points.join("\n");
}

function generateTechnicalSummary(context: ReleaseContext): string {
  const topCategories = Object.entries(context.categories)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return `**Основные области изменений**:

${topCategories.map(([cat, lines]) => `- **${cat}**: ~${lines.toLocaleString()} строк`).join("\n")}

<details>
<summary>Последние коммиты (${context.commits.length})</summary>

${context.commits.slice(0, 20).join("\n")}

${context.commits.length > 20 ? `\n*... ещё ${context.commits.length - 20} коммитов*` : ""}
</details>`;
}

async function main() {
  const args = process.argv.slice(2);
  const from = args[0] ?? "main";
  const to = args[1] ?? "HEAD";

  try {
    // Analyze changes
    const context = await analyzeChanges(from, to);

    // Generate summary
    const summary = await generateAISummary(context);

    // Save to file
    const outputFile = `RELEASE_SUMMARY_${from}_to_${to}.md`.replace(/\//g, "_");
    await writeFile(outputFile, summary);

    console.log(`\n✅ Summary generated!`);
    console.log(`📄 Saved to: ${outputFile}\n`);
    console.log(summary);

    // Also update a standard RELEASE_SUMMARY.md for easy access
    await writeFile("RELEASE_SUMMARY.md", summary);
    console.log(`\n📄 Also saved to: RELEASE_SUMMARY.md`);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

main();
