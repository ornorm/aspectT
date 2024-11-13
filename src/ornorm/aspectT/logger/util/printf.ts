import {FileWritableStream, getenv_int} from '@ornorm/aspectT';
import {statSync, writeFileSync, WriteStream} from 'fs';
import {exit, stdout} from 'process';

/**
 * Exit status for syntax errors, etc.
 */
export const EXIT_FAILURE: number = 1;
/**
 * Exit status for successful execution.
 */
export const EXIT_SUCCESS: number = 0;

/**
 * The official name of this program (e.g., no 'g' prefix).
 */
const PROGRAM_NAME: string = 'printf';
/**
 * The author of this program.
 */
const AUTHORS: Array<string> = ['Aimé Biendo'];
/**
 * The description of the help option.
 */
const HELP_OPTION_DESCRIPTION: string = `Help option description here`;
/**
 * The description of the version option.
 */
const VERSION_OPTION_DESCRIPTION: string = `Version option description here`;
/**
 * The warning message for the usage builtin.
 */
const USAGE_BUILTIN_WARNING: string = `Usage builtin warning here`;

/**
 * Interface representing the context for the `printf` function.
 */
export interface print_context {
    /**
     * The buffer to store the formatted output.
     *
     * Can be a string, an array of strings, or a Buffer.
     * @see Buffer
     */
    buffer?: string | Array<string> | Buffer;
    /**
     * The number of characters written so far.
     *
     * This property keeps track of the total number of characters that have been
     * written to the output stream or buffer. It is used to ensure that the
     * correct number of characters are counted and returned by the printf-like
     * functions.
     */
    char_count: number;
    /**
     * The current position of the cursor in the format string.
     *
     * This property keeps track of the current position of the cursor within the
     * format string being processed. It is used to correctly parse and replace
     * format specifiers in the format string.
     */
    cursor_position: number;
    /**
     * The error number or exception.
     */
    errno?: Error | NodeJS.ErrnoException;
    /**
     * Warning message for ignored characters.
     */
    cfcc_msg?: string;
    /**
     * The value to return to the calling program.
     */
    exit_status?: number;
    /**
     * The file to write the formatted output to.
     * Can be a file path, a file descriptor, or a `FileWritableStream`.
     * @see FileWritableStream
     */
    file?: string | number | FileWritableStream;
    /**
     * The format string to use.
     */
    format?: string;
    /**
     * The current index of the parameter being processed.
     *
     * This property is used to keep track of the index of the parameter
     * currently being processed in the format string. It is incremented
     * as each parameter is processed.
     */
    param_index: number;
    /**
     * The parameters to use in the format string.
     */
    params?: Array<any>;
    /**
     * True if the `POSIXLY_CORRECT` environment variable is set.
     */
    posixly_correct?: boolean;
    /**
     * The name of the program.
     */
    program_name?: string;
    /**
     * The proper name of the program.
     */
    proper_name?: Array<string>;
    /**
     * The standard error stream.
     * @see NodeJS.WriteStream
     */
    stderr?: NodeJS.WriteStream & { fd: 1 };
    /**
     * The standard output stream.
     * @see NodeJS.WriteStream
     */
    stdout?: NodeJS.WriteStream & { fd: 1 };
    /**
     * A writable stream.
     * @see WriteStream
     * @see FileWritableStream
     */
    stream?: WriteStream | FileWritableStream;
}

/**
 * Creates and returns a default context for the `printf` function.
 *
 * @param context - The context to use as a base.
 * @returns The new `printf` context.
 * @see print_context
 */
function get_print_context(context?: Partial<print_context>): print_context {
    return {
        buffer: [],
        cfcc_msg: 'warning: %s: character(s) following character constant have been ignored',
        char_count: 0,
        cursor_position: 0,
        exit_status: 0,
        format: '',
        param_index: 0,
        params: [],
        posixly_correct: getenv_int('POSIXLY_CORRECT', 0) === 1,
        program_name: PROGRAM_NAME,
        proper_name: AUTHORS,
        stderr: stdout,
        stdout: stdout,
        ...(context || {})
    };
}

/**
 * Emits ancillary information for the given program name.
 *
 * @param this - The context for the `printf` function.
 * @param programName - The name of the program for which to emit
 * ancillary information.
 * @returns The number of characters written.
 * @see print_context
 */
function emit_ancillary_info(this: print_context, programName: string): number {
    this.format = `Ancillary info for %s\n`;
    this.params = [programName];
    this.stdout = stdout;
    return print_out(this);
}

/**
 * Emits a message suggesting the user try the help option.
 *
 * @param this - The context for the `printf` function.
 * @returns The number of characters written.
 * @see print_context
 */
function emit_try_help(this: print_context): number {
    this.format = `Try '%s --help' for more information.\n`;
    this.params = [];
    this.stdout = stdout;
    return print_out(this);
}

/**
 * Writes a string to the standard output stream.
 *
 * @param this - The context for the `printf` function.
 * @param s - The string to write.
 * @returns The number of characters written.
 * @see print_context
 */
function fputs(this: print_context, s: string): number {
    this.format = s;
    this.params = [];
    this.stdout = stdout;
    return print_out(this);
}

/**
 * Displays the manual information for the program and exits with the given status.
 *
 * @param status - The exit status code. If non-zero, the manual information
 * is displayed and the program suggests trying the help option.
 *
 * If zero, detailed manual information is displayed.
 */
