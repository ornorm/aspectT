/**
 * This TypeScript code is a port of the EasyLogger library originally written in C.
 * The original C code was created byArmink, <armink.ztl@gmail.com>.
 *
 * Ported to TypeScript by Aimé Biendo <abiendo@gmail.com> as part of the AspectT Inc. AOP project.
 *
 * This file is part of the AspectT Inc. product, a seamless aspect-oriented extension to the TypeScript™ programming language.
 * JavaScript platform compatible. Easy to learn and use.
 *
 * This file is part of the EasyLogger Library.
 *
 * Copyright (c) 2015-2019, Armink, <armink.ztl@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * 'Software'), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * Function: It is an head file for this library. You can see all be called functions.
 * Created on: 2015-04-28
 */

import {getenv_int, getenv_string, ifdef, ifndef} from '../util/getenv';
import {get_print_context, print_format} from '../util/printf';
import {ELOG_LVL_ASSERT, ELOG_LVL_DEBUG, ELOG_LVL_ERROR, ELOG_LVL_INFO, ELOG_LVL_VERBOSE, ELOG_LVL_WARN} from './elog_cfg.h';
import {InspectOptions} from 'util';

/**
 * Enum representing the different format indices for `EasyLogger`.
 *
 * Each index corresponds to a specific log format component.
 */
export enum ElogFmtIndex {
    /** Log level format */
    ELOG_FMT_LVL = 1 << 0,
    /** Log tag format */
    ELOG_FMT_TAG = 1 << 1,
    /** Log time format */
    ELOG_FMT_TIME = 1 << 2,
    /** Process information format */
    ELOG_FMT_P_INFO = 1 << 3,
    /** Worker information format */
    ELOG_FMT_T_INFO = 1 << 4,
    /** Directory format */
    ELOG_FMT_DIR = 1 << 5,
    /** Function name format */
    ELOG_FMT_FUNC = 1 << 6,
    /** Line number format */
    ELOG_FMT_LINE = 1 << 7
}

/**
 * A bitmask representing all possible log format components.
 *
 * This combines all the individual format indices defined in `ElogFmtIndex`.
 * @see ElogFmtIndex
 */
export const ELOG_FMT_ALL: number = (
    ElogFmtIndex.ELOG_FMT_LVL |
    ElogFmtIndex.ELOG_FMT_TAG |
    ElogFmtIndex.ELOG_FMT_TIME |
    ElogFmtIndex.ELOG_FMT_P_INFO |
    ElogFmtIndex.ELOG_FMT_T_INFO |
    ElogFmtIndex.ELOG_FMT_DIR |
    ElogFmtIndex.ELOG_FMT_FUNC |
    ElogFmtIndex.ELOG_FMT_LINE
);

/**
 * Interface representing a filter for log levels and tags.
 */
export interface ElogTagLvlFilter {
    /** The log level to filter */
    level: number;
    /** The tag associated with the log level */
    tag: string;
    /** Flag indicating whether the tag is used */
    tag_use_flag: boolean;
}

/**
 * Interface representing a filter for EasyLogger.
 *
 * This filter allows specifying the log level, tag, keyword, and a list of tag-level filters.
 */
export interface ElogFilter {
    /** The log level to filter */
    level: number;
    /** The tag associated with the log level */
    tag: string;
    /** The keyword to filter logs */
    keyword: string;
    /**
     * Array of tag-level filters
     * @see ElogTagLvlFilter
     */
    tag_lvl: Array<ElogTagLvlFilter>;
}

/*
    EasyLogger extern Api.

    The following functions are defined in the EasyLogger .h library.

    Here adapting the C extern functions to TypeScript functions.
 */

/**
 * Type definition for a log function.
 *
 * This function is used to log messages with a specific tag.
 *
 * @param tag - The tag associated with the log message.
 * @param args - Additional arguments for the log message.
 */
export type LogFunction = (tag: string, ...args: Array<any>) => void;
/**
 * Type definition for a raw log function.
 *
 * A generic log function that can be used to log messages without or
 * with a tag.
 *
 * Depending on the implementation, the tag may be optional.
 *
 * @param args - Additional arguments for the log message.
 */
export type LogRawFunction = (...args: Array<any>) => void;

/**
 * Interface representing external configurations and functions for `EasyLogger`.
 */
