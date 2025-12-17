import CryptoJS from 'crypto-js';
import { Injectable } from '@angular/core';

@Injectable()
export default class CryptoUtils {
  // Must be exactly 32 characters
  private static readonly secretKey = 'NDdiMDQ3Njg3NjNkMjJjYTVhMDQyNDgA';

  static encrypt(plainText: string): string {
    // Key analysis and random IV generation
    const key = CryptoJS.enc.Utf8.parse(CryptoUtils.secretKey);
    const iv = CryptoJS.lib.WordArray.random(16); // AES block size is 128 bits = 16 bytes

    const encrypted = CryptoJS.AES.encrypt(plainText, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    // Combine IV and ciphertext, convert to Base64
    const ivBase64 = CryptoJS.enc.Base64.stringify(iv);
    const ciphertextBase64 = encrypted.toString();
    return `${ivBase64}:${ciphertextBase64}`;
  }

  static decrypt(encryptedData: string): string {
    const parts = encryptedData.split(':');

    if (parts.length !== 2) {
      throw new Error('Invalid encrypted data format');
    }

    const iv = CryptoJS.enc.Base64.parse(parts[0]);
    const ciphertext = parts[1]; // This is already a Base64 string
    const key = CryptoJS.enc.Utf8.parse(CryptoUtils.secretKey);
    const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
