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
/**
 * Callback type for argparse options.
 *
 * @param self - The argparse instance.
 * @param option - The argparse option being processed.
 * @returns A number indicating the result of the callback.
 * @see argparse
 * @see argparse_option
 */
export type argparse_callback = (self: argparse, option: argparse_option) => number;
/**
 * Enum for argparse flags.
 *
 * - `argparse_STOP_AT_NON_OPTION`: Stops parsing at the first non-option argument.
 * - `argparse_IGNORE_UNKNOWN_ARGS`: Ignores unknown arguments.
 */
export declare enum argparse_flag {
    argparse_STOP_AT_NON_OPTION = 1,
    argparse_IGNORE_UNKNOWN_ARGS = 2
}
/**
 * Enum for argparse option types.
 *
 * - `argparse_OPT_END`: Marks the end of the options array.
 * - `argparse_OPT_GROUP`: Groups related options together.
 * - `argparse_OPT_BOOLEAN`: Represents a boolean option.
 * - `argparse_OPT_BIT`: Represents a bit option.
 * - `argparse_OPT_INTEGER`: Represents an integer option.
 * - `argparse_OPT_FLOAT`: Represents a float option.
 * - `argparse_OPT_STRING`: Represents a string option.
 */
export declare enum argparse_option_type {
    argparse_OPT_END = 0,
    argparse_OPT_GROUP = 1,
    argparse_OPT_BOOLEAN = 2,
    argparse_OPT_BIT = 3,
    argparse_OPT_INTEGER = 4,
    argparse_OPT_FLOAT = 5,
    argparse_OPT_STRING = 6
}
export declare enum argparse_option_flags {
    OPT_NONEG = 1
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
/**
 * Type representing the `argparse` structure.
 *
 * @property options - Array of argparse options.
 * @property usages - Array of usage strings.
 * @property flags - Flags for argparse behavior.
 * @property description - Description after usage.
 * @property epilog - Description at the end.
 * @property argc - Internal context for argument count.
 * @property argv - Array of argument strings.
 * @property out - Array of output strings.
 * @property cpidx - Current parsing index.
 * @property optvalue - Current option value.
 */
export type argparse = {
    options: argparse_option[];
    usages: Array<string>;
    flags: number;
    description: string | null;
    epilog: string | null;
    argc: number;
    argv: Array<string>;
    out: Array<string>;
    cpidx: number;
    optvalue: string | null;
};
/**
 * Callback type for displaying help in argparse.
 *
 * @param this - The argparse instance.
 * @param option - The argparse option being processed.
 * @returns A number indicating the result of the callback.
 * @see argparse
 * @see argparse_option
 */
export type argparse_help_cb = (this: argparse, option: argparse_option) => number;
/**
 * Callback type for displaying help in argparse without exiting.
 *
 * @param this - The argparse instance.
 * @param option - The argparse option being processed.
 * @returns A number indicating the result of the callback.
 * @see argparse
 * @see argparse_option
 */
export type argparse_help_cb_no_exit = (this: argparse, option: argparse_option) => number;
/**
 * Creates an `argparse` option that marks the end of the options array.
 *
 * @returns An `argparse` option of type `argparse_OPT_END`.
 * @see argparse_option
 */
export declare function OPT_END(): argparse_option;
/**
 * Creates an `argparse` option for a boolean value.
 *
 * @param short_name - The character to use as a short option name.
 * @param long_name - The long option name, without the leading dash, or null if none.
 * @param value - Stores pointer to the value to be filled.
 * @param help - The short help message associated with what the option does.
 * @param callback - Function called when the corresponding argument is parsed.
 * @param data - Associated data that callbacks can use as they want.
 * @param flags - Option flags.
 * @returns An `argparse` option of type `argparse_OPT_BOOLEAN`.
 * @see argparse_callback
 * @see argparse_option
 */
export declare function OPT_BOOLEAN(short_name: string, long_name: string | null, value: any, help: string, callback: argparse_callback | null, data: any, flags: number): argparse_option;
/**
 * Creates an `argparse` option for a bit value.
 *
 * @param short_name - The character to use as a short option name.
 * @param long_name - The long option name, without the leading dash,
 * or null if none.
 * @param value - Stores pointer to the value to be filled.
 * @param help - The short help message associated with what the option does.
 * @param callback - Function called when the corresponding argument is parsed.
 * @param data - Associated data that callbacks can use as they want.
 * @param flags - Option flags.
 * @returns An `argparse` option of type `argparse_OPT_BIT`.
 * @see argparse_callback
 * @see argparse_option
 */
export declare function OPT_BIT(short_name: string, long_name: string | null, value: any, help: string, callback: argparse_callback | null, data: any, flags: number): argparse_option;
/**
 * Creates an `argparse` option for an integer value.
 *
 * @param short_name - The character to use as a short option name.
 * @param long_name - The long option name, without the leading dash,
 * or null if none.
 * @param value - Stores pointer to the value to be filled.
 * @param help - The short help message associated with what the option does.
 * @param callback - Function called when the corresponding argument is parsed.
 * @param data - Associated data that callbacks can use as they want.
 * @param flags - Option flags.
 * @returns An `argparse` option of type `argparse_OPT_INTEGER`.
 * @see argparse_callback
 * @see argparse_option
 */
export declare function OPT_INTEGER(short_name: string, long_name: string | null, value: any, help: string, callback: argparse_callback | null, data: any, flags: number): argparse_option;
/**
 * Creates an `argparse` option for a float value.
 *
 * @param short_name - The character to use as a short option name.
 * @param long_name - The long option name, without the leading dash,
 * or null if none.
 * @param value - Stores pointer to the value to be filled.
 * @param help - The short help message associated with what the option does.
 * @param callback - Function called when the corresponding argument is parsed.
 * @param data - Associated data that callbacks can use as they want.
 * @param flags - Option flags.
 * @returns An `argparse` option of type `argparse_OPT_FLOAT`.
 * @see argparse_callback
 * @see argparse_option
 */
export declare function OPT_FLOAT(short_name: string, long_name: string | null, value: any, help: string, callback: argparse_callback | null, data: any, flags: number): argparse_option;
/**
 * Creates an `argparse` option for a string value.
 *
 * @param short_name - The character to use as a short option name.
 * @param long_name - The long option name, without the leading dash,
 * or null if none.
 * @param value - Stores pointer to the value to be filled.
 * @param help - The short help message associated with what the option does.
 * @param callback - Function called when the corresponding argument is parsed.
 * @param data - Associated data that callbacks can use as they want.
 * @param flags - Option flags.
 * @returns An `argparse` option of type `argparse_OPT_STRING`.
 * @see argparse_callback
 * @see argparse_option
 */
export declare function OPT_STRING(short_name: string, long_name: string | null, value: any, help: string, callback: argparse_callback | null, data: any, flags: number): argparse_option;
/**
 * Creates an `argparse` option that groups related options together.
 *
 * @param help - The short help message associated with the group.
 * @returns An `argparse` option of type `argparse_OPT_GROUP`.
 * @see argparse_option
 */
export declare function OPT_GROUP(help: string): argparse_option;
/**
 * Creates an `argparse` option for displaying help.
 *
 * @returns An `argparse` option of type `argparse_OPT_BOOLEAN`
 * for help.
 * @see argparse_option
 */
export declare function OPT_HELP(): argparse_option;
/**
 * Initializes the `argparse` instance with the given options, usages, and flags.
 *
 * @param this - The `argparse` instance.
 * @param options - Array of argparse options.
 * @param usages - Array of usage strings.
 * @param flags - Flags for argparse behavior.
 * @see argparse
 * @see argparse_option
 */
export type argparse_init = (this: argparse, options: Array<argparse_option>, usages: Array<string>, flags: number) => void;
/**
 * Describes the `argparse` instance with a description and an epilog.
 *
 * @param this - The `argparse` instance.
 * @param description - The description after usage.
 * @param epilog - The description at the end.
 * @see argparse
 */
export type argparse_describe = (this: argparse, description: string, epilog: string) => void;
/**
 * Parses the command-line arguments.
 *
 * @param this - The `argparse` instance.
 * @param argc - The number of arguments.
 * @param argv - The array of argument strings.
 * @see argparse
 */
export type argparse_parse = (this: argparse, argc: number, argv: Array<string>) => void;
/**
 * Displays the usage information for the `argparse` instance.
 *
 * @param this - The `argparse` instance.
 * @see argparse
 */
export type argparse_usage = (this: argparse) => void;
