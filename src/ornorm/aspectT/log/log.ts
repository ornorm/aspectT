import {LEVEL, MESSAGE, SPLAT} from 'triple-beam';
import {createLogger, format, Logger, transports} from 'winston';

/**
 * Interface representing the structure of log data.
 */
export interface LogData {
    level: string;
    message: any;
    [LEVEL]?: string;
    [MESSAGE]?: any;
    [SPLAT]?: any;

    [key: string | symbol]: any;
}

export class Log {
    private static readonly EXTENDED_LOGGING_DURATION_MILLIS = 60000 * 30; // 30 minutes
    private static readonly EVENTS_TO_CACHE = 10;
    private static readonly EVENTS_TO_CACHE_DEBUG = 20;
    private static readonly NUM_DIALABLE_DIGITS_TO_LOG = 0;

    private static TAG = 'AspectT';
    private static DEBUG = Log.isLoggable('debug');
    private static INFO = Log.isLoggable('info');
    private static VERBOSE = Log.isLoggable('verbose');
    private static WARN = Log.isLoggable('warn');
    private static ERROR = Log.isLoggable('error');

    private static FORCE_LOGGING = false;
    private static USER_BUILD = true;

    private static sIsUserExtendedLoggingEnabled = false;
    private static sIsUnitTestingEnabled = false;
    private static sUserExtendedLoggingStopTime = 0;

    private static logger: Logger = createLogger({
        level: 'info',
        format: format.combine(
            format.colorize(),
            format.timestamp(),
            format.printf((data: LogData) => {
                const {timestamp, level, message}: LogData = data;
                return `${timestamp} [${level}]: ${message}`;
            })
        ),
        transports: [
            new transports.Console()
        ]
    });

    private constructor() {
    }

    /**
     * Logs a debug message.
     * @param prefix The prefix for the log message.
     * @param format The format string for the log message.
     * @param args The arguments for the format string.
     */
    public static d(prefix: string, format: string, ...args: Array<any>): void;
    public static d(prefix: string, format: string): void;
    public static d(prefix: string, format: string, ...args: Array<any>): void {
        if (Log.sIsUserExtendedLoggingEnabled) {
            Log.maybeDisableLogging();
            Log.logger.info(Log.buildMessage(prefix, format, args));
        } else if (Log.DEBUG) {
            Log.logger.debug(Log.buildMessage(prefix, format, args));
        }
    }

    /**
     * Logs an info message.
     * @param prefix The prefix for the log message.
     * @param format The format string for the log message.
     * @param args The arguments for the format string.
     */
    public static i(prefix: string, format: string, ...args: Array<any>): void;
    public static i(prefix: string, format: string): void;
    public static i(prefix: string, format: string, ...args: Array<any>): void {
        if (Log.INFO) {
            Log.logger.info(Log.buildMessage(prefix, format, args));
        }
    }

    /**
     * Logs a verbose message.
     * @param prefix The prefix for the log message.
     * @param format The format string for the log message.
     * @param args The arguments for the format string.
     */
    public static v(prefix: string, format: string, ...args: Array<any>): void;
    public static v(prefix: string, format: string): void;
    public static v(prefix: string, format: string, ...args: Array<any>): void {
        if (Log.sIsUserExtendedLoggingEnabled) {
            Log.maybeDisableLogging();
            Log.logger.info(Log.buildMessage(prefix, format, args));
        } else if (Log.VERBOSE) {
            Log.logger.verbose(Log.buildMessage(prefix, format, args));
        }
    }

    /**
     * Logs a warning message.
     * @param prefix The prefix for the log message.
     * @param format The format string for the log message.
     * @param args The arguments for the format string.
     */
    public static w(prefix: string, format: string, ...args: Array<any>): void;
    public static w(prefix: string, format: string): void;
    public static w(prefix: string, format: string, ...args: Array<any>): void {
        if (Log.WARN) {
            Log.logger.warn(Log.buildMessage(prefix, format, args));
        }
    }

    /**
     * Logs an error message.
     * @param prefix The prefix for the log message.
     * @param error The error object.
     * @param format The format string for the log message.
     * @param args The arguments for the format string.
     */
    public static e(prefix: string, error: Error, format: string, ...args: Array<any>): void;
    public static e(prefix: string, error: Error, format: string): void;
    public static e(prefix: string, error: Error, format: string, ...args: Array<any>): void {
        if (Log.ERROR) {
            Log.logger.error(Log.buildMessage(prefix, format, args), error);
        }
    }

    /**
     * Logs a critical error message.
     * @param prefix The prefix for the log message.
     * @param error The error object.
     * @param format The format string for the log message.
     * @param args The arguments for the format string.
     */
    public static wtf(prefix: string, error: Error, format: string, ...args: Array<any>): void;
    public static wtf(prefix: string, error: Error, format: string): void;
    public static wtf(prefix: string, error: Error, format: string, ...args: Array<any>): void {
        Log.logger.error(Log.buildMessage(prefix, format, args), error);
    }

    /**
     * Sets the log tag.
     * @param tag The new log tag.
     */
    public static setTag(tag: string): void {
        Log.TAG = tag;
        Log.DEBUG = Log.isLoggable('debug');
        Log.INFO = Log.isLoggable('info');
        Log.VERBOSE = Log.isLoggable('verbose');
        Log.WARN = Log.isLoggable('warn');
        Log.ERROR = Log.isLoggable('error');
    }

    /**
     * Disables logging if the extended logging duration has expired.
     */
    private static maybeDisableLogging(): void {
        if (!Log.sIsUserExtendedLoggingEnabled) {
            return;
        }
        if (Log.sUserExtendedLoggingStopTime < Date.now()) {
            Log.sUserExtendedLoggingStopTime = 0;
            Log.sIsUserExtendedLoggingEnabled = false;
        }
    }

    /**
     * Checks if a log level is enabled.
     * @param level The log level to check.
     * @returns True if the log level is enabled, false otherwise.
     */
    private static isLoggable(level: string): boolean {
        return Log.FORCE_LOGGING || Log.logger.isLevelEnabled(level);
    }

    /**
     * Builds a log message.
     * @param prefix The prefix for the log message.
     * @param format The format string for the log message.
     * @param args The arguments for the format string.
     * @returns The formatted log message.
     */
    private static buildMessage(prefix: string, format: string, args: Array<any>): string {
        const sessionName: string = ''; // Placeholder for session ID logic
        const sessionPostfix: string = sessionName ? `: ${sessionName}` : '';
        let msg: string;
        try {
            msg = args.length === 0 ? format : format.replace(/{(\d+)}/g, (match, number) =>
                typeof args[number] !== 'undefined' ? args[number] : match
            );
        } catch (e) {
            Log.e(Log.TAG, e, `Log: IllegalFormatException: formatString='${format}' numArgs=${args.length}`);
            msg = `${format} (An error occurred while formatting the message.)`;
        }
        return `${prefix}: ${msg}${sessionPostfix}`;
    }
}