function print_man(status: number): void {
    const context: print_context = get_print_context();
    if (status !== EXIT_SUCCESS) {
        emit_try_help.call(context);
    } else {
        printf.call(context, `%s — manual\n\n`, PROGRAM_NAME);
        printf.call(context, `NAME\n\n`);
        printf.call(context, `\tprintf, fprintf, sprintf\n`);
        printf.call(context, `LIBRARY\n\n`);
        printf.call(context, `\tAspectT library\n\n`);
        printf.call(context, `SYNOPSIS\n\n`);
        printf.call(context, `\timport { printf, fprintf, sprintf } from '@ornorm/aspectT';\n\n`);
        printf.call(context, `\tfunction printf(this: print_context, format: string, ...params: Array<any>): number;\n`);
        printf.call(context, `\tfunction fprintf(this: print_context, file: string | number | FileWritableStream, format: string, ...params: Array<any>): number;\n`);
        printf.call(context, `\tfunction sprintf(this: print_context, buffer: string | Array<string> | Buffer, format: string, ...params: Array<any>): number;\n\n`);
        fputs.call(context, `This program supports the following format specifiers:\n\n`);
        conversion_specifiers.forEach((specifier: conversion_specifier) => {
            printf.call(context, `Specifier: %s\n`, specifier.specifier);
            printf.call(context, `Description: %s\n`, specifier.explanation);
            printf.call(context, `Expected Argument Type: %s\n`, specifier.expectedArgumentType);
            printf.call(context, `Length Modifier: %s\n\n`, specifier.lengthModifier);
        });
        emit_ancillary_info.call(context, PROGRAM_NAME);
    }
    exit(status);
}

/**
 * Displays the usage information for the program and exits with the given
 * status.
 *
 * @param status - The exit status code. If non-zero, the usage information
 * is displayed and the program suggests trying the help option.
 *
 * If zero, detailed usage information is displayed.
 */
function print_usage(status: number): void {
    const context: print_context = get_print_context();
    if (status !== EXIT_SUCCESS) {
        emit_try_help.call(context);
    } else {
        printf.call(context, `Usage: %s FORMAT [ARGUMENT]...\n  or:  %s OPTION\n`, PROGRAM_NAME, PROGRAM_NAME);
        fputs.call(context, `Print ARGUMENT(s) according to FORMAT, or execute according to OPTION:\n`);
        fputs.call(context, HELP_OPTION_DESCRIPTION);
        fputs.call(context, VERSION_OPTION_DESCRIPTION);
        fputs.call(context, `FORMAT controls the output as in C printf. Interpreted sequences are:\n`);
        fputs.call(context, `  \\\"      double quote\n  \\\\      backslash\n  \\a      alert (BEL)\n  \\b      backspace\n  \\c      produce no further output\n  \\e      escape\n  \\f      form feed\n  \\n      new line\n  \\r      carriage return\n  \\t      horizontal tab\n  \\v      vertical tab\n`);
        fputs.call(context, `  \\NNN    byte with octal value NNN (1 to 3 digits)\n  \\xHH    byte with hexadecimal value HH (1 to 2 digits)\n  \\uHHHH  Unicode (ISO/IEC 10646) character with hex value HHHH (4 digits)\n  \\UHHHHHHHH  Unicode character with hex value HHHHHHHH (8 digits)\n`);
        fputs.call(context, `  %%      a single %\n  %b      ARGUMENT as a string with '\\' escapes interpreted,\n          except that octal escapes should have a leading 0 like \\0NNN\n  %q      ARGUMENT is printed in a format that can be reused as shell input,\n          escaping non-printable characters with the POSIX $'' syntax\n`);
        fputs.call(context, `and all C format specifications ending with one of diouxXfeEgGcs, with\nARGUMENTs converted to proper type first. Variable widths are handled.\n`);
        printf.call(context, USAGE_BUILTIN_WARNING, PROGRAM_NAME);
        emit_ancillary_info.call(context, PROGRAM_NAME);
    }
    exit(status);
}

/**
 * Verifies if the given string `s` is numeric and checks for conversion errors.
 *
 * @param this - The context for the `printf` function.
 * @param s - The string to verify.
 * @param end - The remaining part of the string after conversion.
 * @see print_context
 */
function verify_numeric(this: print_context, s: string, end: string): void {
    if (this.errno) {
        error.call(this, 0, this.errno, '%s', s);
        this.exit_status = 1;
    } else if (end.length > 0) {
        if (s === end) {
            error.call(this, 0, null, '%s: expected a numeric value', s);
        } else {
            error.call(this, 0, null, '%s: value not completely converted', s);
        }
        this.exit_status = 1;
    }
}

/**
 * Type definition for a printf modifier function.
 *
 * @param value The value to be formatted.
 * @param [flags] Optional flags for formatting.
 * @param [width] Optional width for formatting.
 * @param [precision] Optional precision for formatting.
 * @returns The formatted string.
 */
export type conversion_function = (value: any, flags?: string, width?: number, precision?: number, charCount?: number) => string;

/**
 * Map of format string encoded as a template language consisting of
 * verbatim text and format specifiers that each specify how to serialize
 * a value.
 * @see conversion_function
 */
