import AsyncStorage from '@react-native-async-storage/async-storage';
import * as aesjs from 'aes-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Storage adapter for the Supabase session.
 *
 * iOS and Android keychains cap entries at a few kilobytes, which a Supabase session exceeds.
 * The documented pattern for Expo: generate a random AES key per entry, keep that key in the
 * keychain (expo-secure-store) and store the AES-encrypted payload in AsyncStorage. On the web,
 * the preview target, plain localStorage via AsyncStorage is used.
 */
export interface SessionStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

const KEYCHAIN_OPTIONS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
};

/** Keychain keys only accept letters, digits, dots, dashes and underscores. */
function keychainKey(key: string): string {
  return `lume.${key.replace(/[^A-Za-z0-9._-]/g, '_')}`;
}

class LargeSecureStore implements SessionStorage {
  private async encrypt(key: string, value: string): Promise<string> {
    const encryptionKey = crypto.getRandomValues(new Uint8Array(256 / 8));
    const cipher = new aesjs.ModeOfOperation.ctr(encryptionKey, new aesjs.Counter(1));
    const encrypted = cipher.encrypt(aesjs.utils.utf8.toBytes(value));
    await SecureStore.setItemAsync(
      keychainKey(key),
      aesjs.utils.hex.fromBytes(encryptionKey),
      KEYCHAIN_OPTIONS,
    );
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  private async decrypt(key: string, value: string): Promise<string | null> {
    const encryptionKeyHex = await SecureStore.getItemAsync(keychainKey(key), KEYCHAIN_OPTIONS);
    if (!encryptionKeyHex) return null;
    const cipher = new aesjs.ModeOfOperation.ctr(
      aesjs.utils.hex.toBytes(encryptionKeyHex),
      new aesjs.Counter(1),
    );
    return aesjs.utils.utf8.fromBytes(cipher.decrypt(aesjs.utils.hex.toBytes(value)));
  }

  async getItem(key: string): Promise<string | null> {
    const encrypted = await AsyncStorage.getItem(key);
    if (!encrypted) return null;
    try {
      return await this.decrypt(key, encrypted);
    } catch {
      // A corrupted or orphaned entry is treated as "no session": the app signs in again.
      await this.removeItem(key);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    const encrypted = await this.encrypt(key, value);
    await AsyncStorage.setItem(key, encrypted);
  }

  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
    await SecureStore.deleteItemAsync(keychainKey(key), KEYCHAIN_OPTIONS);
  }
}

const webStorage: SessionStorage = {
  getItem: (key) => AsyncStorage.getItem(key),
  setItem: (key, value) => AsyncStorage.setItem(key, value),
  removeItem: (key) => AsyncStorage.removeItem(key),
};

export function createSessionStorage(): SessionStorage {
  return Platform.OS === 'web' ? webStorage : new LargeSecureStore();
}
