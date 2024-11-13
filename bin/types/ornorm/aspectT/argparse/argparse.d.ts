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
import { argparse, argparse_option } from '@ornorm/aspectT/argparse';
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
declare function argparse_init(self: argparse, options: Array<argparse_option>, usages: Array<string>, flags: number): number;
/**
 * Sets the description and epilog for the argparse instance.
 *
 * @param self - The argparse instance.
 * @param description - The description of the argparse instance.
 * @param epilog - The epilog of the argparse instance.
 * @see argparse
 */
declare function argparse_describe(self: argparse, description: string, epilog: string): void;
/**
 * Parses the command-line arguments.
 *
 * @param self - The argparse instance.
 * @param argc - The number of command-line arguments.
 * @param argv - The array of command-line arguments.
 * @returns The number of remaining arguments.
 * @see argparse
 */
declare function argparse_parse(self: argparse, argc: number, argv: Array<string>): number;
/**
 * Displays the usage information for the argparse instance.
 *
 * @param self - The argparse instance.
 * @see argparse
 */
declare function argparse_usage(self: argparse): void;
/**
 * Callback function to display help message without exiting the process.
 *
 * @param self - The argparse instance.
 * @param option - The argparse option triggering the callback.
 * @returns Always returns 0.
 * @see argparse
 * @see argparse_option
 */
declare function argparse_help_cb_no_exit(self: argparse, option: argparse_option): number;
/**
 * Callback function to display help message and exit the process.
 *
 * @param self - The argparse instance.
 * @param option - The argparse option triggering the callback.
 * @see argparse
 * @see argparse_option
 */
declare function argparse_help_cb(self: argparse, option: argparse_option): void;
export { argparse_init, argparse_describe, argparse_parse, argparse_usage, argparse_help_cb_no_exit, argparse_help_cb };
