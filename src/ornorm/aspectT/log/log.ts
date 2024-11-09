/**
 * @file log.ts
 * @description This file contains the logging mechanism for the AspectT project, including extended logging duration, event caching, and obfuscation of phone numbers.
 * @license MIT
 *
 * @author Aimé Biendo
 * @contact abiendo@gmail.com
 *
 * @date 2023
 */

import { LEVEL, MESSAGE, SPLAT } from 'triple-beam';
import { createLogger, format, Logger, transports } from 'winston';

/**
 * Interface representing the structure of log data.
 */
export interface LogData {
    /**
     * The log level (e.g., 'debug', 'info', 'verbose', 'warn', 'error').
     */
    level: string;
    /**
     * The log message.
     */
    message: any;
    /**
     * The log level symbol from 'triple-beam'.
     */
    [LEVEL]?: string;
    /**
     * The formatted log message.
     */
    [MESSAGE]?: any;
    /**
     * Additional metadata for the log message.
     */
    [SPLAT]?: any;
    /**
     * Additional properties for the log data.
     */
    [key: string | symbol]: any;
}

/**
 * Type representing the possible log levels.
 *
 * The supported log levels are:
 * - `debug`: Detailed information, typically of interest only when
 * diagnosing problems.
 * - `info`: Confirmation that things are working as expected.
 * - `verbose`: Detailed information on the flow through the system.
 * - `warn`: An indication that something unexpected happened, or
 * indicative of some problem in the near future (e.g., ‘disk space low’).
 * The software is still working as expected.
 * - `error`: Due to a more serious problem, the software has not been
 * able to perform some function.
 */
export type LogLevel = 'debug' | 'info' | 'verbose' | 'warn' | 'error';

/**
 * Manages logging for the entire module.
 */
export class Log {
    private static readonly EXTENDED_LOGGING_DURATION_MILLIS: number = 60000 * 30; // 30 minutes
    private static readonly EVENTS_TO_CACHE: number = 10;
    private static readonly EVENTS_TO_CACHE_DEBUG: number = 20;
    private static readonly NUM_DIALABLE_DIGITS_TO_LOG: number = 0;

    private static TAG: string = 'AspectT';

    private static FORCE_LOGGING: boolean = false;
    private static sIsUserExtendedLoggingEnabled: boolean = false;
    private static sIsUnitTestingEnabled: boolean = false;
    private static sUserExtendedLoggingStopTime: number = 0;

    private static eventCache: Array<string> = [];

    private static logger: Logger = createLogger({
        level: 'info',
        format: format.combine(
            format.colorize(),
            format.timestamp(),
            format.printf((data: LogData) => {
                const { timestamp, level, message }: LogData = data;
                return `${timestamp} [${level}]: ${message}`;
            })
        ),
        transports: [new transports.Console()]
    });

    /**
     * Gets whether debug logging is enabled.
     * @returns True if debug logging is enabled, false otherwise.
     */
    public static get DEBUG(): boolean {
        return Log.isLoggable('debug');
    }

    /**
     * Gets whether info logging is enabled.
     * @returns True if info logging is enabled, false otherwise.
     */
    public static get INFO(): boolean {
        return Log.isLoggable('info');
    }

    /**
     * Gets whether verbose logging is enabled.
     * @returns True if verbose logging is enabled, false otherwise.
     */
    public static get VERBOSE(): boolean {
        return Log.isLoggable('verbose');
    }

    /**
     * Gets whether warn logging is enabled.
     * @returns True if warn logging is enabled, false otherwise.
     */
    public static get WARN(): boolean {
        return Log.isLoggable('warn');
    }

    /**
     * Gets whether error logging is enabled.
     * @returns True if error logging is enabled, false otherwise.
     */
    public static get ERROR(): boolean {
        return Log.isLoggable('error');
    }

    /**
     * Gets the current log level.
     * @returns The current log level.
     */
    public static get level(): string {
        return Log.logger.level;
    }

    public static set level(level: string) {
        Log.logger.level = level;
    }

    /**
     * Gets the current log tag.
     */
    public static get tag(): string {
        return Log.TAG;
    }

    public static set tag(tag: string) {
        Log.TAG = tag;
    }

    /**
     * Checks if unit testing is enabled.
     * @returns True if unit testing is enabled, false otherwise.
     */
    public static get unitTestingEnabled(): boolean {
        return Log.sIsUnitTestingEnabled;
    }

