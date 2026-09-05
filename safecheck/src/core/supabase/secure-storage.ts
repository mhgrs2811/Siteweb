import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Adaptateur de stockage pour la session Supabase.
 *
 * expo-secure-store (Keychain iOS / Keystore Android) limite chaque entrée à
 * ~2 Ko ; une session Supabase (JWT + refresh token) peut dépasser cette taille.
 * On découpe donc la valeur en fragments, chacun stocké chiffré par l'OS.
 * Sur le web, on retombe sur localStorage (pas de stockage sécurisé équivalent).
 */
const CHUNK_SIZE = 1800;

function chunkKey(key: string, index: number) {
  return `${key}__${index}`;
}
function countKey(key: string) {
  return `${key}__count`;
}

// SecureStore n'accepte que [A-Za-z0-9._-]
function safeKey(key: string) {
  return key.replace(/[^A-Za-z0-9._-]/g, '_');
}

export const secureSessionStorage = {
  async getItem(rawKey: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return typeof localStorage === 'undefined' ? null : localStorage.getItem(rawKey);
    }
    const key = safeKey(rawKey);
    const count = Number(await SecureStore.getItemAsync(countKey(key)));
    if (!count) return null;
    const parts = await Promise.all(
      Array.from({ length: count }, (_, i) => SecureStore.getItemAsync(chunkKey(key, i))),
    );
    if (parts.some((p) => p === null)) return null;
    return parts.join('');
  },

  async setItem(rawKey: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') localStorage.setItem(rawKey, value);
      return;
    }
    const key = safeKey(rawKey);
    await this.removeItem(rawKey);
    const chunks: string[] = [];
    for (let i = 0; i < value.length; i += CHUNK_SIZE) chunks.push(value.slice(i, i + CHUNK_SIZE));
    await Promise.all(chunks.map((c, i) => SecureStore.setItemAsync(chunkKey(key, i), c)));
    await SecureStore.setItemAsync(countKey(key), String(chunks.length));
  },

  async removeItem(rawKey: string): Promise<void> {
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') localStorage.removeItem(rawKey);
      return;
    }
    const key = safeKey(rawKey);
    const count = Number(await SecureStore.getItemAsync(countKey(key)));
    await Promise.all([
      SecureStore.deleteItemAsync(countKey(key)),
      ...Array.from({ length: count || 0 }, (_, i) => SecureStore.deleteItemAsync(chunkKey(key, i))),
    ]);
  },
};