const conversion_functions: Record<string, conversion_function> = {
    '%s': (value: string, flags?: string, width?: number) => pad_string(String(value), flags, width),
    '%d': (value: number, flags?: string, width?: number) => pad_string(Number(value).toFixed(0), flags, width),
    '%i': (value: number, flags?: string, width?: number) => pad_string(parseInt(value.toString(), 10).toString(), flags, width),
    '%u': (value: number, flags?: string, width?: number) => pad_string((value >>> 0).toString(), flags, width),
    '%f': (value: number, flags?: string, width?: number, precision?: number) => pad_string(Number(value).toFixed(precision ?? 6), flags, width),
    '%x': (value: number, flags?: string, width?: number) => pad_string(Number(value).toString(16), flags, width),
    '%X': (value: number, flags?: string, width?: number) => pad_string(Number(value).toString(16).toUpperCase(), flags, width),
    '%o': (value: number, flags?: string, width?: number) => pad_string(Number(value).toString(8), flags, width),
    '%c': (value: number, flags?: string, width?: number) => pad_string(String.fromCharCode(value), flags, width),
    '%p': (value: any, flags?: string, width?: number) => pad_string(`0x${Number(value).toString(16)}`, flags, width),
    '%e': (value: number, flags?: string, width?: number, precision?: number) => pad_string(Number(value).toExponential(precision ?? 6), flags, width),
    '%E': (value: number, flags?: string, width?: number, precision?: number) => pad_string(Number(value).toExponential(precision ?? 6).toUpperCase(), flags, width),
    '%g': (value: number, flags?: string, width?: number, precision?: number) => pad_string(Number(value).toPrecision(precision ?? 6), flags, width),
    '%G': (value: number, flags?: string, width?: number, precision?: number) => pad_string(Number(value).toPrecision(precision ?? 6).toUpperCase(), flags, width),
    '%a': (value: number, flags?: string, width?: number, precision?: number) => pad_string(Number(value).toString(16), flags, width),
    '%A': (value: number, flags?: string, width?: number, precision?: number) => pad_string(Number(value).toString(16).toUpperCase(), flags, width),
    '%n': (value: any, flags?: string, width?: number, precision?: number, charCount?: number) => {
        if (typeof value === 'object' && value !== null && 'set' in value) {
            value.set(charCount);
        }
        return '';
    },
    '%%': () => '%'
};

/**
 * Array of keys representing numeric conversion functions.
 * @see conversion_functions
 */
const numeric_functions: Array<string> = Object.keys(conversion_functions).filter((key: string) =>
    ['%d', '%i', '%u', '%f', '%x', '%X', '%o', '%e', '%E', '%g', '%G', '%a', '%A'].includes(key)
);

/**
 * Interface representing a conversion specifier for the printf function.
 */
export interface conversion_specifier {
    /**
     * The format specifier character (e.g., 'd', 's', 'x').
     */
    specifier: string;
    /**
     * A description of what the specifier does.
     */
    explanation: string;
    /**
     * The expected type of the argument for this specifier.
     */
    expectedArgumentType: string;
    /**
     * The length modifier for the specifier (e.g., 'l', 'h').
     */
    lengthModifier: string;
}

/**
 * Array of conversion specifiers for the `printf` function.
 * @see conversion_specifier
 */
