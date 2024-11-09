/**
 * This TypeScript code is a port of the argparse library originally written in C.
 * The original C code was created by Yecheng Fu <cofyc.jackson at gmail dot com>.
 *
 * Ported to TypeScript by Aimé Biendo <abiendo@gmail.com> as part of the AspectT Inc. AOP project.
 *
 * This file is part of the AspectT Inc. product, a seamless aspect-oriented extension to the TypeScript™ programming language.
 * JavaScript platform compatible. Easy to learn and use.
 *
 * Copyright (C) 2012-2015 Yecheng Fu <cofyc.jackson at gmail dot com>
 * All rights reserved.
 *
 * Licensed under the MIT License. You may obtain a copy of the License at
 * https://opensource.org/licenses/MIT
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Log} from '@ornorm/aspectT';
import {
    argparse,
    argparse_flag,
    argparse_option,
    argparse_option_flags,
    argparse_option_type
} from '@ornorm/aspectT/argparse';

const TAG: string = 'argparse';
const OPT_UNSET: number = 1;
const OPT_LONG: number = 1 << 1;

/**
 * Removes the specified prefix from the beginning of the string if it exists.
 *
 * @param str - The string to process.
 * @param prefix - The prefix to remove.
 * @returns The string without the prefix, or null if the prefix is not found.
 */
function prefix_skip(str: string, prefix: string): string | null {
    const len: number = prefix.length;
    return str.startsWith(prefix) ? str.slice(len) : null;
}

/**
 * Compares a string with a prefix.
 *
 * @param str - The string to compare.
 * @param prefix - The prefix to compare against.
 * @returns A negative number if the prefix is less than the string,
 *          a positive number if the prefix is greater than the string,
 *          or 0 if they are equal.
 */
function prefix_cmp(str: string, prefix: string): number {
    for (let i: number = 0; i < str.length && i < prefix.length; i++) {
        if (str[i] !== prefix[i]) {
            return str.charCodeAt(i) - prefix.charCodeAt(i);
        }
    }
    return 0;
}

/**
 * Logs an error message for the given argparse option and exits the process.
 *
 * @param self - The argparse instance.
 * @param opt - The argparse option that caused the error.
 * @param reason - The reason for the error.
 * @param flags - The flags indicating the state of the option.
 * @see argparse
 * @see argparse_option
 */
function argparse_error(self: argparse, opt: argparse_option, reason: string, flags: number): void {
    if (flags & OPT_LONG) {
        Log.e(TAG, `Option \`--${opt.long_name}\` ${reason}`);
    } else {
        Log.e(TAG, `Option \`-${opt.short_name}\` ${reason}`);
    }
    process.exit(1);
}

/**
 * Retrieves the value for the given argparse option based on its type and flags.
 *
 * @param self - The argparse instance.
 * @param opt - The argparse option for which the value is being retrieved.
 * @param flags - The flags indicating the state of the option.
 * @returns The value of the option.
 * @see argparse
 * @see argparse_option
 */
function argparse_getvalue(self: argparse, opt: argparse_option, flags: number): number {
    let s: string | null = null;
    if (!opt.value) return 0;

    switch (opt.type) {
        case argparse_option_type.argparse_OPT_BOOLEAN:
            if (flags & OPT_UNSET) {
                opt.value--;
            } else {
                opt.value++;
            }
            if (opt.value < 0) opt.value = 0;
            break;
        case argparse_option_type.argparse_OPT_BIT:
            if (flags & OPT_UNSET) {
                opt.value &= ~opt.data;
            } else {
                opt.value |= opt.data;
            }
            break;
        case argparse_option_type.argparse_OPT_STRING:
            if (self.optvalue) {
                opt.value = self.optvalue;
                self.optvalue = null;
            } else if (self.argc > 1) {
                self.argc--;
                opt.value = self.argv.shift() as string;
            } else {
                argparse_error(self, opt, "requires a value", flags);
            }
            break;
        case argparse_option_type.argparse_OPT_INTEGER:
            if (self.optvalue) {
                opt.value = parseInt(self.optvalue, 10);
                self.optvalue = null;
            } else if (self.argc > 1) {
                self.argc--;
                opt.value = parseInt(self.argv.shift() as string, 10);
            } else {
                argparse_error(self, opt, "requires a value", flags);
            }
            if (opt.value === Number.POSITIVE_INFINITY || opt.value === Number.NEGATIVE_INFINITY) {
                argparse_error(self, opt, "numerical result out of range", flags);
            }
            if (isNaN(opt.value)) {
                argparse_error(self, opt, "expects an integer value", flags);
            }
            break;
        case argparse_option_type.argparse_OPT_FLOAT:
            if (self.optvalue) {
                opt.value = parseFloat(self.optvalue);
                self.optvalue = null;
            } else if (self.argc > 1) {
                self.argc--;
                opt.value = parseFloat(self.argv.shift() as string);
            } else {
                argparse_error(self, opt, "requires a value", flags);
            }
            if (opt.value === Number.POSITIVE_INFINITY || opt.value === Number.NEGATIVE_INFINITY) {
                argparse_error(self, opt, "numerical result out of range", flags);
            }
            if (isNaN(opt.value)) {
                argparse_error(self, opt, "expects a numerical value", flags);
            }
            break;
        default:
            throw new Error("Invalid option type");
    }

    if (opt.callback) {
        return opt.callback(self, opt);
    }
    return 0;
}

