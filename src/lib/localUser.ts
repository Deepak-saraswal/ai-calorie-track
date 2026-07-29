import * as SecureStore from "expo-secure-store";

const CACHED_USER_KEY = "pennywise.cached-user";

export type CachedUser = {
  id: string;
  firstName: string | null;
  email: string | null;
  imageUrl: string | null;
  cachedAt: string;
};

/** Stores only display data. Clerk's encrypted session token remains the auth source of truth. */
export async function cacheUser(user: CachedUser) {
  await SecureStore.setItemAsync(CACHED_USER_KEY, JSON.stringify(user));
}

export async function getCachedUser(): Promise<CachedUser | null> {
  try {
    const value = await SecureStore.getItemAsync(CACHED_USER_KEY);
    return value ? (JSON.parse(value) as CachedUser) : null;
  } catch {
    return null;
  }
}

export async function clearCachedUser() {
  await SecureStore.deleteItemAsync(CACHED_USER_KEY);
}
