import { getUser } from "@/lib/supabase/queries/index";
import { createClient } from "@/lib/supabase/clients/server";

// Simple rate limiting
const rateLimitCache = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per minute
import {
  DEFAULT_SERVER_ERROR_MESSAGE,
  createSafeActionClient,
} from "next-safe-action";
import { headers } from "next/headers";
import { z } from "zod";

const handleServerError = (e: Error) => {
  console.error("Action error:", e.message);

  if (e instanceof Error) {
    return e.message;
  }

  return DEFAULT_SERVER_ERROR_MESSAGE;
};

export const actionClient = createSafeActionClient({
  handleServerError,
});

export const actionClientWithMeta = createSafeActionClient({
  handleServerError,
  defineMetadataSchema() {
    return z.object({
      name: z.string(),
      track: z
        .object({
          event: z.string(),
          channel: z.string(),
        })
        .optional(),
    });
  },
});

export const authActionClient = actionClientWithMeta
  .use(async ({ next, clientInput, metadata }) => {
    const result = await next({ ctx: {} });

    if (process.env.NODE_ENV === "development") {
      console.info(`Input -> ${JSON.stringify(clientInput)}`);
      console.info(`Result -> ${JSON.stringify(result.data)}`);
      console.info(`Metadata -> ${JSON.stringify(metadata)}`);

      return result;
    }

    return result;
  })
  .use(async ({ next, metadata }) => {
    const ip = headers().get("x-forwarded-for");

    // Simple in-memory rate limiting
    const now = Date.now();
    const key = `${ip}-${metadata.name}`;
    const entry = rateLimitCache.get(key);

    if (entry) {
      if (now - entry.timestamp > RATE_LIMIT_WINDOW_MS) {
        // Reset counter if window has passed
        rateLimitCache.set(key, { count: 1, timestamp: now });
      } else if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
        throw new Error("Too many requests");
      } else {
        // Increment counter
        rateLimitCache.set(key, { ...entry, count: entry.count + 1 });
      }
    } else {
      // First request in this window
      rateLimitCache.set(key, { count: 1, timestamp: now });
    }

    return next({
      ctx: {
        ratelimit: {
          remaining: Math.max(0, RATE_LIMIT_MAX_REQUESTS - (rateLimitCache.get(key)?.count || 0)),
        },
      },
    });
  })
  .use(async ({ next, metadata }) => {
    const { data: { user } } = await getUser();
    const supabase = createClient();

    if (!user) {
      throw new Error("Unauthorized");
    }

    // Simple logging for development
    if (metadata?.track) {
      console.log(`[Analytics] ${metadata.track.event}`, {
        userId: user.id,
        channel: metadata.track.channel,
        // Add any additional properties you want to track here
      });
    }

    return next({
      ctx: {
        supabase,
        user,
      },
    });
  });