/**
 * Checks the validity of the provided argparse options.
 *
 * @param options - An array of argparse options to be checked.
 * @throws TypeError If an option has an invalid type.
 * @see argparse_option
 */
function argparse_options_check(options: Array<argparse_option>): void {
    options.forEach((option: argparse_option) => {
        switch (option.type) {
            case argparse_option_type.argparse_OPT_END:
            case argparse_option_type.argparse_OPT_BOOLEAN:
            case argparse_option_type.argparse_OPT_BIT:
            case argparse_option_type.argparse_OPT_INTEGER:
            case argparse_option_type.argparse_OPT_FLOAT:
            case argparse_option_type.argparse_OPT_STRING:
            case argparse_option_type.argparse_OPT_GROUP:
                break;
            default:
                throw new TypeError(`wrong option type: ${option.type}`);
        }
    });
}

/**
 * Parses a short option from the command-line arguments.
 *
 * @param self - The argparse instance.
 * @param options - An array of argparse options.
 * @returns The result of parsing the short option.
 * @see argparse
 * @see argparse_option
 */
function argparse_short_opt(self: argparse, options: Array<argparse_option>): number {
    for (const option of options) {
        if (option.type === argparse_option_type.argparse_OPT_END) break;
        if (option.short_name === self.optvalue?.[0]) {
            self.optvalue = self.optvalue.slice(1);
            return argparse_getvalue(self, option, 0);
        }
    }
    return -2;
}

/**
 * Parses a long option from the command-line arguments.
 *
 * @param self - The argparse instance.
 * @param options - An array of argparse options.
 * @returns The result of parsing the long option.
 * @see argparse
 * @see argparse_option
 */
function argparse_long_opt(self: argparse, options: Array<argparse_option>): number {
    for (const option of options) {
        if (option.type === argparse_option_type.argparse_OPT_END) break;
        if (!option.long_name) continue;

        let rest: string | null = prefix_skip(self.argv[0].slice(2), option.long_name);
        if (!rest) {
            if (option.flags & argparse_option_flags.OPT_NONEG) continue;
            if (option.type !== argparse_option_type.argparse_OPT_BOOLEAN &&
                option.type !== argparse_option_type.argparse_OPT_BIT) continue;
            if (!prefix_cmp(self.argv[0].slice(2), "no-")) continue;
            rest = prefix_skip(self.argv[0].slice(5), option.long_name);
            if (!rest) continue;
            option.flags |= OPT_UNSET;
        }

        if (rest[0] === '=') {
            self.optvalue = rest.slice(1);
        }

        return argparse_getvalue(self, option, option.flags | OPT_LONG);
    }
    return -2;
}

/**
 * Initializes the argparse instance with the given options, usages, and flags.
 *
 * @param self - The argparse instance.
 * @param options - An array of argparse options.
 * @param usages - An array of usage strings.
 * @param flags - The flags for the argparse instance.
 * @returns Always returns 0.
 * @see argparse
 * @see argparse_option
 */
function argparse_init(self: argparse, options: Array<argparse_option>, usages: Array<string>, flags: number): number {
    self.options = options;
    self.usages = usages;
    self.flags = flags;
    self.description = null;
    self.epilog = null;
    self.argc = 0;
    self.argv = [];
    self.out = [];
    self.cpidx = 0;
    self.optvalue = null;
    return 0;
}

/**
 * Sets the description and epilog for the argparse instance.
 *
 * @param self - The argparse instance.
 * @param description - The description of the argparse instance.
 * @param epilog - The epilog of the argparse instance.
 * @see argparse
 */
function argparse_describe(self: argparse, description: string, epilog: string): void {
    self.description = description;
    self.epilog = epilog;
}

/**
 * Parses the command-line arguments.
 *
 * @param self - The argparse instance.
 * @param argc - The number of command-line arguments.
 * @param argv - The array of command-line arguments.
 * @returns The number of remaining arguments.
 * @see argparse
 */
