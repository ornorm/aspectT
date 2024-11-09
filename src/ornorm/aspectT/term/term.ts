import {TransformableInfo} from 'logform';
import {join} from 'path';
import {LEVEL, MESSAGE, SPLAT} from 'triple-beam';
import {createLogger, format, Logger, transports} from 'winston';

/**
 * Interface representing the structure of log data.
 */
export interface LogData {
    /**
     * The level of the log (e.g., 'info', 'error').
     */
    level: string;
    /**
     * The message to be logged.
     */
    message: any;
    /**
     * Optional log level from the 'triple-beam' library.
     */
    [LEVEL]?: string;
    /**
     * Optional log message from the 'triple-beam' library.
     */
    [MESSAGE]?: any;
    /**
     * Optional additional metadata from the 'triple-beam' library.
     */
    [SPLAT]?: any;
    /**
     * Optional additional properties.
     */
    [key: string | symbol]: any;
}

/**
 * ASCII art header for the `AspectT`.
 */
export const ASPECT_T_ASCII_ART_HEADER: string = `
  ___           _        _______ _______ 
 / _ \\         | |      |__   __|__   __|
/ /_\\ \\_ __ ___| |_ ___    | |     | |   
|  _  | '__/ __| __/ _ \\   | |     | |   
| | | | |  \\__ \\ || (_) |  | |     | |   
\\_| |_/_|  |___/\\__\\___/   |_|     |_|   
`;

/**
 * Banner header for the `AspectT CLI`.
 */
export const ASPECT_T_BANNER_HEADER: string = `
==========================================
============== AspectT CLI ===============
==========================================
`;

// Configure winston to log to a file in the tmp folder
const logDir: string = join(__dirname, '../../../../tmp'); // Adjust the path as needed
const logger: Logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.printf((info: LogData) =>
            `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new transports.File({ filename: join(logDir, 'application.log') })
    ]
});

export class Term {
    /**
     * Gets the ASCII art header for the `AspectT`.
     */
    public static get asciiArtHeader(): string {
        return ASPECT_T_ASCII_ART_HEADER;
    }

    public logBannerHeader(): void {
        console.log(ASPECT_T_ASCII_ART_HEADER);
        console.log(ASPECT_T_BANNER_HEADER);
    }
}
