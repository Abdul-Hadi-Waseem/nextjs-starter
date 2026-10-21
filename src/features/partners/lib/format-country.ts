let regionNames: Intl.DisplayNames | undefined;

/** `'DE'` → `'Germany'`. Falls back to the code when the runtime doesn't know it. */
export function formatCountry(code: string) {
  regionNames ??= new Intl.DisplayNames(['en'], { type: 'region' });
  try {
    return regionNames.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}