const conversion_specifiers: Array<conversion_specifier> = [
    {
        specifier: '%',
        explanation: 'Writes literal %. The full conversion specification must be %%.',
        expectedArgumentType: 'N/A',
        lengthModifier: 'N/A'
    },
    {
        specifier: 'c',
        explanation: 'Writes a single character. The argument is first converted to unsigned char. If the l modifier is used, the argument is first converted to a character string as if by %ls with a wchar_t[2] argument.',
        expectedArgumentType: 'int, wint_t',
        lengthModifier: 'N/A'
    },
    {
        specifier: 's',
        explanation: 'Writes a character string. The argument must be a pointer to the initial element of an array of characters. Precision specifies the maximum number of bytes to be written. If Precision is not specified, writes every byte up to and not including the first null terminator. If the l specifier is used, the argument must be a pointer to the initial element of an array of wchar_t, which is converted to char array as if by a call to wcrtomb with zero-initialized conversion state.',
        expectedArgumentType: 'char*, wchar_t*',
        lengthModifier: 'N/A'
    },
    {
        specifier: 'd, i',
        explanation: 'Converts a signed integer into decimal representation [-]dddd. Precision specifies the minimum number of digits to appear. The default precision is 1. If both the converted value and the precision are ​0​ the conversion results in no characters.',
        expectedArgumentType: 'signed char, short, int, long, long long, intmax_t, signed size_t, ptrdiff_t',
        lengthModifier: 'hh, h, (none), l, ll, j, z, t'
    },
    {
        specifier: 'o',
        explanation: 'Converts an unsigned integer into octal representation oooo. Precision specifies the minimum number of digits to appear. The default precision is 1. If both the converted value and the precision are ​0​ the conversion results in no characters. In the alternative implementation precision is increased if necessary, to write one leading zero. In that case if both the converted value and the precision are ​0​, single ​0​ is written.',
        expectedArgumentType: 'unsigned char, unsigned short, unsigned int, unsigned long, unsigned long long, uintmax_t, size_t, unsigned version of ptrdiff_t',
        lengthModifier: 'hh, h, (none), l, ll, j, z, t'
    },
    {
        specifier: 'x, X',
        explanation: 'Converts an unsigned integer into hexadecimal representation hhhh. For the x conversion letters abcdef are used. For the X conversion letters ABCDEF are used. Precision specifies the minimum number of digits to appear. The default precision is 1. If both the converted value and the precision are ​0​ the conversion results in no characters. In the alternative implementation 0x or 0X is prefixed to results if the converted value is nonzero.',
        expectedArgumentType: 'unsigned char, unsigned short, unsigned int, unsigned long, unsigned long long, uintmax_t, size_t, unsigned version of ptrdiff_t',
        lengthModifier: 'hh, h, (none), l, ll, j, z, t'
    },
    {
        specifier: 'u',
        explanation: 'Converts an unsigned integer into decimal representation dddd. Precision specifies the minimum number of digits to appear. The default precision is 1. If both the converted value and the precision are ​0​ the conversion results in no characters.',
        expectedArgumentType: 'unsigned char, unsigned short, unsigned int, unsigned long, unsigned long long, uintmax_t, size_t, unsigned version of ptrdiff_t',
        lengthModifier: 'hh, h, (none), l, ll, j, z, t'
    },
    {
        specifier: 'f, F',
        explanation: 'Converts floating-point number to the decimal notation in the style [-]ddd.ddd. Precision specifies the exact number of digits to appear after the decimal point character. The default precision is 6. In the alternative implementation decimal point character is written even if no digits follow it. For infinity and not-a-number conversion style see notes.',
        expectedArgumentType: 'double, long double',
        lengthModifier: 'N/A'
    },
    {
        specifier: 'e, E',
        explanation: 'Converts floating-point number to the decimal exponent notation. For the e conversion style [-]d.ddde±dd is used. For the E conversion style [-]d.dddE±dd is used. The exponent contains at least two digits, more digits are used only if necessary. If the value is ​0​, the exponent is also ​0​. Precision specifies the exact number of digits to appear after the decimal point character. The default precision is 6. In the alternative implementation decimal point character is written even if no digits follow it. For infinity and not-a-number conversion style see notes.',
        expectedArgumentType: 'double, long double',
        lengthModifier: 'N/A'
    },
    {
        specifier: 'a, A',
        explanation: 'Converts floating-point number to the hexadecimal exponent notation. For the a conversion style [-]0xh.hhhp±d is used. For the A conversion style [-]0Xh.hhhP±d is used. The first hexadecimal digit is not 0 if the argument is a normalized floating-point value. If the value is ​0​, the exponent is also ​0​. Precision specifies the exact number of digits to appear after the hexadecimal point character. The default precision is sufficient for exact representation of the value. In the alternative implementation decimal point character is written even if no digits follow it. For infinity and not-a-number conversion style see notes.',
        expectedArgumentType: 'double, long double',
        lengthModifier: 'N/A'
    },
    {
        specifier: 'g, G',
        explanation: 'Converts floating-point number to decimal or decimal exponent notation depending on the value and the precision. For the g conversion style conversion with style e or f will be performed. For the G conversion style conversion with style E or F will be performed. Let P equal the precision if nonzero, 6 if the precision is not specified, or 1 if the precision is ​0​. Then, if a conversion with style E would have an exponent of X: if P > X ≥ −4, the conversion is with style f or F and precision P − 1 − X. otherwise, the conversion is with style e or E and precision P − 1. Unless alternative representation is requested the trailing zeros are removed, also the decimal point character is removed if no fractional part is left. For infinity and not-a-number conversion style see notes.',
        expectedArgumentType: 'double, long double',
        lengthModifier: 'N/A'
    },
    {
        specifier: 'n',
        explanation: 'Returns the number of characters written so far by this call to the function. The result is written to the value pointed to by the argument. The specification may not contain any flag, field width, or precision.',
        expectedArgumentType: 'signed char*, short*, int*, long*, long long*, intmax_t*, signed size_t*, ptrdiff_t*',
        lengthModifier: 'N/A'
    },
    {
        specifier: 'p',
        explanation: 'Writes an implementation defined character sequence defining a pointer.',
        expectedArgumentType: 'void*',
        lengthModifier: 'N/A'
    }
];

/**
 * Retrieves the printf modifier function corresponding to the given token.
 *
 * @param token The format specifier token.
 * @returns The corresponding printf modifier function, or undefined if
 * not found.
 * @see conversion_function
 */
function str_to_expression(token: string): conversion_function | undefined {
    return Reflect.get(conversion_functions, `%${token}`)
}

/**
 * Pads a string to a specified width with optional flags.
 *
 * @param value The string value to be padded.
 * @param [flags] Optional flags for padding. `0` for zero-padding, `-` for left-align.
 * @param [width] Optional width for the padded string.
 * @returns The padded string.
 */
function pad_string(value: string, flags?: string, width?: number): string {
    if (!width) {
        return value;
    }
    const paddingChar: string = flags?.includes('0') ? '0' : ' ';
    const leftAlign: boolean | undefined = flags?.includes('-');
    if (leftAlign) {
        return value.padEnd(width, paddingChar);
    }
    return value.padStart(width, paddingChar);
}

/**
 * Logs an error message to the standard error stream and exits the
 * process if the status is non-zero.
 *
 * @param status - The exit status code. If non-zero, the process will
 * exit with this status.
 * @param err - The error object, if any. If provided, its message will be
 * included in the formatted message.
 * @param message - The message to log. This can include format
 * specifiers.
 * @param params - Additional parameters to be used in the formatted
 * message.
 * @see ErrnoException
 */
function error(
    this: print_context,
    status: number,
    err: Error | NodeJS.ErrnoException | null,
    message: string,
    ...params: Array<any>
): void {
    const formattedMessage: string = print_format.call(this, err ? err.message : message, ...params);
    this?.stderr?.write(`${formattedMessage}\n`);
    if (status !== 0) {
        exit(status);
    }
}