export interface Extern {
    /** A dictionary of additional properties */
    [key: string]: any;
    /**
     * The filter configuration for logging.
     * @see ElogFilter
     */
    filter: ElogFilter;
    /** Array of enabled format sets */
    enabled_fmt_set: Array<number>;
    /** Flag indicating if initialization is successful */
    init_ok: boolean;
    /** Flag indicating if output is enabled */
    output_enabled: boolean;
    /** Flag indicating if output lock is enabled */
    output_lock_enabled: boolean;
    /** Flag indicating if output was locked before enabling */
    output_is_locked_before_enable: boolean;
    /** Flag indicating if output was locked before disabling */
    output_is_locked_before_disable: boolean;
    /** Flag indicating if text color is enabled (optional) */
    text_color_enabled?: boolean;
    /**
     * Function for raw logging (optional)
     * @see LogRawFunction
     */
    elog_raw?: LogRawFunction;
    /**
     * Function for assert logging (optional)
     * @see LogFunction
     */
    elog_assert?: LogFunction;
    /**
     * Function for error logging (optional)
     * @see LogFunction
     */
    elog_error?: LogFunction;
    /**
     * Function for warning logging (optional)
     * @see LogFunction
     */
    elog_warn?: LogFunction;
    /**
     * Function for info logging (optional)
     * @see LogFunction
     */
    elog_info?: LogFunction;
    /**
     * Function for debug logging (optional)
     * @see LogFunction
     */
    elog_debug?: LogFunction;
    /**
     * Function for verbose logging (optional)
     * @see LogFunction
     */
    elog_verbose?: LogFunction;
}

/**
 * Struct representing the `Elog` API.
 *
 * The logging functions are defined in the `Elog` struct.
 */