    public static set unitTestingEnabled(isEnabled: boolean) {
        Log.sIsUnitTestingEnabled = isEnabled;
    }

    /**
     * Enables extended logging for a specified duration.
     */
    public static enableExtendedLogging(): void {
        Log.sIsUserExtendedLoggingEnabled = true;
        Log.sUserExtendedLoggingStopTime =
            Date.now() + Log.EXTENDED_LOGGING_DURATION_MILLIS;
    }

    /**
     * Obfuscates a phone number, allowing NUM_DIALABLE_DIGITS_TO_LOG digits to be exposed.
     * @param phoneNumber The number to obfuscate.
     * @returns The obfuscated phone number.
     */
    public static obfuscatePhoneNumber(phoneNumber: string): string {
        let numDigitsToObfuscate: number =
            Log.getDialCount(phoneNumber) - Log.NUM_DIALABLE_DIGITS_TO_LOG;
        return phoneNumber.split('').map((c: string) => {
            if (/\d/.test(c) && numDigitsToObfuscate-- > 0) {
                return '*';
            }
            return c;
        }).join('');
    }

    /**
     * Logs a `debug` message.
     * @param prefix The prefix for the log message.
     * @param format The format string for the log message.
     * @param args The arguments for the format string.
     */
    public static d(prefix: string, format?: string, ...args: Array<any>): void {
        const messageFormat: string = format || Log.getDefaultMessage('debug');
        if (Log.sIsUserExtendedLoggingEnabled) {
            Log.maybeDisableLogging();
            Log.cacheEvent(Log.buildMessage(prefix, messageFormat, args), Log.EVENTS_TO_CACHE_DEBUG);
            Log.logger.info(Log.buildMessage(prefix, messageFormat, args));
        } else if (Log.DEBUG) {
            Log.cacheEvent(Log.buildMessage(prefix, messageFormat, args), Log.EVENTS_TO_CACHE);
            Log.logger.debug(Log.buildMessage(prefix, messageFormat, args));
        }
    }

    /**
     * Logs an `info` message.
     * @param prefix The prefix for the log message.
     * @param format The format string for the log message.
     * @param args The arguments for the format string.
     */
    public static i(prefix: string, format?: string, ...args: Array<any>): void {
        if (Log.INFO) {
            const messageFormat: string = format || Log.getDefaultMessage('info');
            Log.logger.info(Log.buildMessage(prefix, messageFormat, args));
        }
    }

    /**
     * Logs a `verbose` message.
     * @param prefix The prefix for the log message.
     * @param format The format string for the log message.
     * @param args The arguments for the format string.
     */
    public static v(prefix: string, format?: string, ...args: Array<any>): void {
        const messageFormat: string = format || Log.getDefaultMessage('verbose');
        if (Log.sIsUserExtendedLoggingEnabled) {
            Log.maybeDisableLogging();
            Log.cacheEvent(Log.buildMessage(prefix, messageFormat, args), Log.EVENTS_TO_CACHE_DEBUG);
            Log.logger.info(Log.buildMessage(prefix, messageFormat, args));
        } else if (Log.VERBOSE) {
            Log.cacheEvent(Log.buildMessage(prefix, messageFormat, args), Log.EVENTS_TO_CACHE);
            Log.logger.verbose(Log.buildMessage(prefix, messageFormat, args));
        }
    }

    /**
     * Logs a `warning` message.
     * @param prefix The prefix for the log message.
     * @param format The format string for the log message.
     * @param args The arguments for the format string.
     */
    public static w(prefix: string, format?: string, ...args: Array<any>): void {
        if (Log.WARN) {
            const messageFormat: string = format || Log.getDefaultMessage('verbose');
            Log.logger.warn(Log.buildMessage(prefix, messageFormat, args));
        }
    }

    /**
     * Logs an `error` message.
     * @param prefix The prefix for the log message.
     * @param format The format string for the log message.
     * @param error The error object.
     * @param args The arguments for the format string.
     */
    public static e(prefix: string, format?: string, error?: Error, ...args: Array<any>): void {
        if (Log.ERROR) {
            const messageFormat: string = format || Log.getDefaultMessage('verbose');
            Log.logger.error(Log.buildMessage(prefix, messageFormat, args), error);
        }
    }

