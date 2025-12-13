/**
 * Transliteration map for Cyrillic to Latin
 */
const translitMap: Record<string, string> = {
  // Russian
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "yo",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "kh",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "shch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
  // Ukrainian specific
  є: "ye",
  і: "i",
  ї: "yi",
  ґ: "g",
};

/**
 * Transliterate Cyrillic text to Latin
 */
export function transliterate(text: string): string {
  return text
    .split("")
    .map((char) => {
      const lower = char.toLowerCase();
      const translitChar = translitMap[lower];

      if (translitChar !== undefined) {
        // Preserve case for first letter
        return char === lower
          ? translitChar
          : translitChar.charAt(0).toUpperCase() + translitChar.slice(1);
      }

      return char;
    })
    .join("");
}

/**
 * Generate URL-friendly slug from text
 * - Transliterates Cyrillic to Latin
 * - Converts to lowercase
 * - Replaces spaces and special chars with dashes
 * - Removes consecutive dashes
 */
export function generateSlug(text: string): string {
  return transliterate(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/-+/g, "-") // Remove consecutive dashes
    .replace(/^-|-$/g, ""); // Remove leading/trailing dashes
}

/**
 * Generate slug with date prefix for news articles
 * Format: YYYY-MM-DD-slug-text
 */
export function generateNewsSlug(
  title: string,
  date: Date = new Date()
): string {
  const dateStr = date.toISOString().slice(0, 10); // YYYY-MM-DD
  const titleSlug = generateSlug(title).slice(0, 100);

  return `${dateStr}-${titleSlug}`;
}
