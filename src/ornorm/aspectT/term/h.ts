/**
 * Copyright (C) 2012-2015 Yecheng Fu <cofyc.jackson at gmail dot com>
 * All rights reserved.
 *
 * Use of this source code is governed by a MIT-style license that can be found
 * in the LICENSE file.
 */

export type argparse_callback = (self: argparse, option: argparse_option) => number;

export enum argparse_flag {
    argparse_STOP_AT_NON_OPTION = 1 << 0,
    argparse_IGNORE_UNKNOWN_ARGS = 1 << 1,
}

export enum argparse_option_type {
    /* special */
    argparse_OPT_END,
    argparse_OPT_GROUP,
    /* options with no arguments */
    argparse_OPT_BOOLEAN,
    argparse_OPT_BIT,
    /* options with arguments (optional or required) */
    argparse_OPT_INTEGER,
    argparse_OPT_FLOAT,
    argparse_OPT_STRING,
}

export enum argparse_option_flags {
    /* disable negation */
    OPT_NONEG = 1,
}

/**
 *  argparse option
 *
 *  `type`:
 *    holds the type of the option, you must have an argparse_OPT_END last in your
 *    array.
 *
 *  `short_name`:
 *    the character to use as a short option name, '\0' if none.
 *
 *  `long_name`:
 *    the long option name, without the leading dash, NULL if none.
 *
 *  `value`:
 *    stores pointer to the value to be filled.
 *
 *  `help`:
 *    the short help message associated to what the option does.
 *    Must never be NULL (except for argparse_OPT_END).
 *
 *  `callback`:
 *    function is called when corresponding argument is parsed.
 *
 *  `data`:
 *    associated data. Callbacks can use it like they want.
 *
 *  `flags`:
 *    option flags.
 */
export type argparse_option = {
    type: argparse_option_type;
    short_name: string;
    long_name: string | null;
    value: any;
    help: string;
    callback: argparse_callback | null;
    data: any;
    flags: number;
};

export type argparse = {
    options: argparse_option[];
    usages: Array<string>;
    flags: number;
    // a description after usage
    description: string;
    // a description at the end
    epilog: string;
    // internal context
    argc: number;
    argv: Array<string>;
    out: Array<string>;
    cpidx: number;
    // current option value
    optvalue: string;
};

// built-in callbacks
export type argparse_help_cb = (this: argparse, option: argparse_option) => number;

export type argparse_help_cb_no_exit = (this: argparse, option: argparse_option) => number;

// Built-in option macros
export function OPT_END(): argparse_option {
    return {
        type: argparse_option_type.argparse_OPT_END,
        short_name: '',
        long_name: null,
        value: null,
        help: '',
        callback: null,
        data: null,
        flags: 0
    };
}

export function OPT_BOOLEAN(short_name: string, long_name: string | null, value: any, help: string, callback: argparse_callback | null, data: any, flags: number): argparse_option {
    return {
        type: argparse_option_type.argparse_OPT_BOOLEAN,
        short_name,
        long_name,
        value,
        help,
        callback,
        data,
        flags
    };
}

export function OPT_BIT(short_name: string, long_name: string | null, value: any, help: string, callback: argparse_callback | null, data: any, flags: number): argparse_option {
    return {
        type: argparse_option_type.argparse_OPT_BIT,
        short_name,
        long_name,
        value,
        help,
        callback,
        data,
        flags
    };
}

export function OPT_INTEGER(short_name: string, long_name: string | null, value: any, help: string, callback: argparse_callback | null, data: any, flags: number): argparse_option {
    return {
        type: argparse_option_type.argparse_OPT_INTEGER,
        short_name,
        long_name,
        value,
        help,
        callback,
        data,
        flags
    };
}

export function OPT_FLOAT(short_name: string, long_name: string | null, value: any, help: string, callback: argparse_callback | null, data: any, flags: number): argparse_option {
    return {
        type: argparse_option_type.argparse_OPT_FLOAT,
        short_name,
        long_name,
        value,
        help,
        callback,
        data,
        flags
    };
}

export function OPT_STRING(short_name: string, long_name: string | null, value: any, help: string, callback: argparse_callback | null, data: any, flags: number): argparse_option {
    return {
        type: argparse_option_type.argparse_OPT_STRING,
        short_name,
        long_name,
        value,
        help,
        callback,
        data,
        flags
    };
}

export function OPT_GROUP(help: string): argparse_option {
    return {
        type: argparse_option_type.argparse_OPT_GROUP,
        short_name: '',
        long_name: null,
        value: null,
        help,
        callback: null,
        data: null,
        flags: 0
    };
}

export function OPT_HELP(): argparse_option {
    return OPT_BOOLEAN('h', 'help', null, 'show this help message and exit', null, null, argparse_option_flags.OPT_NONEG);
}

// Function type aliases
export type argparseInit = (this: argparse, options: Array<argparse_option>, usages: Array<string>, flags: number) => void;
export type argparseDescribe = (this: argparse, description: string, epilog: string) => void;
export type argparseParse = (this: argparse, argc: number, argv: Array<string>) => void;
export type argparseUsage = (this: argparse) => void;
