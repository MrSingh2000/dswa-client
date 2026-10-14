export const setLocalStorage = <T>(
  key: (typeof LocalStorageKeys)[keyof typeof LocalStorageKeys],
  value: T,
) => {
  if (!value) return;
  return localStorage.setItem(key, JSON.stringify(value));
};

export const getLocalStorage = <T>(
  key: (typeof LocalStorageKeys)[keyof typeof LocalStorageKeys],
): T | null => {
  const data = localStorage.getItem(key);
  if (!data) return null;
  return JSON.parse(data);
};

export const clearLocalStorage = () => {
  for (const key of Object.values(LocalStorageKeys)) {
    localStorage.removeItem(key);
  }
};

export const LocalStorageKeys = {
  token: "token",
};
