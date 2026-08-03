export function loadFromStorage<T>(
  key: string,
  fallback: T
): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const value = localStorage.getItem(key);

    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(
  key: string,
  value: T
) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    key,
    JSON.stringify(value)
  );
}

export function removeFromStorage(
  key: string
) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(key);
}