export type Elog = {
    /**
     * Initialize the logger.
     * @returns The error code.
     * @see ElogErrCode
     */
    elog_init: () => ElogErrCode;
    /**
     * Deinitialize the logger.
     */
    elog_deinit: () => void;
    /**
     * Start the logger.
     */
    elog_start: () => void;
    /**
     * Stop the logger.
     */
    elog_stop: () => void;
    /**
     * Enable or disable output.
     * @param enabled - Whether to enable output.
     */
    elog_set_output_enabled: (enabled: boolean) => void;
    /**
     * Get the current output enabled state.
     * @returns The current output enabled state.
     */
    elog_get_output_enabled: () => boolean;
    /**
     * Enable or disable text color.
     * @param enabled - Whether to enable text color.
     */
    elog_set_text_color_enabled: (enabled: boolean) => void;
    /**
     * Get the current text color enabled state.
     * @returns The current text color enabled state.
     */
    elog_get_text_color_enabled: () => boolean;
    /**
     * Set the format for a specific log level.
     * @param level - The log level.
     * @param set - The format set.
     */
    elog_set_fmt: (level: number, set: number) => void;
    /**
     * Set the filter for logging.
     * @param level - The log level.
     * @param tag - The log tag.
     * @param keyword - The keyword to filter logs.
     */
    elog_set_filter: (level: number, tag: string, keyword: string) => void;
    /**
     * Set the filter level.
     * @param level - The log level.
     */
    elog_set_filter_lvl: (level: number) => void;
    /**
     * Set the filter tag.
     * @param tag - The log tag.
     */
    elog_set_filter_tag: (tag: string) => void;
    /**
     * Set the filter keyword.
     * @param keyword - The keyword to filter logs.
     */
    elog_set_filter_kw: (keyword: string) => void;
    /**
     * Set the filter tag level.
     * @param tag - The log tag.
     * @param level - The log level.
     */
    elog_set_filter_tag_lvl: (tag: string, level: number) => void;
    /**
     * Get the filter tag level.
     * @param tag - The log tag.
     * @returns The log level.
     */
    elog_get_filter_tag_lvl: (tag: string) => number;
    /**
     * Output a raw log message.
     * @param format - The log format.
     * @param args - Additional arguments for the log message.
     */
    elog_raw_output: (format: string, ...args: any[]) => void;
    /**
     * Output a log message.
     * @param level - The log level.
     * @param tag - The log tag.
     * @param file - The file name.
     * @param func - The function name.
     * @param line - The line number.
     * @param format - The log format.
     * @param args - Additional arguments for the log message.
     */
    elog_output: (level: number, tag: string, file: string, func: string, line: number, format: string, ...args: any[]) => void;
    /**
     * Enable or disable output lock.
     * @param enabled - Whether to enable output lock.
     */
    elog_output_lock_enabled: (enabled: boolean) => void;
    /**
     * Optional hook for assert logging.
     * @param expr - The expression.
     * @param func - The function name.
     * @param line - The line number.
     */
    elog_assert_hook?: ((expr: string, func: string, line: number) => void) | null;
    /**
     * Set the hook for assert logging.
     * @param hook - The hook function.
     */
    elog_assert_set_hook: (hook: (expr: string, func: string, line: number) => void) => void;
    /**
     * Find the log level from a log message.
     * @param log - The log message.
     * @returns The log level.
     */
    elog_find_lvl: (log: string) => number;
    /**
     * Find the log tag from a log message.
     * @param log - The log message.
     * @param lvl - The log level.
     * @param tag_len - The tag length.
     * @returns The log tag or null if not found.
     */
    elog_find_tag: (log: string, lvl: number, tag_len: number) => string | null;
    /**
     * Perform a hex dump of a buffer.
     * @param name - The name of the dump.
     * @param width - The width of the dump.
     * @param buf - The buffer to dump.
     * @param size - The size of the buffer.
     */
    elog_hexdump: (name: string, width: number, buf: ArrayBuffer, size: number) => void;
    /**
     * Enable or disable buffer logging.
     * @param enabled - Whether to enable buffer logging.
     */
    elog_buf_enabled: (enabled: boolean) => void;
    /**
     * Flush the log buffer.
     */
    elog_flush: () => void;
    /**
     * Enable or disable asynchronous logging.
     * @param enabled - Whether to enable asynchronous logging.
     */
    elog_async_enabled: (enabled: boolean) => void;
    /**
     * Get an asynchronous log message.
     * @param log - The log message.
     * @param size - The size of the log message.
     * @returns The size of the log message.
     */
    elog_async_get_log: (log: string, size: number) => number;
    /**
     * Get an asynchronous line log message.
     * @param log - The log message.
     * @param size - The size of the log message.
     * @returns The size of the log message.
     */
    elog_async_get_line_log: (log: string, size: number) => number;
    /**
     * Copy a string.
     * @param cur_len - The current length of the string.
     * @param dst - The destination string.
     * @param src - The source string.
     * @returns The length of the copied string.
     */
    elog_strcpy: (cur_len: number, dst: string, src: string) => number;
    /**
     * Copy a line.
     * @param line - The line to copy.
     * @param log - The log message.
     * @param len - The length of the line.
     * @returns The length of the copied line.
     */
    elog_cpyln: (line: string, log: string, len: number) => number;
    /**
     * Copy memory.
     * @param dst - The destination buffer.
     * @param src - The source buffer.
     * @param count - The number of bytes to copy.
     */
    elog_memcpy: (dst: ArrayBuffer, src: ArrayBuffer, count: number) => void;
}

/**
 * Type representing the combination of external configurations and
 * functions for `EasyLogger`.
 *
 * This type extends both `Extern` and `Elog` interfaces, providing a
 * comprehensive set of properties and methods for logging functionality.
 * @see Extern
 * @see Elog
 */
export type EasyLog = Extern & Elog;

/**
 * Enum representing error codes for `EasyLogger`.
 */
export enum ElogErrCode {
    /** No error */
    ELOG_NO_ERR
}

/**
 * The `EasyLogger` object provides a comprehensive set of properties
 * and methods for logging functionality, combining both external
 * configurations and functions.
 *
 * @see EasyLog
 */