function handleLengthModifier(length: string, value: any): any {
    switch (length) {
        case 'h':
            // short
            return Number(value) & 0xFFFF;
        case 'hh':
            // char
            return Number(value) & 0xFF;
        case 'l':
        case 'll':
        case 'j':
        case 'I64':
        case 'q':
            // long, long long, intmax_t, 64-bit int
            return BigInt(value);
        case 'L':
        case 'z':
        case 't':
        case 'I32':
            // long double (treated as double in JS), size_t, ptrdiff_t, 32-bit int
            return Number(value);
        default:
            return value;
    }
}

/**
 * A standard library function that formats text and writes it to standard
 * output.
 *
 * These functions accept a format string parameter and a variable number
 * of value parameters that the function serializes per the format string
 * and return teh formatted string.
 *
 * The format string is encoded as a template language consisting of
 * verbatim text and format specifiers that each specify how to serialize
 * a value.
 *
 * As the format string is processed left-to-right, a subsequent value is
 * used for each format specifier found.
 *
 * A format specifier starts with a `%` character and has one or more
 * following characters that specify how to serialize a value.
 *
 * The format string syntax and semantics is the same for all of the
 * functions in the printf-like family.
 *
 * **Format specifier**
 *
 * Formatting a value is specified as markup in the format string.
 *
 * - **Syntax**
 *
 * The syntax for a format specifier is:
 *
 * ```plaintext
 * %[parameter][flags][width][.precision][length]type
 * ```
 *
 * - **Parameter field**
 *
 * The parameter field is optional.
 *
 * If included, then matching specifiers to values is not sequential.
 *
 * The numeric value, `n`, selects the nth value parameter.
 *
 * | Character | Description                                                                 |
 * |-----------|-----------------------------------------------------------------------------|
 * | n$        | n is the index of the value parameter to serialize using this format specifier |
 *
 * This field allows for using the same value multiple times in a format
 * string instead of having to pass the value multiple times.
 *
 * If a specifier includes this field, then subsequent specifiers must also.
 *
 * ```plaintext
 * print_format("%2$d %2$#x; %1$d %1$#x",16,17)
 * ```
 * Output:  `17 0x11; 16 0x10`
 *
 * This field is particularly useful for localizing messages to different natural
 * languages that often use different word order.
 *
 * - **Flags field**
 *
 * The flags field can be zero or more of (in any order):
 *
 * | Character | Description                                                                 |
 * |-----------|-----------------------------------------------------------------------------|
 * | -         | Left-align the output of this placeholder. (The default is to right-align the output.) |
 * | +         | Prepends a plus for positive signed-numeric types. positive = +, negative = -. (The default does not prepend anything in front of positive numbers.) |
 * | (space)   | Prepends a space for positive signed-numeric types. positive =  , negative = -. This flag is ignored if the + flag exists. (The default does not prepend anything in front of positive numbers.) |
 * | 0         | When the 'width' option is specified, prepends zeros for numeric types. (The default prepends spaces.) For example, printf("%4X",3) produces    3, while printf("%04X",3) produces 0003. |
 * | '         | The integer or exponent of a decimal has the thousands grouping separator applied. |
 * | #         | Alternate form: For g and G types, trailing zeros are not removed. For f, F, e, E, g, G types, the output always contains a decimal point. For o, x, X types, the text 0, 0x, 0X, respectively, is prepended to non-zero numbers. |
 *
 *
 * - **Width field**
 *
 * The width field specifies the minimum number of characters to output.
 *
 * If the value can be represented in fewer characters, then the value is
 * left-padded with spaces so that output is the number of characters specified.
 *
 * If the value requires more characters, then the output is longer than the
 * specified width.
 *
 * A value is never truncated.
 *
 * For example, `print_format("%3d", 12)` specifies a width of 3 and outputs  12
 * with a space on the left to output 3 characters.
 *
 * The call `print_format("%3d", 1234)` outputs 1234 which is 4 characters long
 * since that is the minimum width for that value even though the width
 * specified is 3.
 *
 * If the width field is omitted, the output is the minimum number of
 * characters for the value.
 *
 * If the field is specified as `*`, hen the width value is read from the list
 * of values in the call.
 *
 * For example, `print_format("%*d", 3, 10)` outputs  `10` where the second
 * parameter, `3`, is the width (matches with `*`) and `10` is the value
 * to serialize (matches with `d).
 *
 * Though not part of the width field, a leading zero is interpreted as the
 * zero-padding flag mentioned above, and a negative value is treated
 * as the positive value in conjunction with the left-alignment `-` flag also
 * mentioned above.
 *
 * The width field can be used to format values as a table (tabulated output).
 *
 * But, columns do not align if any value is larger than fits in the width specified.
 *
 * - **Precision field**
 *
 * The precision field usually specifies a maximum limit of the output,
 * depending on the particular formatting type.
 *
 * For floating-point numeric types, it specifies the number of digits to
 * the right of the decimal point that the output should be rounded.
 *
 * For the string type, it limits the number of characters that should be
 * output, after which the string is truncated.
 *
 * The precision field may be omitted, or a numeric integer value, or a
 * dynamic value when passed as another argument when indicated by
 * an asterisk `*`.
 *
 * For example, `print_format("%.*s", 3, "abcdef")` outputs `abc`.
 *
 * - **Length field**
 *
 * The length field can be omitted or be any of:
 *
 * | Character | Description                                                                 |
 * |-----------|-----------------------------------------------------------------------------|
 * | hh        | For integer types, causes printf to expect an int-sized integer argument which was promoted from a char. |
 * | h         | For integer types, causes printf to expect an int-sized integer argument which was promoted from a short. |
 * | l         | For integer types, causes printf to expect a long-sized integer argument. For floating-point types, this is ignored. float arguments are always promoted to double when used in a varargs call. |
 * | ll        | For integer types, causes printf to expect a long long-sized integer argument. |
 * | L         | For floating-point types, causes printf to expect a long double argument. |
 * | z         | For integer types, causes printf to expect a size_t-sized integer argument. |
 * | j         | For integer types, causes printf to expect a intmax_t-sized integer argument. |
 * | t         | For integer types, causes printf to expect a ptrdiff_t-sized integer argument. |
 *
 *
 * Platform-specific length options came to exist prior to widespread use
 * of the ISO C99 extensions, including:
 *
 * | Character | Description                                                                 | Commonly found platforms |
 * |-----------|-----------------------------------------------------------------------------|--------------------------|
 * | I         | For signed integer types, causes printf to expect ptrdiff_t-sized integer argument; for unsigned integer types, causes printf to expect size_t-sized integer argument. | Win32/Win64              |
 * | I32       | For integer types, causes printf to expect a 32-bit (double word) integer argument. | Win32/Win64              |
 * | I64       | For integer types, causes printf to expect a 64-bit (quad word) integer argument. | Win32/Win64              |
 * | q         | For integer types, causes printf to expect a 64-bit (quad word) integer argument. | BSD                      |
 *
 *
 * - **Type field**
 *
 * The type field can be any of:
 *
 * | Character | Description                                                                 |
 * |-----------|-----------------------------------------------------------------------------|
 * | %      | Prints a literal % character (this type does not accept any flags, width, precision, length fields). |
 * | d, i      | int as a signed integer. %d and %i are synonymous for output, but are different when used with scanf for input (where using %i will interpret a number as hexadecimal if it's preceded by 0x, and octal if it's preceded by 0.) |
 * | u      | Print decimal unsigned int.
 * | f, F      | double in normal (fixed-point) notation. f and F only differs in how the strings for an infinite number or NaN are printed (inf, infinity and nan for f; INF, INFINITY and NAN for F). |
 * | e, E      | double value in standard form (d.ddde±dd). An E conversion uses the letter E (rather than e) to introduce the exponent. The exponent always contains at least two digits; if the value is zero, the exponent is 00. In Windows, the exponent contains three digits by default, e.g. 1.5e002, but this can be altered by Microsoft-specific _set_output_format function. |
 * | g, G      | double in either normal or exponential notation, whichever is more appropriate for its magnitude. g uses lower-case letters, G uses upper-case letters. This type differs slightly from fixed-point notation in that insignificant zeroes to the right of the decimal point are not included. Also, the decimal point is not included on whole numbers. |
 * | x, X      | unsigned int as a hexadecimal number. x uses lower-case letters and X uses upper-case. |
 * | s      | null-terminated string. |
 * | p      | reference in an implementation-defined format. |
 * | a, A      | double in hexadecimal notation, starting with 0x or 0X. a uses lower-case letters, A uses upper-case letters.[20][21] (C++11 iostreams have a hexfloat that works the same). |
 * | n      | Print nothing, but writes the number of characters written so far into an integer pointer parameter. |
 *
 *
 * @param this - The context for the `printf` function.
 * @param format - Consists of ordinary byte characters (except %), which
 * are copied unchanged into the output stream, and conversion specifications.
 * @param params - Arguments specifying data to print..
 * @returns The formatted message as a string.
 */
