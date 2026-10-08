type Level = 'debug' | 'info' | 'warn' | 'error';

const ENABLED: Record<Level, boolean> = {
  debug: __DEV__,
  info: __DEV__,
  warn: true,
  error: true,
};

function write(level: Level, scope: string, message: string, data?: unknown) {
  if (!ENABLED[level]) return;
  const line = `[lume:${scope}] ${message}`;
  if (data === undefined) {
    console[level](line);
  } else {
    console[level](line, data);
  }
}

/**
 * Tiny scoped logger. Debug and info are stripped from production builds; warnings and errors
 * stay so they can be forwarded to a crash reporter later.
 */
export function createLogger(scope: string) {
  return {
    debug: (message: string, data?: unknown) => write('debug', scope, message, data),
    info: (message: string, data?: unknown) => write('info', scope, message, data),
    warn: (message: string, data?: unknown) => write('warn', scope, message, data),
    error: (message: string, data?: unknown) => write('error', scope, message, data),
  };
}

export type Logger = ReturnType<typeof createLogger>;
