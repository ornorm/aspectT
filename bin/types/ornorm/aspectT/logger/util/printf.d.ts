import { FileWritableStream } from '@ornorm/aspectT';
import { WriteStream } from 'fs';
/**
 * Exit status for syntax errors, etc.
 */
export declare const EXIT_FAILURE: number;
/**
 * Exit status for successful execution.
 */
export declare const EXIT_SUCCESS: number;
/**
 * Interface representing the context for the `printf` function.
 */
export interface print_context {
    /**
     * The number of arguments passed to the program.
     */
    argc?: number;
    /**
     * The arguments passed to the program.
     */
    argv?: Array<string>;
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
    errno?: Error | NodeJS.ErrnoException | number;
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
    stderr?: NodeJS.WriteStream & {
        fd: 1;
    };
    /**
     * The standard output stream.
     * @see NodeJS.WriteStream
     */
    stdout?: NodeJS.WriteStream & {
        fd: 1;
    };
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
declare function get_print_context(context?: Partial<print_context>): print_context;
/**
 * Displays the manual information for the program and exits with the given status.
 *
 * @param status - The exit status code. If non-zero, the manual information
 * is displayed and the program suggests trying the help option.
 *
 * If zero, detailed manual information is displayed.
 */
declare function print_man(status: number): void;
/**
 * Displays the usage information for the program and exits with the given
 * status.
 *
 * @param status - The exit status code. If non-zero, the usage information
 * is displayed and the program suggests trying the help option.
 *
 * If zero, detailed usage information is displayed.
 */
declare function print_usage(this: print_context): number | never;
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
declare function print_format(this: print_context, format: string, ...params: Array<any>): string;
/**
 * A standard library function that writes a string to the standard output
 * stream.
 *
 * @param this - The context for the `printf` function.
 * @param c - The string to write.
 * @returns The number of characters written.
 * @see print_context
 */
declare function put_char(this: print_context, c: string): number;
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
declare function printf(this: print_context, format: string, ...params: Array<any>): number;
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
declare function sprintf(this: print_context, buffer: string | Array<string> | Buffer, format: string, ...params: Array<any>): number;
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
declare function fprintf(this: print_context, file: string | number | FileWritableStream, format: string, ...params: Array<any>): number;
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
declare function errno(this: print_context, error: Error | NodeJS.ErrnoException | number, format: string, ...params: Array<any>): number;
/**
 * Print the text in FORMAT, using ARGV (with ARGC elements) for
 * arguments to any '%' directives.
 * Return the number of elements of ARGV used.
 *
 * @param this - The context for the `printf` function.
 * @param format - The format string.
 * @param argc - The number of arguments.
 * @param argv - The arguments array.
 * @returns The number of elements of ARGV used.
 * @see print_context
 */
declare function print_formatted(this: print_context, format: string, argc: number, ...argv: Array<string>): number;
/**
 * Main function to execute the printf-like functionality.
 *
 * This function initializes the context, processes command-line arguments,
 * and calls the appropriate functions to handle the formatting and output.
 *
 * @returns The exit status of the program.
 * Returns EXIT_SUCCESS (0) if the program executes successfully, or
 * EXIT_FAILURE (1) if there is an error.
 */
declare function print_main(): number;
export { errno, fprintf, get_print_context, printf, print_format, print_formatted, print_main, print_man, print_usage, put_char, sprintf };