export const EasyLogger: EasyLog = {
    filter: {
        level: 0,
        tag: '',
        keyword: '',
        tag_lvl: []
    },
    enabled_fmt_set: [],
    init_ok: false,
    output_enabled: false,
    output_lock_enabled: false,
    output_is_locked_before_enable: false,
    output_is_locked_before_disable: false,
    /**
     * @inheritDoc
     */
    elog_init: (): ElogErrCode => ElogErrCode.ELOG_NO_ERR,
    /**
     * @inheritDoc
     */
    elog_deinit: (): void => {},
    /**
     * @inheritDoc
     */
    elog_start: (): void => {},
    /**
     * @inheritDoc
     */
    elog_stop: (): void => {},
    /**
     * @inheritDoc
     */
    elog_set_output_enabled: (enabled: boolean): void => {},
    /**
     * @inheritDoc
     */
    elog_get_output_enabled: (): boolean => false,
    /**
     * @inheritDoc
     */
    elog_set_text_color_enabled: (enabled: boolean): void => {},
    /**
     * @inheritDoc
     */
    elog_get_text_color_enabled: (): boolean => false,
    /**
     * @inheritDoc
     */
    elog_set_fmt: (level: number, set: number): void => {},
    /**
     * @inheritDoc
     */
    elog_set_filter: (level: number, tag: string, keyword: string): void => {},
    /**
     * @inheritDoc
     */
    elog_set_filter_lvl: (level: number): void => {},
    /**
     * @inheritDoc
     */
    elog_set_filter_tag: (tag: string): void => {},
    /**
     * @inheritDoc
     */
    elog_set_filter_kw: (keyword: string): void => {},
    /**
     * @inheritDoc
     */
    elog_set_filter_tag_lvl: (tag: string, level: number): void => {},
    /**
     * @inheritDoc
     */
    elog_get_filter_tag_lvl: (tag: string): number => 0,
    /**
     * @inheritDoc
     */
    elog_raw_output: (format: string, ...args: any[]): void => {},
    /**
     * @inheritDoc
     */
    elog_output: (level: number, tag: string, file: string, func: string, line: number, format: string, ...args: any[]): void => {},
    /**
     * @inheritDoc
     */
    elog_output_lock_enabled: (enabled: boolean): void => {},
    /**
     * @inheritDoc
     */
    elog_assert_hook: null,
    /**
     * @inheritDoc
     */
    elog_assert_set_hook(
        hook: (expr: string, func: string, line: number) => void
    ): void {
        this.elog_assert_hook = hook;
    },
    /**
     * @inheritDoc
     */
    elog_find_lvl: (log: string): number => 0,
    /**
     * @inheritDoc
     */
    elog_find_tag: (log: string, lvl: number, tag_len: number): string | null => null,
    /**
     * @inheritDoc
     */
    elog_hexdump: (name: string, width: number, buf: ArrayBuffer, size: number): void => {},
    /**
     * @inheritDoc
     */
    elog_buf_enabled: (enabled: boolean): void => {},
    /**
     * @inheritDoc
     */
    elog_flush: (): void => {},
    /**
     * @inheritDoc
     */
    elog_async_enabled: (enabled: boolean): void => {},
    /**
     * @inheritDoc
     */
    elog_async_get_log: (log: string, size: number): number => 0,
    /**
     * @inheritDoc
     */
    elog_async_get_line_log: (log: string, size: number): number => 0,
    /**
     * @inheritDoc
     */
    elog_strcpy: (cur_len: number, dst: string, src: string): number => 0,
    /**
     * @inheritDoc
     */
    elog_cpyln: (line: string, log: string, len: number): number => 0,
    /**
     * @inheritDoc
     */
    elog_memcpy: (dst: ArrayBuffer, src: ArrayBuffer, count: number): void => {}
};

export interface printfOptions {
    level: number;
    expected?: any;
    message: any;
    defaultMsg: string;
    params?: Array<any>;
    options?: InspectOptions;
}

/**
 * Logs a message with a specific tag.
 *
 * @param tag - The tag associated with the log message.
 * @param args - Additional arguments for the log message.
 */
function elog(tag: string, ...args: Array<any>): void {
    const message: any = args[0];
    const formattedMessage: string = print_format.call(get_print_context(), message, '');
    console.log(formattedMessage.length ? `${tag}: ${formattedMessage}` : tag);
}

/**
 * Logs an assert message with a specific tag.
 *
 * @param tag - The tag associated with the log message.
 * @param args - Additional arguments for the log message.
 */
function elog_assert(tag: string, ...args: Array<any>): void {
    const condition: boolean = args[0];
    const message: any = args[1];
    const formattedMessage: string = print_format.call(get_print_context(), message, `${args[0]} has assert failed`);
    const optionalParams: Array<any> = args.slice(2);
    console.assert(condition, `${tag}: ${formattedMessage}`, ...optionalParams);
}

/**
 * Logs an error message with a specific tag.
 *
 * @param tag - The tag associated with the log message.
 * @param args - Additional arguments for the log message.
 */
