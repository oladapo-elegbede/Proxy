// lib/utils/logger.ts
// Server-side logging utility.
// NEVER logs student input text — only session IDs and error codes.

type LogLevel = "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  route: string;
  statusCode?: number;
  durationMs?: number;
  errorCode?: string;
  sessionId?: string;
  message?: string;
}

export function log(entry: LogEntry): void {
  const timestamp = new Date().toISOString();
  const output = JSON.stringify({ timestamp, ...entry });

  if (entry.level === "error") {
    console.error(output);
  } else {
    console.log(output);
  }
}