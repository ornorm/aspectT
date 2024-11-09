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
    level: string;
    message: any;
    [LEVEL]?: string;
    [MESSAGE]?: any;
    [SPLAT]?: any;
    [key: string | symbol]: any;
}

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

    private static eventCache: Array<string> = [];

    private constructor() {}
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

    /**
     * Sets the log level.
     * @param level The new log level.
     */
    public static set level(level: string) {
        Log.logger.level = level;
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
    public static d(prefix: string, format: string): void;
    public static d(prefix: string, format: string, ...args: Array<any>): void {
        if (Log.sIsUserExtendedLoggingEnabled) {
            Log.maybeDisableLogging();
            Log.cacheEvent(Log.buildMessage(prefix, format, args), Log.EVENTS_TO_CACHE_DEBUG);
            Log.logger.info(Log.buildMessage(prefix, format, args));
        } else if (Log.DEBUG) {
            Log.cacheEvent(Log.buildMessage(prefix, format, args), Log.EVENTS_TO_CACHE);
            Log.logger.debug(Log.buildMessage(prefix, format, args));
        }
    }

    /**
     * Logs an `info` message.
     * @param prefix The prefix for the log message.
     * @param format The format string for the log message.
     * @param args The arguments for the format string.
     */
    public static i(prefix: string, format: string): void;
    public static i(prefix: string, format: string, ...args: Array<any>): void {
        if (Log.INFO) {
            Log.logger.info(Log.buildMessage(prefix, format, args));
        }
    }

    /**
     * Logs a `verbose` message.
     * @param prefix The prefix for the log message.
     * @param format The format string for the log message.
     * @param args The arguments for the format string.
     */
    public static v(prefix: string, format: string, ...args: Array<any>): void;
    public static v(prefix: string, format: string): void;
    public static v(prefix: string, format: string, ...args: Array<any>): void {
        if (Log.sIsUserExtendedLoggingEnabled) {
            Log.maybeDisableLogging();
            Log.cacheEvent(Log.buildMessage(prefix, format, args), Log.EVENTS_TO_CACHE_DEBUG);
            Log.logger.info(Log.buildMessage(prefix, format, args));
        } else if (Log.VERBOSE) {
            Log.cacheEvent(Log.buildMessage(prefix, format, args), Log.EVENTS_TO_CACHE);
            Log.logger.verbose(Log.buildMessage(prefix, format, args));
        }
    }

    /**
     * Logs a `warning` message.
     * @param prefix The prefix for the log message.
     * @param format The format string for the log message.
     * @param args The arguments for the format string.
     */
    public static w(prefix: string, format: string): void;
    public static w(prefix: string, format: string, ...args: Array<any>): void {
        if (Log.WARN) {
            Log.logger.warn(Log.buildMessage(prefix, format, args));
        }
    }

    /**
     * Logs an `error` message.
     * @param prefix The prefix for the log message.
     * @param format The format string for the log message.
     * @param error The error object.
     * @param args The arguments for the format string.
     */
    public static e(prefix: string, format: string, error?: Error): void;
    public static e(prefix: string, format: string, error: Error, ...args: Array<any>): void {
        if (Log.ERROR) {
            Log.logger.error(Log.buildMessage(prefix, format, args), error);
        }
    }

    /**
     * Logs a critical `panic` error message.
     * @param prefix The prefix for the log message.
     * @param error The error object.
     * @param format The format string for the log message.
     * @param args The arguments for the format string.
     */
    public static p(prefix: string, error: Error, format: string): void;
    public static p(prefix: string, error: Error, format: string, ...args: Array<any>): void {
        Log.logger.error(Log.buildMessage(prefix, format, args), error);
    }

    /**
     * Sets the log tag.
     * @param tag The new log tag.
     */
    public static setTag(tag: string): void {
        Log.TAG = tag;
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
