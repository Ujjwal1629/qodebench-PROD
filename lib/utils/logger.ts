/**
 * Structured Logger
 *
 * Provides consistent, structured logging across the application.
 * In production, this can be easily replaced with a proper logging service
 * (Winston, Pino, Datadog, etc.)
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  userId?: string;
  requestId?: string;
  action?: string;
  duration?: number;
  [key: string]: any;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: {
    message: string;
    stack?: string;
    code?: string;
  };
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// Minimum log level based on environment
const MIN_LOG_LEVEL: LogLevel =
  process.env.NODE_ENV === 'production' ? 'info' : 'debug';

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[MIN_LOG_LEVEL];
}

function formatLogEntry(entry: LogEntry): string {
  if (process.env.NODE_ENV === 'production') {
    // JSON format for production (easy to parse by log aggregators)
    return JSON.stringify(entry);
  }

  // Human-readable format for development
  const { timestamp, level, message, context, error } = entry;
  const levelIcon = {
    debug: '🔍',
    info: 'ℹ️',
    warn: '⚠️',
    error: '❌',
  }[level];

  let output = `${timestamp} ${levelIcon} [${level.toUpperCase()}] ${message}`;

  if (context && Object.keys(context).length > 0) {
    output += ` | ${JSON.stringify(context)}`;
  }

  if (error) {
    output += `\n  Error: ${error.message}`;
    const nodeEnv = process.env.NODE_ENV as string;
    if (error.stack && nodeEnv !== 'production') {
      output += `\n  Stack: ${error.stack}`;
    }
  }

  return output;
}

function createLogEntry(
  level: LogLevel,
  message: string,
  context?: LogContext,
  error?: Error
): LogEntry {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
  };

  if (context) {
    // Remove sensitive data from context
    const safeContext = { ...context };
    delete safeContext.password;
    delete safeContext.token;
    delete safeContext.apiKey;
    delete safeContext.secret;
    entry.context = safeContext;
  }

  if (error) {
    entry.error = {
      message: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
      code: (error as any).code,
    };
  }

  return entry;
}

function log(
  level: LogLevel,
  message: string,
  context?: LogContext,
  error?: Error
): void {
  if (!shouldLog(level)) return;

  const entry = createLogEntry(level, message, context, error);
  const formatted = formatLogEntry(entry);

  switch (level) {
    case 'debug':
      console.debug(formatted);
      break;
    case 'info':
      console.info(formatted);
      break;
    case 'warn':
      console.warn(formatted);
      break;
    case 'error':
      console.error(formatted);
      break;
  }
}

export const logger = {
  debug: (message: string, context?: LogContext) =>
    log('debug', message, context),

  info: (message: string, context?: LogContext) =>
    log('info', message, context),

  warn: (message: string, context?: LogContext, error?: Error) =>
    log('warn', message, context, error),

  error: (message: string, context?: LogContext, error?: Error) =>
    log('error', message, context, error),

  /**
   * Log API request with timing
   */
  apiRequest: (
    method: string,
    path: string,
    userId?: string,
    duration?: number,
    status?: number
  ) => {
    log('info', `${method} ${path}`, {
      userId,
      duration,
      status,
      action: 'api_request',
    });
  },

  /**
   * Log security events
   */
  security: (
    event: string,
    context?: LogContext,
    severity: 'info' | 'warn' | 'error' = 'warn'
  ) => {
    log(severity, `[SECURITY] ${event}`, { ...context, action: 'security' });
  },

  /**
   * Log payment events
   */
  payment: (event: string, context?: LogContext) => {
    log('info', `[PAYMENT] ${event}`, { ...context, action: 'payment' });
  },

  /**
   * Log AI/OpenAI events
   */
  ai: (event: string, context?: LogContext) => {
    log('info', `[AI] ${event}`, { ...context, action: 'ai' });
  },

  /**
   * Log database operations
   */
  db: (operation: string, table: string, context?: LogContext) => {
    log('debug', `[DB] ${operation} on ${table}`, {
      ...context,
      action: 'database',
    });
  },
};

/**
 * Create a request-scoped logger with correlation ID
 */
export function createRequestLogger(requestId: string, userId?: string) {
  return {
    debug: (message: string, context?: LogContext) =>
      logger.debug(message, { ...context, requestId, userId }),

    info: (message: string, context?: LogContext) =>
      logger.info(message, { ...context, requestId, userId }),

    warn: (message: string, context?: LogContext, error?: Error) =>
      logger.warn(message, { ...context, requestId, userId }, error),

    error: (message: string, context?: LogContext, error?: Error) =>
      logger.error(message, { ...context, requestId, userId }, error),
  };
}

/**
 * Generate a unique request ID
 */
export function generateRequestId(): string {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