function print_format(this: print_context, format: string, ...params: Array<any>): string {
    this.param_index = 0;
    this.char_count = 0;
    this.cursor_position = 0;
    /* If POSIXLY_CORRECT is not set, then give a warning that there
        are characters following the character constant and that GNU
        printf is ignoring those characters.
        If POSIXLY_CORRECT *is* set, then don't give the warning.  */
    if (format.includes('%') && !this.posixly_correct) {
        const remainingFormat: string = format.slice(format.indexOf('%') + 1);
        if (remainingFormat.length > 0) {
            error.call(this, 0, null, this.cfcc_msg || '', remainingFormat);
        }
    }
    const result: string = format.replace(/%(\d+\$)?([-+ 0'#]*)?(\d+)?(\.\d+)?([hlLzjtI32I64q])?([sdifxXocpeEgGaAn%])/g, (match: string, param: any, flags: any, width: any, precision: any, length: any, type: any) => {
        const index: number = param ? parseInt(param) - 1 : this.param_index++;
        let value: any = params[index];
        const converter: conversion_function | undefined = str_to_expression(type);
        if (converter) {
            // Handle length modifiers
            if (length) {
                value = handleLengthModifier(length, value);
            }
            const formattedValue: string = converter(value, flags, width ?
                    parseInt(width) : undefined,
                precision ? parseInt(precision.slice(1)) : undefined,
               this.char_count
            );
            this.char_count += formattedValue.length;
            this.cursor_position += match.length;
            if (numeric_functions.includes(match)) {
                verify_numeric.call(this, `${value}`, format.slice(this.cursor_position));
            }
            return formattedValue;
        }
        this.cursor_position += match.length;
        return match;
    });
    return result;
}

/**
 * A standard library function that writes a string to the standard output
 * stream.
 *
 * @param this - The context for the `printf` function.
 * @param c - The string to write.
 * @returns The number of characters written.
 * @see print_context
 */
function put_char(this: print_context, c: string): number {
    this.format = c;
    if (this.stdout) {
        return print_out(this);
    }
    if (this.buffer) {
       return print_buffer(this);
    }
    if (this.stream) {
        return print_stream(this);
    }
    return -1;
}

/**
 * Output a single-character \ escape.
 *
 * @param this  - The context for the `printf` function.
 * @param c - The character to escape.
 * @returns The number of characters written.
 * @see print_context
 */
function print_esc_char(this: print_context, c: string): number | never {
    switch (c) {
        case 'a':
            /* Alert. */
            return put_char.call(this, '\a');
        case 'b':
            /* Backspace. */
            return put_char.call(this, '\b');
        case 'c':
            /* Cancel the rest of the output. */
            return exit(EXIT_SUCCESS);
        case 'e':
            /* Escape. */
            return put_char.call(this, '\x1B');
        case 'f':
            /* Form feed. */
            return put_char.call(this, '\f');
        case 'n':
            /* New line. */
            return put_char.call(this, '\n');
        case 'r':
            /* Carriage return. */
            return put_char.call(this, '\r');
        case 't':
            /* Horizontal tab. */
            return put_char.call(this, '\t');
        case 'v':
            /* Vertical tab. */
            return put_char.call(this, '\v');
        default:
            return put_char.call(this, c);
    }
}

/**
 * Writes the formatted output to the standard output stream.
 *
 * @param context - The context containing the format and parameters.
 * @returns The number of characters written, or -1 if no format is provided.
 * @see print_context
 */
function print_out(context: print_context): number {
    if (context.format) {
        const result: string = print_format.call(context, context.format, ...(context.params || []));
        if (context.stdout) {
            context.stdout.write(result);
            return result.length;
        }
    }
    return -1;
}

/**
 * Format the data from the given `format` and `params`, compile and
 * converts them to character string equivalents and writes the results
 * to `stdout`:
 *
 *  - Writes the results to a character string `stdout`.
 *
 *      The `format` string consists of ordinary byte characters (except %),
 *      which are copied unchanged into the output stream, and conversion
 *      specifications.
 *
 * Each conversion specification has the following format:
 *
 * - introductory % character.
 * - one or more flags that modify the behavior of the conversion:
 *      - '-' Left-align the output of this placeholder.
 *      - '+' Prepends a plus for positive signed-numeric types.
 *      - (space) Prepends a space for positive signed-numeric types.
 *      - '0' When the 'width' option is specified, prepends zeros for numeric types.
 *      - '#' Alternate form: For g and G types, trailing zeros are not removed.
 * -  integer value or `*` that specifies minimum field width.
 *
 *      The result is padded with space characters (by default), if required,
 *      on the left when right-justified, or on the right if left-justified.
 *
 *      In the case when `*` is used, the width is specified by an additional
 *      argument of type int, which appears before the argument to be
 *      converted and the argument supplying precision if one is supplied.
 *
 *      If the value of the argument is negative, it results with the `-` flag
 *      specified and positive field width (Note: This is the minimum width:
 *      The value is never truncated.).
 * - followed by integer number or `*`, or neither that specifies precision
 *      of the conversion. In the case when `*` is used, the precision is specified
 *      by an additional argument of type int, which appears before the
 *      argument to be converted, but after the argument supplying minimum
 *      field width if one is supplied. If the value of this argument is negative,
 *      it is ignored.
 *
 *      If neither a number nor `*` is used, the precision is taken as zero.
 *      See the table below for exact effects of precision.
 *  - length modifier that specifies the size of the argument (in combination
 *      with the conversion format specifier, it specifies the type of the
 *      corresponding argument).
 * @param format Pointer to a null-terminated byte string specifying how
 * to interpret the data.
 *
 * @param params Arguments specifying data to print.
 *
 * If any argument after default argument promotions is not the type
 * expected by the corresponding conversion specifier, or if there are
 * fewer arguments than required by `format`, the behavior is undefined.
 *
 * If there are more arguments than required by `format`, the extraneous
 * arguments are evaluated and ignored.
 * @returns The number of characters written, or a negative value if an
 * output error or an encoding error (for string and character conversion
 * specifiers) occurred.
 * @see Buffer
 */
function printf(this: print_context, format: string, ...params: Array<any>): number {
    this.stdout = stdout;
    this.format = format;
    this.params = params;
    return print_out(this);
}

/**
 * Writes the formatted output to the buffer in the given context.
 *
 * @param context - The context containing the buffer and format information.
 * @returns The number of characters written to the buffer, or -1 if no
 * format is provided.
 * @see print_context
 */
function print_buffer(context: print_context): number {
    if (context.format && context.buffer) {
        const result: string = print_format.call(context, context.format, ...(context.params || []));
        const oldLength: number = context.buffer.length;
        if (typeof context.buffer === 'string') {
            context.buffer += result;
        } else if (Array.isArray(context.buffer)) {
            context.buffer.push(result);
        } else if (Buffer.isBuffer(context.buffer)) {
            context.buffer = Buffer.concat([context.buffer, Buffer.from(result)]);
        }
        return context.buffer.length - oldLength;
    }
    return -1;
}

/**
 * Format the data from the given `format` and `params`, compile and
 * converts them to character string equivalents and writes the results
 * to `buffer`:
 *
 *  - Writes the results to a character string `buffer`.
 *
 * @param buffer Pointer to a character string to write to.
 * @param format Pointer to a null-terminated byte string specifying how
 * to interpret the data.
 * @param params Arguments specifying data to print.
 *
 * If any argument after default argument promotions is not the type
 * expected by the corresponding conversion specifier, or if there are
 * fewer arguments than required by `format`, the behavior is undefined.
 *
 * If there are more arguments than required by `format`, the extraneous
 * arguments are evaluated and ignored.
 * @returns The number of characters written, or a negative value if an
 * output error or an encoding error (for string and character conversion
 * specifiers) occurred.
 * @see Buffer
 */
function sprintf(this: print_context, buffer: string | Array<string> | Buffer, format: string, ...params: Array<any>): number {
    this.buffer = buffer;
    this.format = format;
    this.params = params;
    return print_buffer(this);
}

/**
 * Writes the formatted output to a `file` specified in the context.
 *
 * @param context - The context containing the `file` and format information.
 * @returns The number of characters written to the `file`, or -1 if no format
 * is provided.
 * @see print_context
 */
function print_file(context: print_context): number {
    if (!context.format) {
        return -1;
    }
    const result: string = print_format.call(context, context.format, ...(context.params || []));
    let oldLength: number = 0;
    try {
        if (typeof context.file === 'string' || typeof context.file === 'number') {
            oldLength = typeof context.file === 'string' ? statSync(context.file).size : 0;
            writeFileSync(context.file, result, { flag: 'a' });
            return typeof context.file === 'string' ? statSync(context.file).size - oldLength : result.length;
        }
        if (context.file instanceof WriteStream) {
            oldLength = context.file.written;
            context.file.write(result);
            return context.file.written - oldLength;
        }
    } catch (err: any) {
        context.errno = err;
        context.format = `Error writing to file: %s\n`;
        context.params = [err.message];
        context.exit_status = 1;
        print_err(context);
    }
    return -1;
}

/**
 * Writes the formatted output to a `stream` specified in the context.
 *
 * @param context - The context containing the `stream` and format information.
 * @returns The number of characters written to the `stream`, or -1 if no format
 * is provided.
 * @see print_context
 */
function print_stream(context: print_context): number {
    if (context.format) {
        const result: string = print_format.call(context, context.format, ...(context.params || []));
        if (context.stream) {
            context.stream.write(result);
            return result.length;
        }
    }
    return -1;
}

/**
 * Format the data from the given `format` and `params`, compile and
 * converts them to character string equivalents and writes the results
 * to `file`:
 *
 *  - Writes the results to a file denoted by a `pathname`, a `FileWritableStream`
 *      or a `FileDescriptor`.
 *
 * @param file Pointer to a file to write to.
 * @param format Pointer to a null-terminated byte string specifying how
 * to interpret the data.
 * @param params Arguments specifying data to print.
 *
 * If any argument after default argument promotions is not the type
 * expected by the corresponding conversion specifier, or if there are
 * fewer arguments than required by `format`, the behavior is undefined.
 *
 * If there are more arguments than required by `format`, the extraneous
 * arguments are evaluated and ignored.
 *
 * @returns The number of characters written, or a negative value if an
 * output error or an encoding error (for string and character conversion
 * specifiers) occurred.
 * @see FileWritableStream
 */
function fprintf(this: print_context, file: string | number | FileWritableStream, format: string, ...params: Array<any>): number {
    this.file = file;
    this.format = format;
    this.params = params;
    return print_file(this);
}

/**
 * Writes the formatted `error` message to the standard `error` stream.
 *
 * @param context - The context containing the error message and format information.
 * @returns The number of characters written to the standard error stream,
 * or -1 if no format is provided.
 * @see print_context
 */
function print_err(context: print_context): number | never {
    if (context.format) {
        const result: string = print_format.call(context, context.format, ...(context.params || []));
        if (context.stderr) {
            if (context.errno) {
                if (typeof context.errno === 'number') {
                    return exit(context.errno);
                }
                context.stderr.write(`Error: ${context.errno.message}\n`);
            }
            context.stderr.write(result);
            return result.length;
        }
    }
    return typeof context.exit_status === 'number' ? exit(context.exit_status) : -1;
}

/**
 * Format the data from the given `format` and `params`, compile and
 * converts them to character string equivalents and writes the results
 * to `stderr`:
 *
 *  - Writes the results to the standard  `error` output .
 *
 * @param error Pointer to an error to write to.
 * @param format Pointer to a null-terminated byte string specifying how
 * to interpret the data.
 * @param params Arguments specifying data to print.
 *
 * If any argument after default argument promotions is not the type
 * expected by the corresponding conversion specifier, or if there are
 * fewer arguments than required by `format`, the behavior is undefined.
 *
 * If there are more arguments than required by `format`, the extraneous
 * arguments are evaluated and ignored.
 *
 * @returns The number of characters written, or a negative value if an
 * output error or an encoding error (for string and character conversion
 * specifiers) occurred.
 */
function errno(this: print_context, error: Error | NodeJS.ErrnoException, format: string, ...params: Array<any>): number {
    this.errno = error;
    this.stderr = stdout;
    this.format = format;
    this.params = params;
    return print_err(this);
}

export {
    errno,
    fprintf,
    get_print_context,
    printf,
    print_format,
    print_man,
    print_usage,
    put_char,
    sprintf
};