function argparse_parse(self: argparse, argc: number, argv: Array<string>): number {
    self.argc = argc - 1;
    self.argv = argv.slice(1);
    self.out = argv;

    argparse_options_check(self.options);

    while (self.argc) {
        const arg: string = self.argv[0];
        if (arg[0] !== '-' || arg.length === 1) {
            if (self.flags & argparse_flag.argparse_STOP_AT_NON_OPTION) break;
            self.out[self.cpidx++] = self.argv.shift() as string;
            self.argc--;
            continue;
        }

        if (arg[1] !== '-') {
            self.optvalue = arg.slice(1);
            while (self.optvalue) {
                const result: number = argparse_short_opt(self, self.options);
                if (result === -2) {
                    Log.e(TAG, `Unknown option \`${arg}\``);
                    argparse_usage(self);
                    if (!(self.flags & argparse_flag.argparse_IGNORE_UNKNOWN_ARGS)) {
                        process.exit(1);
                    }
                }
            }
            continue;
        }

        if (arg === '--') {
            self.argv.shift();
            self.argc--;
            break;
        }

        const result: number = argparse_long_opt(self, self.options);
        if (result === -2) {
            Log.e(TAG, `Unknown option \`${arg}\``);
            argparse_usage(self);
            if (!(self.flags & argparse_flag.argparse_IGNORE_UNKNOWN_ARGS)) {
                process.exit(1);
            }
        }
        continue;
    }

    self.out = self.out.concat(self.argv);
    self.argv = self.out;
    self.argc = self.argv.length;

    return self.argc;
}

/**
 * Displays the usage information for the argparse instance.
 *
 * @param self - The argparse instance.
 * @see argparse
 */
function argparse_usage(self: argparse): void {
    if (self.usages.length) {
        Log.i(TAG, `Usage: ${self.usages.join('\n   or: ')}`);
    } else {
        Log.i(TAG, 'Usage:');
    }

    if (self.description) {
        Log.i(TAG, `${self.description}\n`);
    }

    let usage_opts_width: number = 0;
    for (const option of self.options) {
        let len: number = 0;
        if (option.short_name) len += 2;
        if (option.short_name && option.long_name) len += 2;
        if (option.long_name) len += option.long_name.length + 2;
        if (option.type === argparse_option_type.argparse_OPT_INTEGER) len += 6;
        if (option.type === argparse_option_type.argparse_OPT_FLOAT) len += 6;
        if (option.type === argparse_option_type.argparse_OPT_STRING) len += 6;
        len = (len + 3) & ~3;
        if (usage_opts_width < len) usage_opts_width = len;
    }
    usage_opts_width += 4;

    for (const option of self.options) {
        if (option.type === argparse_option_type.argparse_OPT_GROUP) {
            Log.i(TAG, `\n${option.help}\n`);
            continue;
        }

        let line: string = '    ';
        if (option.short_name) line += `-${option.short_name}`;
        if (option.long_name && option.short_name) line += ', ';
        if (option.long_name) line += `--${option.long_name}`;
        if (option.type === argparse_option_type.argparse_OPT_INTEGER) line += '=int';
        if (option.type === argparse_option_type.argparse_OPT_FLOAT) line += '=flt';
        if (option.type === argparse_option_type.argparse_OPT_STRING) line += '=str';

        const pad: number = usage_opts_width - line.length;
        if (pad > 0) {
            line += ' '.repeat(pad);
        } else {
            Log.i(TAG, line);
            line = ' '.repeat(usage_opts_width);
        }
        Log.i(TAG, `${line}  ${option.help}`);
    }

    if (self.epilog) {
        Log.i(TAG, `\n${self.epilog}`);
    }
}

/**
 * Callback function to display help message without exiting the process.
 *
 * @param self - The argparse instance.
 * @param option - The argparse option triggering the callback.
 * @returns Always returns 0.
 * @see argparse
 * @see argparse_option
 */
function argparse_help_cb_no_exit(self: argparse, option: argparse_option): number {
    argparse_usage(self);
    return 0;
}

/**
 * Callback function to display help message and exit the process.
 *
 * @param self - The argparse instance.
 * @param option - The argparse option triggering the callback.
 * @see argparse
 * @see argparse_option
 */
function argparse_help_cb(self: argparse, option: argparse_option): void {
    argparse_usage(self);
    process.exit(0);
}

export {
    prefix_skip,
    prefix_cmp,
    argparse_error,
    argparse_getvalue,
    argparse_options_check,
    argparse_short_opt,
    argparse_long_opt,
    argparse_init,
    argparse_describe,
    argparse_parse,
    argparse_usage,
    argparse_help_cb_no_exit,
    argparse_help_cb
}
