import { prisma } from '../lib/prisma';
import { RateLimitError } from '../utils/errors';
import { captureError } from '../utils/errorTracking';

interface RateLimitConfig {
  windowMs: number;
  max: number;
  keyPrefix?: string;
  skipFailedRequests?: boolean;
  skipSuccessfulRequests?: boolean;
}

interface RateLimitInfo {
  limit: number;
  current: number;
  remaining: number;
  resetAt: Date;
}

export class RateLimiter {
  private config: RateLimitConfig;
  private cache: Map<string, RateLimitInfo>;

  constructor(config: RateLimitConfig) {
    this.config = {
      keyPrefix: 'rl:',
      skipFailedRequests: false,
      skipSuccessfulRequests: false,
      ...config
    };
    this.cache = new Map();
  }

  async checkLimit(identifier: string, options?: {
    skipCheck?: boolean;
    weight?: number;
  }): Promise<RateLimitInfo> {
    const key = `${this.config.keyPrefix}${identifier}`;
    const now = new Date();
    const weight = options?.weight || 1;

    try {
      // Check cache first
      const cachedInfo = this.cache.get(key);
      if (cachedInfo && cachedInfo.resetAt > now) {
        return cachedInfo;
      }

      const rateLimit = await prisma.rateLimit.upsert({
        where: { id: key },
        create: {
          id: key,
          count: weight,
          resetAt: new Date(now.getTime() + this.config.windowMs),
        },
        update: {
          count: {
            increment: weight,
          },
          resetAt: {
            set: new Date(now.getTime() + this.config.windowMs),
          },
        },
      });

      const info: RateLimitInfo = {
        limit: this.config.max,
        current: rateLimit.count,
        remaining: Math.max(0, this.config.max - rateLimit.count),
        resetAt: rateLimit.resetAt
      };

      // Update cache
      this.cache.set(key, info);

      if (!options?.skipCheck && rateLimit.count > this.config.max) {
        throw new RateLimitError(`Rate limit exceeded. Try again in ${Math.ceil((rateLimit.resetAt.getTime() - now.getTime()) / 1000)} seconds`);
      }

      return info;
    } catch (error) {
      if (error instanceof RateLimitError) {
        throw error;
      }
      captureError(error as Error, { context: 'Rate Limiting' });
      throw new Error('Rate limiting error');
    }
  }

  async cleanup(): Promise<void> {
    const now = new Date();
    try {
      await prisma.rateLimit.deleteMany({
        where: {
          resetAt: {
            lt: now,
          },
        },
      });
      // Clear cache
      for (const [key, info] of this.cache.entries()) {
        if (info.resetAt <= now) {
          this.cache.delete(key);
        }
      }
    } catch (error) {
      captureError(error as Error, { context: 'Rate Limit Cleanup' });
    }
  }
} 