function elog_error(tag: string, ...args: Array<any>): void {
    const error: Error = args[0];
    const message: any = args[1];
    const formattedMessage: string = print_format.call(get_print_context(), message, `${error.message}`);
    const optionalParams: Array<any> = args.slice(2);
    console.error(`${tag}: ${formattedMessage}`, ...optionalParams);
}

/**
 * Logs a warning message with a specific tag.
 *
 * @param tag - The tag associated with the log message.
 * @param args - Additional arguments for the log message.
 */
function elog_warn(tag: string, ...args: Array<any>): void {
    const message: any = args[0];
    const formattedMessage: string = print_format.call(get_print_context(), message, 'Warning');
    const optionalParams: Array<any> = args.slice(1);
    console.warn(`${tag}: ${formattedMessage}`, ...optionalParams);
}

/**
 * Logs an info message with a specific tag.
 *
 * @param tag - The tag associated with the log message.
 * @param args - Additional arguments for the log message.
 */
function elog_info(tag: string, ...args: Array<any>): void {
    const message: any = args[0];
    const formattedMessage: string = print_format.call(get_print_context(), message, 'Info');
    const optionalParams: Array<any> = args.slice(1);
    console.info(`${tag}: ${formattedMessage}`, ...optionalParams);
}

/**
 * Logs a debug message with a specific tag.
 *
 * @param tag - The tag associated with the log message.
 * @param args - Additional arguments for the log message.
 */
function elog_debug(tag: string, ...args: Array<any>): void {
    const message: any = args[0];
    const formattedMessage: string = print_format.call(get_print_context(), message, 'Debug');
    const optionalParams: Array<any> = args.slice(1);
    console.debug(`${tag}: ${formattedMessage}`, ...optionalParams);
}

/**
 * Logs a verbose message with a specific tag.
 *
 * @param tag - The tag associated with the log message.
 * @param args - Additional arguments for the log message.
 */
function elog_verbose(tag: string, ...args: Array<any>): void {
    const message: any = args[0];
    const formattedMessage: string = print_format.call(get_print_context(), message, 'Verbose');
    const optionalParams: Array<any> = args.slice(1);
    console.log(`${tag}: ${formattedMessage}`, ...optionalParams);
}

/* EasyLogger assert for developer. */
if (ifdef('ELOG_ASSERT_ENABLE')) {
    EasyLogger.elog_assert = (tag: string, ...args: Array<string>): void => {
        if (!args[0]) {
            const { functionName, lineNumber }: DebugPoint =
                elog_debug_point(EasyLogger.elog_assert!);
            if (EasyLogger.elog_assert_hook == null) {
                EasyLogger.elog_raw?.(tag, `${args[0]} has assert failed at ${functionName}:${lineNumber}`);
            } else {
                EasyLogger.elog_assert_hook(`${args[0]}`, functionName, lineNumber);
            }
        }
    };
} else {
    EasyLogger.elog_assert = elog_assert;
}

