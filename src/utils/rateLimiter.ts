interface RateLimiterOptions {
  maxRequests: number;
  timeWindow: number; // in milliseconds
}

export class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number;
  private readonly timeWindow: number;

  constructor({ maxRequests, timeWindow }: RateLimiterOptions) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
  }

  async checkLimit(): Promise<boolean> {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.timeWindow);
    
    if (this.requests.length >= this.maxRequests) {
      return false;
    }

    this.requests.push(now);
    return true;
  }
}

// Create instances for different endpoints
export const authRateLimiter = new RateLimiter({ maxRequests: 5, timeWindow: 60000 }); // 5 requests per minute
export const checkoutRateLimiter = new RateLimiter({ maxRequests: 3, timeWindow: 60000 }); // 3 requests per minute 