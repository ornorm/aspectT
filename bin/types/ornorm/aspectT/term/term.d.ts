import { LEVEL, MESSAGE, SPLAT } from 'triple-beam';
import { Logger } from 'winston';
/**
 * Interface representing the structure of log data.
 */
export interface LogData {
    level: string;
    message: any;
    [LEVEL]?: string;
    [MESSAGE]?: any;
    [SPLAT]?: any;
    [key: string | symbol]: any;
}
/**
 * ASCII art header for the `AspectT`.
 */
export declare const ASPECT_T_ASCII_ART_HEADER: string;
/**
 * Banner header for the `AspectT CLI`.
 */
export declare const ASPECT_T_BANNER_HEADER: string;
declare const logger: Logger;
export declare class Term {
    /**
     * Gets the ASCII art header for the `AspectT`.
     */
    static get asciiArtHeader(): string;
    logBannerHeader(): void;
}
export { logger };
