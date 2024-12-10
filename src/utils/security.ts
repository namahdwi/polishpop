import crypto from 'crypto';
import DOMPurify from 'dompurify';

export class Security {
  private static readonly ENCRYPTION_KEY = import.meta.env.ENCRYPTION_KEY;
  private static readonly ALGORITHM = 'aes-256-gcm';

  static encrypt(text: string): string {
    const { encryptedData, iv, authTag } = this.encryptData(text);
    // Combine encrypted data, IV, and auth tag into a single string
    return `${encryptedData}.${iv}.${authTag}`;
  }

  static decrypt(encryptedString: string): string {
    const [encryptedData, iv, authTag] = encryptedString.split('.');
    return this.decryptData(encryptedData, iv, authTag);
  }

  private static encryptData(text: string): { encryptedData: string; iv: string; authTag: string } {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(
      this.ALGORITHM,
      Buffer.from(this.ENCRYPTION_KEY!, 'hex'),
      iv
    );

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');

    return {
      encryptedData: encrypted,
      iv: iv.toString('hex'),
      authTag,
    };
  }

  private static decryptData(encrypted: string, iv: string, authTag: string): string {
    const decipher = crypto.createDecipheriv(
      this.ALGORITHM,
      Buffer.from(this.ENCRYPTION_KEY!, 'hex'),
      Buffer.from(iv, 'hex')
    );

    decipher.setAuthTag(Buffer.from(authTag, 'hex'));

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  static sanitizeInput(input: string): string {
    if (typeof input !== 'string') return input;
    
    // Remove any HTML/script tags
    const sanitized = DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [], // No HTML tags allowed
      ALLOWED_ATTR: [] // No attributes allowed
    });

    // Additional sanitization
    return sanitized
      .trim()
      .replace(/[<>]/g, '') // Remove any remaining brackets
      .replace(/[^\w\s@.-]/g, ''); // Only allow alphanumeric, @, ., - and whitespace
  }
}

export const sanitizeInput = Security.sanitizeInput; 