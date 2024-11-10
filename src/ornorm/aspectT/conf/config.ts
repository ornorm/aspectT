/**
 * @file config.ts
 * @description This file contains the configuration settings for the AspectT project.
 * @license MIT
 *
 * @autor Aimé Biendo
 * @contact abiendo@gmail.com
 *
 * @date 2023
 */

/**
 * Type alias representing standard industry environment modes.
 */
export type Deployment = 'local' | 'dev' | 'test' | 'stage' | 'prod';

/**
 * Interface representing the configuration of the application.
 */
export interface AppInfo {
    /** Author of the application. */
    readonly author: string;
    /** Description of the application. */
    readonly description: string;
    /** Name of the application. */
    readonly name: string;
    /** User agent of the application. */
    readonly userAgent: string;
    /** Version of the application. */
    readonly version: string;
}

/**
 * Interface representing the debug information of the application.
 */
export interface DebugInfo {
    /** The port number used for debugging. */
    debugPort: number;
    /** The level of logging (e.g., 'info', 'warn', 'error'). */
    logLevel: string;
    /** The directory where log files are stored. */
    logDir: string;
}

/**
 * Interface representing detailed diagnostics information of the running system environment.
 */
export interface DiagnosticsInfo {
    /** Memory usage statistics of the Node.js process. */
    memoryUsage: NodeJS.MemoryUsage;
    /** Uptime of the Node.js process in seconds. */
    uptime: number;
    /** Platform the Node.js process is running on. */
    platform: string;
    /** Version of Node.js running the process. */
    nodeVersion: string;
    /** CPU usage statistics of the Node.js process. */
    cpuUsage: NodeJS.CpuUsage;
    /** Environment variables of the Node.js process. */
    envVariables: { [key: string]: string | undefined };
}

/**
 * Interface representing system information of the running environment.
 */
export interface SystemInfo {
    /** Memory usage statistics of the Node.js process. */
    memoryUsage: NodeJS.MemoryUsage;
    /** Uptime of the Node.js process in seconds. */
    uptime: number;
    /** Platform the Node.js process is running on. */
    platform: string;
    /** Version of Node.js running the process. */
    nodeVersion: string;
}

/**
 * Interface representing the configuration of the application.
 */
export interface Config extends Map<string, string> {
    /**
     * The application information.
     * @see AppInfo
     */
    readonly appInfo: AppInfo;
    /**
     * The debug information.
     * @see DebugInfo
     */
    readonly debugInfo: DebugInfo;
    /**
     * Gets the current environment.
     * @see Deployment
     */
    readonly deployment: Deployment;
    /**
     * Gets detailed diagnostics of the running system environment.
     * @see DiagnosticsInfo
     */
    readonly diagnostics: DiagnosticsInfo;
}
