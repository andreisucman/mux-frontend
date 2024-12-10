type StorageValue = object | any[] | string | ArrayBuffer | number | boolean | null;

export function saveToLocalStorage(
  key: string,
  value: StorageValue,
  mode: "add" | "replace" = "replace"
): void {
  if (typeof window === "undefined") return;

  const existingValueRaw = localStorage.getItem(`MUX_${key}`);
  let existingValue: StorageValue = null;

  try {
    existingValue = existingValueRaw ? JSON.parse(existingValueRaw) : null;
  } catch (error) {
    throw new Error(`Failed to parse existing value for key "${key}": ${error}`);
  }

  if (mode === "add" && existingValue) {
    if (Array.isArray(existingValue) && Array.isArray(value)) {
      localStorage.setItem(`MUX_${key}`, JSON.stringify([...existingValue, ...value]));
    } else if (
      typeof existingValue === "object" &&
      !Array.isArray(existingValue) &&
      typeof value === "object" &&
      value !== null
    ) {
      localStorage.setItem(`MUX_${key}`, JSON.stringify({ ...existingValue, ...value }));
    } else {
      throw new Error(
        `Cannot add value. Existing value for key "${key}" must be an array or object to use "add" mode.`
      );
    }
  } else {
    localStorage.setItem(`MUX_${key}`, JSON.stringify(value));
  }
}

export function getFromLocalStorage<T extends StorageValue>(key: string): T | null {
  if (typeof window === "undefined") return null;

  const rawValue = localStorage.getItem(`MUX_${key}`);

  if (rawValue === null) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch (error) {
    throw new Error(`Failed to parse value for key "${key}": ${error}`);
  }
}

export function deleteFromLocalStorage(key: string, toDeleteKey?: string): void {
  if (typeof window === "undefined") return;

  const rawValue = localStorage.getItem(`MUX_${key}`);

  if (!rawValue) return;

  if (toDeleteKey) {
    try {
      const parsedValue = JSON.parse(rawValue);
      delete parsedValue[toDeleteKey];
      if (Object.keys(parsedValue).length === 0) {
        localStorage.removeItem(`MUX_${key}`);
      } else {
        localStorage.setItem(`MUX_${key}`, JSON.stringify(parsedValue));
      }
    } catch (err) {
      console.log("Error in deleteFromLocalStorage: ", err);
    }
  } else {
    localStorage.removeItem(`MUX_${key}`);
  }
}
