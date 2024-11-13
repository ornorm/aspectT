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
    /**
     * The instrumentation information.
     * @see InstrumentationInfo
     */
    readonly instrumentation: InstrumentationInfo;
    /** The directory where log files are stored. */
    logDir: string;
    /** The name of the log file. */
    logFile: string;
    /** The level of logging (e.g., 'info', 'warn', 'error'). */
    logLevel: string;
    /**
     * Information about the socket connection.
     * @see SocketInfo
     */
    socketInfo: SocketInfo;
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
    envVariables: {
        [key: string]: string | undefined;
    };
}
/**
 * Type alias representing the level of data capture for instrumentation.
 *
 * - 'none': No data capture is performed.
 * - 'minimal': Only essential data is captured, such as basic metrics and error logs.
 * - 'full': All available data is captured, including detailed metrics, logs,
 * and possibly sensitive information.
 */
export type CaptureLevel = 'none' | 'minimal' | 'full';
/**
 * Interface representing the instrumentation information.
 */
export interface InstrumentationInfo {
    /** Determines if instrumentation is enabled. */
    enabled: boolean;
    /**
     * The level of data capture for instrumentation.
     * @see CaptureLevel
     */
    dataCaptureLevel: CaptureLevel;
}
/**
 * Interface representing socket connection information.
 * @see ListenOptions
 */
export interface SocketInfo {
    /**
     * The port number to listen on.
     */
    port?: number;
    /**
     * The hostname or IP address to bind to.
     */
    host?: string;
    /**
     * The maximum length of the queue of pending connections.
     */
    backlog?: number;
    /**
     * The path to a Unix domain socket.
     */
    path?: string;
    /**
     * If true, the handle is exclusive.
     */
    exclusive?: boolean;
    /**
     * If true, the socket is readable by all users.
     */
    readableAll?: boolean;
    /**
     * If true, the socket is writable by all users.
     */
    writableAll?: boolean;
    /**
     * Indicates whether half-opened TCP connections are allowed.
     */
    allowHalfOpen?: boolean | undefined;
    /**
     * Indicates whether the socket should be paused on incoming connections.
     */
    pauseOnConnect?: boolean | undefined;
    /**
     * If set to `true`, it disables the use of Nagle's algorithm immediately
     * after a new incoming connection is received.
     */
    noDelay?: boolean | undefined;
    /**
     * If set to `true`, it enables keep-alive functionality on the socket
     * immediately after a new incoming connection is received,
     * similarly on what is done in `socket.setKeepAlive([enable][, initialDelay])`.
     */
    keepAlive?: boolean | undefined;
    /**
     * If set to a positive number, it sets the initial delay before the first
     * keepalive probe is sent on an idle socket.
     */
    keepAliveInitialDelay?: number | undefined;
    /**
     * Optionally overrides all `net.Socket`s' `readableHighWaterMark`
     * and `writableHighWaterMark`.
     */
    highWaterMark?: number | undefined;
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
    /** Returns the command-line arguments passed to the Node.js process. */
    readonly args: Array<string>;
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
    /**
     * **Development**
     *
     * `Development environment`.
     *
     * The development environment (dev) is the environment in which
     * changes to software are developed, most simply an individual
     * developer's workstation.
     *
     * This differs from the ultimate target environment in various ways –
     * the target may not be a desktop computer (it may be a smartphone,
     * embedded system, headless machine in a data center, etc.),
     * and even if otherwise similar, the developer's environment will include
     * development tools like a compiler, integrated development environment,
     * different or additional versions of libraries and support software, etc.,
     * which are not present in a user's environment.
     * @see Deployment
     */
    readonly isDev: boolean;
    /**
     * **Local**
     *
     * `Local environment`
     *
     * The local environment is the developer's desktop or workstation.
     *
     * This is where the developer writes code, runs unit tests, and
     * debugs the application.
     *
     * The local environment is not shared with other developers or
     * users and is not accessible from the internet.
     *
     * This language is particularly suited for server programs, where
     * servers run in a remote data center; for code that runs on an end
     * user's device, such as applications (apps) or clients, one can refer
     * to the user environment (USER) or local environment (LOCAL) instead.
     * @see Deployment
     */
    readonly isLocal: boolean;
    /**
     * **Production**
     *
     * `Production support`
     *
     * The production environment is also known as live, particularly for
     * servers, as it is the environment that users directly interact with.
     *
     * Deploying to production is the most sensitive step; it may be done
     * by deploying new code directly (overwriting old code, so only one
     * copy is present at a time), or by deploying a configuration change.
     *
     * This can take various forms: deploying a parallel installation of a
     * new version of code, and switching between them with a configuration
     * change; deploying a new version of code with the old behavior and
     * a feature flag, and switching to the new behavior with a configuration
     * change that performs a flag flip; or by deploying separate servers
     * (one running the old code, one the new) and redirecting traffic from
     * old to new with a configuration change at the traffic routing level.
     *
     * These in turn may be done all at once or gradually, in phases.
     * @see Deployment
     */
    readonly isProd: boolean;
    /**
     * **Staging**
     *
     * `Staging environment`
     *
     * A stage, staging or pre-production environment is an environment
     * for testing that exactly resembles a production environment.
     *
     * It seeks to mirror an actual production environment as closely as
     * possible and may connect to other production services and data,
     * such as databases.
     *
     * The primary use of a staging environment is to test all the
     * installation/configuration/migration scripts and procedures before
     * they're applied to a production environment.
     *
     * This ensures all major and minor upgrades to a production environment
     * are completed reliably, without errors, and in a minimum of time.
     * @see Deployment
     */
    readonly isStage: boolean;
    /**
     * **Testing**
     *
     * `Test environment management`
     *
     * The purpose of the test environment is to allow human testers to
     * exercise new and changed code via either automated checks or
     * non-automated techniques.
     *
     * After the developer accepts the new code and configurations through
     * unit testing in the development environment, the items are moved
     * to one or more test environments.
     *
     * Upon test failure, the test environment can remove the faulty code
     * from the test platforms, contact the responsible developer, and
     * provide detailed test and result logs.
     *
     * If all tests pass, the test environment or a continuous integration
     * framework controlling the tests can automatically promote the code
     * to the next deployment environment.
     * @see Deployment
     */
    readonly isTest: boolean;
}