if (ifndef('ELOG_OUTPUT_ENABLE')) {
    EasyLogger.elog_raw = elog;
    EasyLogger.elog_assert = elog_assert;
    EasyLogger.elog_error = elog_error;
    EasyLogger.elog_warn = elog_warn;
    EasyLogger.elog_info = elog_info;
    EasyLogger.elog_debug = elog_debug;
    EasyLogger.elog_verbose = elog_verbose;
} else {
    /*
        Unlike the original C implementation, the TypeScript implementation

        check only of one of the following flags is defined.
     */

    if (
        ifdef('ELOG_FMT_USING_FUNC') ||
        ifdef('ELOG_FMT_USING_DIR') ||
        ifdef('ELOG_FMT_USING_LINE')
    ) {
        const ELOG_OUTPUT_DIR: string = getenv_string('ELOG_FMT_USING_DIR', 'logs');

        EasyLogger.elog_raw = (...args: [string, ...Array<any>]): void => {
            EasyLogger.elog_raw_output(...args);
        };

        if (ifdef('ELOG_OUTPUT_LVL') && getenv_int('ELOG_OUTPUT_LVL', ELOG_LVL_ASSERT) >= ELOG_LVL_ASSERT) {
            EasyLogger.elog_assert = (tag: string, ...args: [string, ...any[]]): void => {
                const {functionName, lineNumber}: DebugPoint = elog_debug_point(EasyLogger.elog_assert!);
                EasyLogger.elog_output(
                    ELOG_LVL_ASSERT,
                    tag,
                    ELOG_OUTPUT_DIR,
                    functionName,
                    lineNumber,
                    ...args
                );
            };
        }

        if (ifdef('ELOG_OUTPUT_LVL') && getenv_int('ELOG_OUTPUT_LVL', ELOG_LVL_ERROR) >= ELOG_LVL_ERROR) {
            EasyLogger.elog_error = (tag: string, ...args: [string, ...Array<any>]): void => {
                const {functionName, lineNumber}: DebugPoint = elog_debug_point(EasyLogger.elog_error!);
                EasyLogger.elog_output(
                    ELOG_LVL_ERROR, tag,
                    ELOG_OUTPUT_DIR,
                    functionName,
                    lineNumber,
                    ...args
                );
            };
        }

        if (ifdef('ELOG_OUTPUT_LVL') && getenv_int('ELOG_OUTPUT_LVL', ELOG_LVL_WARN) >= ELOG_LVL_WARN) {
            EasyLogger.elog_warn = (tag: string, ...args: [string, ...Array<any>]): void => {
                const {functionName, lineNumber}: DebugPoint = elog_debug_point(EasyLogger.elog_warn!);
                EasyLogger.elog_output(
                    ELOG_LVL_WARN, tag,
                    ELOG_OUTPUT_DIR,
                    functionName,
                    lineNumber,
                    ...args
                );
            };
        }

        if (ifdef('ELOG_OUTPUT_LVL') && getenv_int('ELOG_OUTPUT_LVL', ELOG_LVL_INFO) >= ELOG_LVL_INFO) {
            EasyLogger.elog_info = (tag: string, ...args: [string, ...Array<any>]): void => {
                const {functionName, lineNumber}: DebugPoint = elog_debug_point(EasyLogger.elog_warn!);
                EasyLogger.elog_output(
                    ELOG_LVL_INFO, tag,
                    ELOG_OUTPUT_DIR,
                    functionName,
                    lineNumber,
                    ...args
                );
            };
        }

        if (ifdef('ELOG_OUTPUT_LVL') && getenv_int('ELOG_OUTPUT_LVL', ELOG_LVL_DEBUG) >= ELOG_LVL_DEBUG) {
            EasyLogger.elog_debug = (tag: string, ...args: [string, ...Array<any>]): void => {
                const {functionName, lineNumber}: DebugPoint = elog_debug_point(EasyLogger.elog_debug!);
                EasyLogger.elog_output(
                    ELOG_LVL_DEBUG, tag,
                    ELOG_OUTPUT_DIR,
                    functionName,
                    lineNumber,
                    ...args
                );
            };
        }

        if (ifdef('ELOG_OUTPUT_LVL') && getenv_int('ELOG_OUTPUT_LVL', ELOG_LVL_VERBOSE) === ELOG_LVL_VERBOSE) {
            EasyLogger.elog_verbose = (tag: string, ...args: [string, ...Array<any>]): void => {
                const {functionName, lineNumber}: DebugPoint = elog_debug_point(EasyLogger.elog_verbose!);
                EasyLogger.elog_output(
                    ELOG_LVL_VERBOSE, tag,
                    ELOG_OUTPUT_DIR,
                    functionName,
                    lineNumber,
                    ...args
                );
            };
        }
    } else {
        EasyLogger.elog_raw = (...args: [string, ...Array<any>]): void => {
            EasyLogger.elog_raw_output(...args);
        };
    }
}

/**
 * Represents a debug point in the code.
 * Contains the function name and line number.
 */
export type DebugPoint = { functionName: string; lineNumber: number };

/**
 * Utility function to get the function name and line number
 * @param func - The function to extract the name from
 * @returns An object containing the function name and line number
 * @see DebugPoint
 */
export function elog_debug_point(func: Function): DebugPoint {
    const functionName: string = func.name || "anonymous";
    const error: Error = new Error();
    const stackLines: string[] = error.stack?.split("\n") || [];
    let lineNumber: number = 0;
    for (const line of stackLines) {
        const match: RegExpMatchArray | null = line.match(/:(\d+):\d+\)?$/);
        if (match) {
            lineNumber = parseInt(match[1], 10);
            break;
        }
    }

    return { functionName, lineNumber };
}
