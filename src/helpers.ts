export function cleanupPhone(source: string) {
  return source.replace(/[^+\d]/g, '');
} 