    /**
     * Logs a message with a specified level.
     * @param prefix The prefix for the log message.
     * @param format The format string for the log message.
     * @param level The log level (default is 'info').
     * @param args The arguments for the format string.
     */
    public static l(prefix: string, format?: string, level: string = 'info', ...args: Array<any>): void {
        switch (level.toLowerCase()) {
            case 'debug':
                Log.d(prefix, format, ...args);
                break;
            case 'verbose':
                Log.v(prefix, format, ...args);
                break;
            case 'warn':
                Log.w(prefix, format, ...args);
                break;
            case 'error':
                Log.e(prefix, format, ...args);
                break;
            case 'info':
            default:
                Log.i(prefix, format, ...args);
                break;
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
        // Placeholder for session ID logic
        const sessionName: string = '';
        const sessionPostfix: string = sessionName ? `: ${sessionName}` : '';
        let msg: string;
        try {
            msg = args.length === 0 ? format : format.replace(/{(\d+)}/g, (
                (match: string, index: number) =>
                    typeof args[index] !== 'undefined' ? args[index] : match
            ));
        } catch (e: any) {
            Log.e(Log.TAG, `Log: IllegalFormatException: formatString='${format}' numArgs=${args.length}`, e);
            msg = `${format} (An error occurred while formatting the message.)`;
        }
        return `${prefix}: ${msg}${sessionPostfix}`;
    }

    /**
     * Extracts the stack trace from an error and formats it based on the log level.
     * @param level - The log level (e.g., 'debug', 'info', 'warn', 'error').
     * @param error - The error object to extract the stack trace from (optional).
     * @returns The formatted stack trace message.
     */
    private static extractStackTrace(level: string, error?: Error): string {
        const err: Error = new Error();
        const stack: string[] = err.stack?.split('\n') || [];
        const className: string = 'Log';
        for (let i: number = 1; i < stack.length; i++) {
            const line: string = stack[i].trim();
            if (!line.includes(className)) {
                const match: RegExpMatchArray | null = line.match(/at (.+) \((.+):(\d+):(\d+)\)/);
                if (match) {
                    const method: string = match[1];
                    const file: string = match[2];
                    const line: string = match[3];
                    const column: string = match[4];
                    let message: string = `Error in method: ${method}, file: ${file}, line: ${line}, column: ${column}`;
                    switch (level.toLowerCase()) {
                        case 'debug':
                            message = `Debugging issue in method: ${method}, file: ${file}, line: ${line}, column: ${column}`;
                            break;
                        case 'verbose':
                            message = `Verbose log in method: ${method}, file: ${file}, line: ${line}, column: ${column}`;
                            break;
                        case 'warn':
                            message = `Warning in method: ${method}, file: ${file}, line: ${line}, column: ${column}`;
                            break;
                        case 'error':
                            message = `Error in method: ${method}, file: ${file}, line: ${line}, column: ${column}`;
                            break;
                        case 'info':
                        default:
                            message = `Info log in method: ${method}, file: ${file}, line: ${line}, column: ${column}`;
                            break;
                    }

                    if (error) {
                        message += `\nOriginal error: ${error.message}`;
                    }
                    return message;
                }
            }
        }
        return '';
    }

    /**
     * Caches an event message.
     * @param message The message to cache.
     * @param cacheSize The size of the cache.
     */
    private static cacheEvent(message: string, cacheSize: number): void {
        if (Log.eventCache.length >= cacheSize) {
            Log.eventCache.shift();
        }
        Log.eventCache.push(message);
    }

    /**
     * Gets the default message for a given log level.
     * If an error is provided, it extracts the stack trace from the error.
     *
     * @param level - The log level (e.g., 'debug', 'info', 'warn', 'error').
     * @param error - The error object to extract the stack trace from (optional).
     * @returns The default log message or the extracted stack trace message.
     */
    private static getDefaultMessage(level: string, error?: Error): string {
        const message: string = Log.extractStackTrace(level, error);
        if (message) {
            return message;
        }
        switch (level.toLowerCase()) {
            case 'debug':
                return 'Debugging issue: Caller method not found in stack trace.';
            case 'verbose':
                return 'Verbose log: Caller method not found in stack trace.';
            case 'warn':
                return 'Warning: Caller method not found in stack trace.';
            case 'error':
                return 'Error: Caller method not found in stack trace.';
            case 'info':
            default:
                return 'Info log: Caller method not found in stack trace.';
        }
    }

    /**
     * Determines the number of dialable characters in a string.
     * @param toCount The string to count dialable characters in.
     * @returns The count of dialable characters.
     */
    private static getDialCount(toCount: string): number {
        return toCount.split('').filter((c: string) => /\d/.test(c)).length;
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
}
