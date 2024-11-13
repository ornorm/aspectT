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
import { transports } from 'winston';
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
 *
 * This is the default system logging facilities.
 *
 * This is provided as a convenience for logging within the module.
 */
export declare class Log {
    private static readonly EXTENDED_LOGGING_DURATION_MILLIS;
    private static readonly EVENTS_TO_CACHE;
    private static readonly EVENTS_TO_CACHE_DEBUG;
    private static readonly NUM_DIALABLE_DIGITS_TO_LOG;
    private static TAG;
    private static FORCE_LOGGING;
    private static sIsUserExtendedLoggingEnabled;
    private static sIsUnitTestingEnabled;
    private static sUserExtendedLoggingStopTime;
    private static sIsColorEnabled;
    private static sEventCache;
    private static sLogger;
    private static sIsTimestampEnabled;
    /**
     * Gets whether debug logging is enabled.
     * @returns True if debug logging is enabled, false otherwise.
     */
    static get DEBUG(): boolean;
    /**
     * Gets whether info logging is enabled.
     * @returns True if info logging is enabled, false otherwise.
     */
    static get INFO(): boolean;
    /**
     * Gets whether verbose logging is enabled.
     * @returns True if verbose logging is enabled, false otherwise.
     */
    static get VERBOSE(): boolean;
    /**
     * Gets whether warn logging is enabled.
     * @returns True if warn logging is enabled, false otherwise.
     */
    static get WARN(): boolean;
    /**
     * Gets whether error logging is enabled.
     * @returns True if error logging is enabled, false otherwise.
     */
    static get ERROR(): boolean;
    /**
     * Enables or disables colorization in the log output.
     */
    static get color(): boolean;
    static set color(enable: boolean);
    /**
     * Gets the current log level.
     * @returns The current log level.
     */
    static get level(): string;
    static set level(level: string);
    /**
     * Gets the current log tag.
     */
    static get tag(): string;
    static set tag(tag: string);
    /**
     * Gets whether timestamping is enabled in the log output.
     */
    static get timestamp(): boolean;
    static set timestamp(enable: boolean);
    /**
     * Get the transport for the logger.
     */
    static get transports(): transports.StreamTransportInstance;
    static set transports(newTransports: transports.StreamTransportInstance);
    /**
     * Checks if unit testing is enabled.
     * @returns True if unit testing is enabled, false otherwise.
     */
    static get unitTestingEnabled(): boolean;
    static set unitTestingEnabled(isEnabled: boolean);
    /**
     * Enables extended logging for a specified duration.
     */
    static enableExtendedLogging(): void;
    /**
     * Obfuscates a phone number, allowing NUM_DIALABLE_DIGITS_TO_LOG digits to be exposed.
     * @param phoneNumber The number to obfuscate.
     * @returns The obfuscated phone number.
     */
    static obfuscatePhoneNumber(phoneNumber: string): string;
    /**
     * Logs a `debug` message.
     * @param prefix The prefix for the log message.
     * @param format The format string for the log message.
     * @param args The arguments for the format string.
     */
    static d(prefix: string, format?: string, ...args: Array<any>): void;
    /**
     * Logs an `info` message.
     * @param prefix The prefix for the log message.
     * @param format The format string for the log message.
     * @param args The arguments for the format string.
     */
    static i(prefix: string, format?: string, ...args: Array<any>): void;
    /**
     * Logs a `verbose` message.
     * @param prefix The prefix for the log message.
     * @param format The format string for the log message.
     * @param args The arguments for the format string.
     */
    static v(prefix: string, format?: string, ...args: Array<any>): void;
    /**
     * Logs a `warning` message.
     * @param prefix The prefix for the log message.
     * @param format The format string for the log message.
     * @param args The arguments for the format string.
     */
    static w(prefix: string, format?: string, ...args: Array<any>): void;
    /**
     * Logs an `error` message.
     * @param prefix The prefix for the log message.
     * @param format The format string for the log message.
     * @param error The error object.
     * @param args The arguments for the format string.
     */
    static e(prefix: string, format?: string, error?: Error, ...args: Array<any>): void;
    /**
     * Logs a message asynchronously with a specified level.
     * @param prefix - The prefix for the log message.
     * @param format - The format string for the log message (optional).
     * @param level - The log level (default is 'info').
     * @param args - The arguments for the format string.
     * @returns A promise that resolves when the log operation is complete.
     */
    static a(prefix: string, format?: string, level?: LogLevel, ...args: Array<any>): Promise<void>;
    /**
     * Logs a message with a specified level.
     * @param prefix The prefix for the log message.
     * @param format The format string for the log message.
     * @param level The log level (default is 'info').
     * @param args The arguments for the format string.
     * @see LogLevel
     */
    static l(prefix: string, format?: string, level?: LogLevel, ...args: Array<any>): void;
    /**
     * Clears all transports from the logger.
     */
    static clear(): void;
    /**
     * Flushes the event cache by logging all cached messages at the
     * current log level.
     *
     * After logging, the event cache is cleared.
     */
    static flush(): void;
    /**
     * Checks if a log level is enabled.
     * @param level The log level to check.
     * @returns True if the log level is enabled, false otherwise.
     * @see LogLevel
     */
    private static isLoggable;
    /**
     * Builds a log message.
     * @param prefix The prefix for the log message.
     * @param format The format string for the log message.
     * @param args The arguments for the format string.
     * @returns The formatted log message.
     */
    private static buildMessage;
    /**
     * Extracts the stack trace from an error and formats it based on the log level.
     * @param level - The log level (e.g., `'debug'`, `'info'`, `'warn'`, `'error'`).
     * @param error - The error object to extract the stack trace from (optional).
     * @returns The formatted stack trace message.
     */
    private static extractStackTrace;
    /**
     * Caches an event message.
     * @param message The message to cache.
     * @param cacheSize The size of the cache.
     */
    private static cacheEvent;
    /**
     * Gets the default message for a given log level.
     * If an error is provided, it extracts the stack trace from the error.
     *
     * @param level - The log level (e.g., 'debug', 'info', 'warn', 'error').
     * @param error - The error object to extract the stack trace from (optional).
     * @returns The default log message or the extracted stack trace message.
     */
    private static getDefaultMessage;
    /**
     * Determines the number of dialable characters in a string.
     * @param toCount The string to count dialable characters in.
     * @returns The count of dialable characters.
     */
    private static getDialCount;
    /**
     * Disables logging if the extended logging duration has expired.
     */
    private static maybeDisableLogging;
    /**
     * Updates the logger format based on the colorization setting.
     */
    private static updateLoggerFormat;
}
