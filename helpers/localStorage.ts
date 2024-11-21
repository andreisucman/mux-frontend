type StorageValue = object | any[] | string | number | boolean | null;

export function saveToLocalStorage(
  key: string,
  value: StorageValue,
  mode: "add" | "replace" = "replace"
): void {
  const existingValueRaw = localStorage.getItem(key);
  let existingValue: StorageValue = null;

  try {
    existingValue = existingValueRaw ? JSON.parse(existingValueRaw) : null;
  } catch (error) {
    throw new Error(`Failed to parse existing value for key "${key}": ${error}`);
  }

  if (mode === "add" && existingValue) {
    if (Array.isArray(existingValue) && Array.isArray(value)) {
      localStorage.setItem(key, JSON.stringify([...existingValue, ...value]));
    } else if (
      typeof existingValue === "object" &&
      !Array.isArray(existingValue) &&
      typeof value === "object" &&
      value !== null
    ) {
      localStorage.setItem(key, JSON.stringify({ ...existingValue, ...value }));
    } else {
      throw new Error(
        `Cannot add value. Existing value for key "${key}" must be an array or object to use "add" mode.`
      );
    }
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export function getFromLocalStorage<T extends StorageValue>(key: string): T | null {
  const rawValue = localStorage.getItem(key);

  if (rawValue === null) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch (error) {
    throw new Error(`Failed to parse value for key "${key}": ${error}`);
  }
}

export function deleteFromLocalStorage(key: string): void {
  localStorage.removeItem(key);
}
