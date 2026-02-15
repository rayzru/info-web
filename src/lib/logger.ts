/**
 * Централизованный логгер на основе pino
 *
 * Использование:
 * ```ts
 * import { logger } from "~/lib/logger";
 *
 * logger.info({ userId: "123" }, "User logged in");
 * logger.error({ err, userId: "123" }, "Failed to process request");
 * logger.warn({ count: 5 }, "Rate limit approaching");
 * logger.debug({ query }, "Database query executed");
 * ```
 */

import pino from "pino";

import { env } from "~/env";

// ============================================================================
// Base Pino Logger
// ============================================================================

const pinoLogger = pino({
  level: env.NODE_ENV === "production" ? "info" : "debug",

  // Production: JSON format для парсинга в log aggregators
  // Development: pino-pretty для читаемости
  transport:
    env.NODE_ENV !== "production"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss",
            ignore: "pid,hostname",
            singleLine: false,
            messageFormat: "{levelLabel} - {msg}",
          },
        }
      : undefined,

  // Base context для всех логов
  base: {
    env: env.NODE_ENV,
    service: "sr2-t3",
  },

  // Форматирование для production
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },

  // Сериализация ошибок
  serializers: {
    err: pino.stdSerializers.err,
    error: pino.stdSerializers.err,
  },

  // Timestamp в ISO формате
  timestamp: pino.stdTimeFunctions.isoTime,
});

// ============================================================================
// Console-Compatible Wrapper
// ============================================================================

type LogMethod = (...args: unknown[]) => void;

interface ConsoleCompatibleLogger {
  info: LogMethod;
  error: LogMethod;
  warn: LogMethod;
  debug: LogMethod;
  child: (bindings: Record<string, unknown>) => ConsoleCompatibleLogger;
}

function createConsoleCompatibleLogger(baseLogger: pino.Logger): ConsoleCompatibleLogger {
  const wrap = (level: "info" | "error" | "warn" | "debug"): LogMethod => {
    return (...args: unknown[]) => {
      if (args.length === 0) {
        baseLogger[level]("");
        return;
      }

      // If first arg is an object with err/error property, use structured logging
      const firstArg = args[0];
      if (
        typeof firstArg === "object" &&
        firstArg !== null &&
        ("err" in firstArg || "error" in firstArg)
      ) {
        const [obj, ...rest] = args;
        baseLogger[level](obj as Record<string, unknown>, rest.map(String).join(" "));
        return;
      }

      // Otherwise, join all args as a message (console-style)
      const message = args
        .map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : String(arg)))
        .join(" ");
      baseLogger[level](message);
    };
  };

  return {
    info: wrap("info"),
    error: wrap("error"),
    warn: wrap("warn"),
    debug: wrap("debug"),
    child: (bindings: Record<string, unknown>) =>
      createConsoleCompatibleLogger(baseLogger.child(bindings)),
  };
}

/**
 * Main logger instance with console-compatible API
 *
 * Supports both pino-style and console-style logging:
 * @example
 * // Console-style (backward compatible)
 * logger.info("User logged in", userId);
 * logger.error("Failed to connect", error);
 *
 * // Pino-style (structured logging)
 * logger.info({ userId }, "User logged in");
 * logger.error("Failed to connect");
 */
export const logger = createConsoleCompatibleLogger(pinoLogger);

/**
 * Child logger для конкретного модуля/контекста
 *
 * @example
 * const emailLogger = createLogger({ module: "email" });
 * emailLogger.info({ to: "user@example.com" }, "Email sent");
 */
export function createLogger(context: Record<string, unknown>) {
  return logger.child(context);
}

/**
 * Логгер для HTTP запросов (Next.js API routes, tRPC)
 */
export const httpLogger = createLogger({ module: "http" });

/**
 * Логгер для БД операций
 */
export const dbLogger = createLogger({ module: "database" });

/**
 * Логгер для email операций
 */
export const emailLogger = createLogger({ module: "email" });

/**
 * Логгер для Telegram уведомлений
 */
export const telegramLogger = createLogger({ module: "telegram" });

/**
 * Логгер для S3 операций
 */
export const s3Logger = createLogger({ module: "s3" });

/**
 * Логгер для auth операций
 */
export const authLogger = createLogger({ module: "auth" });

/**
 * Логгер для scheduled tasks / cron jobs
 */
export const cronLogger = createLogger({ module: "cron" });

/**
 * Типизированные уровни логирования
 */
export type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

/**
 * Helper для логирования ошибок с полным контекстом
 *
 * @example
 * logError(logger, error, { userId: "123", action: "login" });
 */
export function logError(
  loggerInstance: pino.Logger,
  error: unknown,
  context?: Record<string, unknown>
) {
  const err = error instanceof Error ? error : new Error(String(error));
  loggerInstance.error({ err, ...context }, err.message);
}

/**
 * Helper для логирования успешных операций
 *
 * @example
 * logSuccess(logger, "User registered", { userId: "123" });
 */
export function logSuccess(
  loggerInstance: pino.Logger,
  message: string,
  context?: Record<string, unknown>
) {
  loggerInstance.info({ success: true, ...context }, message);
}

/**
 * Helper для логирования предупреждений
 *
 * @example
 * logWarning(logger, "Rate limit approaching", { ip: "1.2.3.4", count: 5 });
 */
export function logWarning(
  loggerInstance: pino.Logger,
  message: string,
  context?: Record<string, unknown>
) {
  loggerInstance.warn(context, message);
}
