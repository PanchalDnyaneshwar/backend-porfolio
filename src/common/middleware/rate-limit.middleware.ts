import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

interface RateLimitPolicy {
  limit: number;
  windowMs: number;
}

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly buckets = new Map<string, RateLimitBucket>();

  use(req: Request, res: Response, next: NextFunction): void {
    const pathname = req.originalUrl.split('?')[0] || req.path;
    const policy = this.getPolicy(pathname);

    if (!policy) {
      next();
      return;
    }

    const now = Date.now();
    const key = `${req.ip}:${pathname}`;
    const bucket = this.buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      this.buckets.set(key, {
        count: 1,
        resetAt: now + policy.windowMs,
      });
      this.applyHeaders(res, policy, 1, now + policy.windowMs);
      this.pruneExpiredBuckets(now);
      next();
      return;
    }

    if (bucket.count >= policy.limit) {
      this.applyHeaders(res, policy, bucket.count, bucket.resetAt);
      throw new HttpException(
        'Too many requests. Please wait and try again.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    bucket.count += 1;
    this.applyHeaders(res, policy, bucket.count, bucket.resetAt);
    next();
  }

  private getPolicy(path: string): RateLimitPolicy | null {
    if (path === '/auth/login') {
      return { limit: 5, windowMs: 60_000 };
    }

    if (path === '/contact' || path === '/newsletter/subscribe') {
      return { limit: 10, windowMs: 60_000 };
    }

    return null;
  }

  private applyHeaders(
    res: Response,
    policy: RateLimitPolicy,
    count: number,
    resetAt: number,
  ) {
    res.setHeader('X-RateLimit-Limit', policy.limit.toString());
    res.setHeader(
      'X-RateLimit-Remaining',
      Math.max(policy.limit - count, 0).toString(),
    );
    res.setHeader('X-RateLimit-Reset', Math.ceil(resetAt / 1000).toString());
  }

  private pruneExpiredBuckets(now: number) {
    for (const [key, bucket] of this.buckets.entries()) {
      if (bucket.resetAt <= now) {
        this.buckets.delete(key);
      }
    }
  }
}
