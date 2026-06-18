export function readStorageValue<T>(key: string, isValid: (value: unknown) => value is T): T | null {
  try {
    const rawValue = localStorage.getItem(key);

    if (!rawValue) {
      return null;
    }

    const parsedValue: unknown = JSON.parse(rawValue);

    return isValid(parsedValue) ? parsedValue : null;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

export function writeStorageValue<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota and privacy-mode failures; gameplay should continue.
  }
}

export function removeStorageValue(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore storage failures.
  }
}
