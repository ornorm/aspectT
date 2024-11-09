/**
 * Copyright (C) 2012-2015 Yecheng Fu <cofyc.jackson at gmail dot com>
 * All rights reserved.
 *
 * Use of this source code is governed by a MIT-style license that can be found
 * in the LICENSE file.
 */

export type ArgparseCallback = (self: Argparse, option: ArgparseOption) => number;

export enum ArgparseFlag {
    STOP_AT_NON_OPTION = 1 << 0,
    IGNORE_UNKNOWN_ARGS = 1 << 1,
}

export enum ArgparseOptionType {
    END,
    GROUP,
    BOOLEAN,
    BIT,
    INTEGER,
    FLOAT,
    STRING,
}

export enum ArgparseOptionFlags {
    NONEG = 1,
}

export type ArgparseOption = {
    type: ArgparseOptionType;
    shortName: string;
    longName: string | null;
    value: any;
    help: string;
    callback: ArgparseCallback | null;
    data: any;
    flags: number;
};

export type Argparse = {
    options: ArgparseOption[];
    usages: string[];
    flags: number;
    description: string;
    epilog: string;
    argc: number;
    argv: string[];
    out: string[];
    cpidx: number;
    optvalue: string;
};

// Built-in option macros
export function createOptEnd(): ArgparseOption {
    return {
        type: ArgparseOptionType.END,
        shortName: '',
        longName: null,
        value: null,
        help: '',
        callback: null,
        data: null,
        flags: 0
    };
}

export function createOptBoolean(shortName: string, longName: string | null, value: any, help: string, callback: ArgparseCallback | null, data: any, flags: number): ArgparseOption {
    return {
        type: ArgparseOptionType.BOOLEAN,
        shortName,
        longName,
        value,
        help,
        callback,
        data,
        flags
    };
}

export function createOptBit(shortName: string, longName: string | null, value: any, help: string, callback: ArgparseCallback | null, data: any, flags: number): ArgparseOption {
    return {
        type: ArgparseOptionType.BIT,
        shortName,
        longName,
        value,
        help,
        callback,
        data,
        flags
    };
}

export function createOptInteger(shortName: string, longName: string | null, value: any, help: string, callback: ArgparseCallback | null, data: any, flags: number): ArgparseOption {
    return {
        type: ArgparseOptionType.INTEGER,
        shortName,
        longName,
        value,
        help,
        callback,
        data,
        flags
    };
}

export function createOptFloat(shortName: string, longName: string | null, value: any, help: string, callback: ArgparseCallback | null, data: any, flags: number): ArgparseOption {
    return {
        type: ArgparseOptionType.FLOAT,
        shortName,
        longName,
        value,
        help,
        callback,
        data,
        flags
    };
}

export function createOptString(shortName: string, longName: string | null, value: any, help: string, callback: ArgparseCallback | null, data: any, flags: number): ArgparseOption {
    return {
        type: ArgparseOptionType.STRING,
        shortName,
        longName,
        value,
        help,
        callback,
        data,
        flags
    };
}

export function createOptGroup(help: string): ArgparseOption {
    return {
        type: ArgparseOptionType.GROUP,
        shortName: '',
        longName: null,
        value: null,
        help,
        callback: null,
        data: null,
        flags: 0
    };
}

export function createOptHelp(): ArgparseOption {
    return createOptBoolean('h', 'help', null, 'show this help message and exit', null, null, ArgparseOptionFlags.NONEG);
}

// Function stubs (no implementation as per requirements)
export function argparseInit(self: Argparse, options: ArgparseOption[], usages: string[], flags: number): void {}
export function argparseDescribe(self: Argparse, description: string, epilog: string): void {}
export function argparseParse(self: Argparse, argc: number, argv: string[]): void {}
export function argparseUsage(self: Argparse): void {}
