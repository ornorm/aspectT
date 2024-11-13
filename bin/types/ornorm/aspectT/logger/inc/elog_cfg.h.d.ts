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
/**
 * Log level for `assert` messages.
 */
export declare const ELOG_LVL_ASSERT: number;
/**
 * Log level for `error` messages.
 */
export declare const ELOG_LVL_ERROR: number;
/**
 * Log level for `warning` messages.
 */
export declare const ELOG_LVL_WARN: number;
/**
 * Log level for `informational` messages.
 */
export declare const ELOG_LVL_INFO: number;
/**
 * Log level for `debug` messages.
 */
export declare const ELOG_LVL_DEBUG: number;
/**
 * Log level for `verbose` messages.
 */
export declare const ELOG_LVL_VERBOSE: number;
export declare const ELOG_FILTER_LVL_SILENT: number;
export declare const ELOG_FILTER_LVL_ALL: number;
export declare const ELOG_LVL_TOTAL_NUM: number;
export declare const ELOG_SW_VERSION: string;
export declare const ELOG_SW_PORT_VERSION: string;
/**
 * Configuration interface for `EasyLogger`.
 *
 * This interface emulate the 'context'.
 */
export interface ElogCfg {
    ELOG_LVL_ASSERT: number;
    ELOG_LVL_ERROR: number;
    ELOG_LVL_WARN: number;
    ELOG_LVL_INFO: number;
    ELOG_LVL_DEBUG: number;
    ELOG_LVL_VERBOSE: number;
    /**
     * enable log `output`.
     */
    ELOG_OUTPUT_ENABLE: boolean;
    /**
     * setting static output log level. range: from `ELOG_LVL_ASSERT` to `ELOG_LVL_VERBOSE`.
     */
    ELOG_OUTPUT_LVL: number;
    /**
     * enable `assert` check.
     */
    ELOG_ASSERT_ENABLE: boolean;
    /**
     * buffer `size` for every line's log.
     */
    ELOG_LINE_BUF_SIZE: number;
    /**
     * output` line` number max length.
     */
    ELOG_LINE_NUM_MAX_LEN: number;
    /**
     * output filter's `tag` max length.
     */
    ELOG_FILTER_TAG_MAX_LEN: number;
    /**
     * output filter's `keyword` max length.
     */
    ELOG_FILTER_KW_MAX_LEN: number;
    /**
     * output filter's `tag` level max num.
     */
    ELOG_FILTER_TAG_LVL_MAX_NUM: number;
    /**
     * output newline `sign`.
     */
    ELOG_NEWLINE_SIGN: string;
    /**
     * enable log `color`.
     */
    ELOG_COLOR_ENABLE: boolean;
    /**
     * change the `assert` level logs to not default color if you want.
     */
    ELOG_COLOR_ASSERT: string;
    /**
     * change the `error` level logs to not default color if you want.
     */
    ELOG_COLOR_ERROR: string;
    /**
     * change the `warn` level logs to not default color if you want.
     */
    ELOG_COLOR_WARN: string;
    /**
     * change the `info` level logs to not default color if you want.
     */
    ELOG_COLOR_INFO: string;
    /**
     * change the `debug` level logs to not default color if you want.
     */
    ELOG_COLOR_DEBUG: string;
    /**
     * change the `verbose` level logs to not default color if you want.
     */
    ELOG_COLOR_VERBOSE: string;
    /**
     * enable log `fmt` using callback.
     */
    ELOG_FMT_USING_FUNC: boolean;
    /**
     * enable log `fmt` using dir.
     */
    ELOG_FMT_USING_DIR: boolean;
    /**
     *  enable log `fmt` using line.
     */
    ELOG_FMT_USING_LINE: boolean;
    /**
     * enable `asynchronous` output mode.
     */
    ELOG_ASYNC_OUTPUT_ENABLE: boolean;
    /**
     * the highest output level for async mode, other level will sync output.
     */
    ELOG_ASYNC_OUTPUT_LVL: number;
    /**
     *  buffer `size` for asynchronous output mode.
     */
    ELOG_ASYNC_OUTPUT_BUF_SIZE: number;
    /**
     * each asynchronous output's log which must end with newline sign.
     */
    ELOG_ASYNC_LINE_OUTPUT: boolean;
    /**
     * asynchronous output mode using Worker implementation.
     */
    ELOG_ASYNC_OUTPUT_USING_PTHREAD: boolean;
    /**
     * enable `buffered` output mode.
     */
    ELOG_BUF_OUTPUT_ENABLE: boolean;
    /**
     * buffer `size` for buffered output mode.
     */
    ELOG_BUF_OUTPUT_BUF_SIZE: number;
}
/**
 * Retrieves the configuration for `EasyLogger` from environment variables.
 *
 * Create the `configuration` object for `EasyLogger` from the environment
 * variables.
 *
 * @returns The configuration object for `EasyLogger`.
 * @see ElogCfg
 */
declare function cfg(): ElogCfg;
/**
 * Default configuration for `EasyLogger`.
 *
 * Instantiates the default configuration for `EasyLogger`.
 * @see ElogCfg
 */
declare const eLogCfg: ElogCfg;
export { cfg, eLogCfg };
