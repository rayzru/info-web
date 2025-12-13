/**
 * MJML Email Template Compiler
 *
 * Compiles MJML source files to HTML for production use.
 * Run in development: bun run scripts/email/compile-templates.ts
 *
 * Source: public/templates/email/src/*.mjml
 * Output: public/templates/email/*.html
 */

import { readdir, mkdir, readFile, writeFile } from "fs/promises";
import { join, basename } from "path";
import { $ } from "bun";
import { minify } from "html-minifier-terser";

const SRC_DIR = join(process.cwd(), "public", "templates", "email", "src");
const OUT_DIR = join(process.cwd(), "public", "templates", "email");

async function compileTemplates() {
  console.log("🔧 Compiling MJML email templates...\n");

  // Ensure output directory exists
  await mkdir(OUT_DIR, { recursive: true });

  // Ensure source directory exists
  try {
    await mkdir(SRC_DIR, { recursive: true });
  } catch {
    // Directory might already exist
  }

  // Read all .mjml files from source directory (excluding includes folder)
  let files: string[];
  try {
    const allFiles = await readdir(SRC_DIR);
    files = allFiles.filter((f) => f.endsWith(".mjml"));
  } catch {
    console.log("📁 Source directory not found. Creating it...");
    await mkdir(SRC_DIR, { recursive: true });
    console.log(`✅ Created: ${SRC_DIR}`);
    console.log("\n📝 Add your .mjml template files to this directory and run again.\n");
    return;
  }

  if (files.length === 0) {
    console.log("⚠️  No .mjml files found in source directory.");
    console.log(`   Add templates to: ${SRC_DIR}\n`);
    return;
  }

  let successCount = 0;
  let errorCount = 0;

  for (const file of files) {
    const srcPath = join(SRC_DIR, file);
    const outName = basename(file, ".mjml") + ".html";
    const outPath = join(OUT_DIR, outName);

    try {
      // Use MJML CLI for compilation
      const result = await $`bunx mjml ${srcPath} -s --config.validationLevel soft`.quiet();

      // Check for any stderr output (warnings)
      const stderr = result.stderr.toString().trim();
      if (stderr) {
        console.warn(`⚠️  ${file} has warnings:`);
        console.warn(`   ${stderr}`);
      }

      // Get the HTML output and minify it with html-minifier-terser
      const html = result.stdout.toString();
      const minified = await minify(html, {
        collapseWhitespace: true,
        removeComments: false, // Keep conditional comments for Outlook
        minifyCSS: true,
        minifyJS: true,
        removeRedundantAttributes: true,
        removeEmptyAttributes: true,
        processConditionalComments: true,
        keepClosingSlash: true,
      });

      await writeFile(outPath, minified, "utf-8");
      console.log(`✅ ${file} → ${outName}`);
      successCount++;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error(`❌ ${file}: ${message}`);
      errorCount++;
    }
  }

  console.log(`\n📊 Results: ${successCount} compiled, ${errorCount} failed`);
}

// Run compilation
compileTemplates().catch(console.error);
