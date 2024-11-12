import {context, emit_try_help, printf} from '@ornorm/aspectT';
import {exit} from 'process';

/**
 * Exit status for syntax errors, etc.
 */
enum EXIT_STATUS {
    PRINTENV_FAILURE = 2
}

/**
 * The official name of this program (e.g., no 'g' prefix).
 */
export const PROGRAM_NAME: string = 'printenv';

export const AUTHORS: Array<string> = ['Aimé Biendo']

function usage(status: number): void {
    if (status !== 0) {
        emit_try_help();
    } else {
        printf(`Usage: %s [OPTION]... [VARIABLE]...\nPrint the values of the specified environment VARIABLE(s).\nIf no VARIABLE is specified, print name and value pairs for them all.\n\n`, PROGRAM_NAME);
        fputs(`  -0, --null     end each output line with NUL, not newline\n`, stdout);
        fputs(HELP_OPTION_DESCRIPTION, stdout);
        fputs(VERSION_OPTION_DESCRIPTION, stdout);
        printf(USAGE_BUILTIN_WARNING, PROGRAM_NAME);
        emit_ancillary_info(PROGRAM_NAME);
    }
    exit(status);
}
