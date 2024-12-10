import { useState, useEffect } from 'react';

interface ImageConfig {
  width: number;
  quality: number;
  format: 'webp' | 'jpeg';
}

const NETWORK_SPEED_THRESHOLD = {
  SLOW: 500, // Kbps
  MEDIUM: 1500, // Kbps
  FAST: 3000 // Kbps
};

export function getOptimizedImageConfig(): ImageConfig {
  const connection = (navigator as any).connection;
  const downlink = connection?.downlink || 10;

  if (downlink < NETWORK_SPEED_THRESHOLD.SLOW) {
    return {
      width: 480,
      quality: 60,
      format: 'webp'
    };
  } else if (downlink < NETWORK_SPEED_THRESHOLD.MEDIUM) {
    return {
      width: 720,
      quality: 75,
      format: 'webp'
    };
  }

  return {
    width: 1080,
    quality: 85,
    format: 'webp'
  };
}

export function useProgressiveImage(src: string) {
  const [sourceLoaded, setSourceLoaded] = useState<string | null>(null);

  useEffect(() => {
    const config = getOptimizedImageConfig();
    const optimizedSrc = `${src}?w=${config.width}&q=${config.quality}&fmt=${config.format}`;
    
    const img = new Image();
    img.src = optimizedSrc;
    img.onload = () => setSourceLoaded(optimizedSrc);
  }, [src]);

  return sourceLoaded;
} 