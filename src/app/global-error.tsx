"use client";

// import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    // Log error to console for now (can add proper error tracking later)
    console.error('Global error:', error);
    // Sentry.captureException(error);
  }, [error]);

  return <NextError statusCode={0} />;
}
