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
    exit(status);
}
