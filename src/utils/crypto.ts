import { randomBytes, createHmac } from 'crypto';

export function generateToken(secret: string): string {
  // Generate a random string
  const randomString = randomBytes(32).toString('hex');
  
  // Create HMAC
  const hmac = createHmac('sha256', secret);
  hmac.update(randomString);
  
  // Combine random string and HMAC
  return `${randomString}.${hmac.digest('hex')}`;
}

export function verifyToken(token: string, secret: string): boolean {
  try {
    const [randomString, hmac] = token.split('.');
    
    // Recreate HMAC
    const verifyHmac = createHmac('sha256', secret);
    verifyHmac.update(randomString);
    
    // Compare HMACs
    return hmac === verifyHmac.digest('hex');
  } catch {
    return false;
  }
} 