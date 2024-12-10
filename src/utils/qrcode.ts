import QRCode from 'qrcode';

export async function generateQRCode(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text);
  } catch (error) {
    throw new Error('Failed to generate QR code');
  }
} 