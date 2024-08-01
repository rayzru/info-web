export function cleanupPhone(source: string) {
  return source.replace(/[^+\d]/g, '');
}

export const pick = <T extends {}, K extends keyof T>(obj: T, ...keys: K[]) => (
  Object.fromEntries(
    keys
      .filter(key => key in obj)
      .map(key => [key, obj[key]])
  ) as Pick<T, K>
);

export function formatPhone(source: string): string {
  const p = cleanupPhone(source);
  // eslint-disable-next-line no-irregular-whitespace
  return `${p.substring(0, 2)} (${p.substring(2, 5)}) ${p.substring(5, 8)}-${p.substring(8, 10)}-${p.substring(10, 12)}`;
}
