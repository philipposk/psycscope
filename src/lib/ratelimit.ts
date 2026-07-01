import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

export type RateBucket = "analyze" | "pa" | "save";

const BUCKETS: Record<RateBucket, { requests: number; window: `${number} ${"s" | "m" | "h" | "d"}` }> = {
  analyze: { requests: 8, window: "1 h" },
  pa: { requests: 40, window: "1 m" },
  save: { requests: 20, window: "1 m" },
};

const limiters = new Map<RateBucket, Ratelimit>();
let warnedMissing = false;

function limiter(bucket: RateBucket): Ratelimit | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    if (!warnedMissing) {
      console.warn("[ratelimit] UPSTASH not set — limits disabled");
      warnedMissing = true;
    }
    return null;
  }
  let rl = limiters.get(bucket);
  if (!rl) {
    const { requests, window } = BUCKETS[bucket];
    rl = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(requests, window),
      prefix: `psycscope:${bucket}`,
    });
    limiters.set(bucket, rl);
  }
  return rl;
}

function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function enforceRateLimit(
  req: Request,
  bucket: RateBucket,
  userId?: string | null,
): Promise<NextResponse | null> {
  const rl = limiter(bucket);
  if (!rl) return null;
  const key = userId ? `u:${userId}` : `ip:${clientIp(req)}`;
  const { success, reset } = await rl.limit(key);
  if (success) return null;
  const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
  return NextResponse.json(
    { error: "Too many requests. Try again shortly.", code: "rate_limit" },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  );
}
