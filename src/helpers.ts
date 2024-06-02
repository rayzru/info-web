

export const pick = <T extends {}, K extends keyof T>(obj: T, ...keys: K[]) => (
  Object.fromEntries(
    keys
      .filter(key => key in obj)
      .map(key => [key, obj[key]])
  ) as Pick<T, K>
);

export function cleanupPhone(source: string) {
  return source.replace(/[^+\d]/g, '');
}

export function formatPhone(source: string): string {
  const p = cleanupPhone(source);
  var match = p.match(/^(\d{2})(\d{3})(\d{3})(\d{2})(\d{2})$/);
  if (!match) {
    return source;
  }
  const [code, a, b, c, d] = match;
  return `${code}\u2009(${a})\u2009${b}-${c}-${d}`;
}
