import {AppInfo, Config, DebugInfo, Deployment, DiagnosticsInfo, SystemInfo} from '@ornorm/aspectT';
import {existsSync, readFileSync} from 'fs';
import {dirname, join} from 'path';

/**
 * The path of the config.
 */
export const DEBUG_CONFIG_PATH: string = 'config';


let INSTANCE: any;

/**
 * **Environments**
 *
 * The table below describes a finely-divided list of tiers:
 *
 * | Environment / Tier Name                          | Description                                                                                                      |
 * |--------------------------------------------------|------------------------------------------------------------------------------------------------------------------|
 * | **Local**                                        | Developer's desktop/workstation                                                                                  |
 * | **Development / Trunk**                          | Development server acting as a sandbox where unit testing may be performed by the developer                       |
 * | **Integration**                                  | CI build target, or for developer testing of side effects                                                        |
 * | **Testing / Test / QC / Internal acceptance**    | The environment where interface testing is performed. A quality control team ensures that the new code will not have any impact on the existing functionality and tests major functionalities of the system after deploying the new code in the test environment. |
 * | **Staging / Stage / Model / Pre-production / External-client acceptance / Demo** | Mirror of production environment                                                                                 |
 * | **Production / Live**                            | Serves end-users/clients                                                                                         |
 *
 * @see Config
 */
export class Debug implements Config {

    private static CONFIG_FILE: string = 'aspect.json';
    private readonly envMap: Map<string, string>;
    private readonly config: Config;

    /**
     * Sole constructor of the `Debug` class.
     *
     * @remarks
     * The constructor is private to prevent instantiation of the class.
     */
    private constructor() {
        this.envMap = new Map<string, string>(
            Object.entries(process.env as { [key: string]: string })
        );
        const projectRoot: string = this.findNodeModulesRoot(process.cwd());
        const configPath: string = join(
            projectRoot, DEBUG_CONFIG_PATH, Debug.CONFIG_FILE
        );
        this.config = JSON.parse(readFileSync(configPath, 'utf8'));
    }

    /**
     * Returns a new `Debug` instance.
     *
     * @returns A new `Env` implementation.
     * @see Config
     */
    public static get env(): Config {
        if (!INSTANCE) {
            INSTANCE = new Debug();
        }
        return INSTANCE;
    }

    /**
     * The application information.
     * @see AppInfo
     */
    public get appInfo(): AppInfo {
        return this.config.appInfo;
    }

    /**
     * Returns the command-line arguments passed to the Node.js process.
     */
    public get args(): Array<string> {
        return process.argv;
    }

    /**
     * The debug information.
     * @see DebugInfo
     */
    public get debugInfo(): DebugInfo {
        return this.config.debugInfo;
    }

    /**
     * Gets the current environment.
     * @see Deployment
     */
    public get deployment(): Deployment {
        return this.config.deployment;
    }

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
    public get isDev(): boolean {
        return this.deployment === 'dev';
    }

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
    public get isLocal(): boolean {
        const hostname: string = process.env.HOSTNAME || '';
        const privateIpRanges: Array<RegExp> = [
            /^127\./, // Loopback addresses
            /^10\./, // Class A private addresses
            /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // Class B private addresses
            /^192\.168\./ // Class C private addresses
        ];
        // Check if the hostname is a loopback address or a private IP address
        return privateIpRanges.some(
            (regex: RegExp) => regex.test(hostname));
    }

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
    public get isProd(): boolean {
        return this.deployment === 'prod';
    }

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
    public get isStage(): boolean {
        return this.deployment === 'stage';
    }

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
    public get isTest(): boolean {
        return this.deployment === 'test';
    }

    /**
     * Returns the number of entries in the map.
     * @returns The number of entries in the map.
     */
    public get size(): number {
        return this.envMap.size;
    }

    /**
     * Gets information about the environment of the project.
     * @see SystemInfo
     */
    public get systemInfo(): SystemInfo {
        return {
            memoryUsage: process.memoryUsage(),
            uptime: process.uptime(),
            platform: process.platform,
            nodeVersion: process.version
        };
    }

    /**
     * Gets detailed diagnostics of the running system environment.
     * @see DiagnosticsInfo
     */
    public get diagnostics(): DiagnosticsInfo {
        return {
            memoryUsage: process.memoryUsage(),
            uptime: process.uptime(),
            platform: process.platform,
            nodeVersion: process.version,
            cpuUsage: process.cpuUsage(),
            envVariables: process.env
        };
    }

    /**
     * Gets the value of an environment variable.
     * @param key - The key of the environment variable.
     * @param [defaultValue=''] - The default value if the environment variable is not set.
     * @returns The value of the environment variable or the default value.
     */
    public static get(key: string, defaultValue: string = ''): string {
        return process.env[key] || defaultValue;
    }

    /**
     * Sets the value of an environment variable.
     * @param key - The key of the environment variable.
     * @param value - The value to set.
     */
    public static set(key: string, value: string): void {
        process.env[key] = value;
    }

    /**
     * Checks if an environment variable is defined.
     * @param key - The key of the environment variable.
     * @returns True if the environment variable is defined, false otherwise.
     */
    public static isDefined(key: string): boolean {
        return process.env[key] !== undefined;
    }

    /**
     * Deletes an environment variable.
     * @param key - The key of the environment variable.
     */
    public static delete(key: string): void {
        delete process.env[key];
    }

    /**
     * Lists all environment variables.
     * @returns An object containing all environment variables.
     */
    public static list(): { [key: string]: string | undefined } {
        return process.env;
    }

    /**
     * Clears all entries in the map.
     */
    public clear(): void {
        this.envMap.clear();
    }

    /**
     * Deletes a specific entry from the map.
     * @param key - The key of the entry to delete.
     * @returns True if the entry was deleted, false otherwise.
     */
    public delete(key: string): boolean {
        return this.envMap.delete(key);
    }

    /**
     * Executes a provided function once for each key/value pair in the map.
     * @param callbackfn - The function to execute.
     * @param [thisArg] - Value to use as `this` when executing `callbackfn`.
     */
    public forEach(callbackfn: (value: string, key: string, map: Map<string, string>) => void, thisArg?: any): void {
        this.envMap.forEach(callbackfn, thisArg);
    }

    /**
     * Returns the value associated with the key, or undefined if the key does not exist.
     * @param key - The key of the entry to get.
     * @returns The value associated with the key, or undefined if the key does not exist.
     */
    public get(key: string): string | undefined {
        return this.envMap.get(key);
    }

    /**
     * Checks if the map contains a specific key.
     * @param key - The key to check.
     * @returns True if the map contains the key, false otherwise.
     */
    public has(key: string): boolean {
        return this.envMap.has(key);
    }

    /**
     * Returns an iterator of the map's keys.
     * @returns An iterator of the map's keys.
     */
    public keys(): IterableIterator<string> {
        return this.envMap.keys();
    }

    /**
     * Sets the value for a specific key in the map.
     * @param key - The key of the entry to set.
     * @param value - The value to set.
     * @returns The map instance.
     */
    public set(key: string, value: string): this {
        this.envMap.set(key, value);
        return this;
    }

    /**
     * Returns an iterator of the map's values.
     * @returns An iterator of the map's values.
     */
    public values(): IterableIterator<string> {
        return this.envMap.values();
    }

    /**
     * Returns an iterator of the map's entries.
     * @returns An iterator of the map's entries.
     */
    public entries(): IterableIterator<[string, string]> {
        return this.envMap.entries();
    }

    /**
     * Returns an iterator of the map's entries.
     * @returns An iterator of the map's entries.
     */
    [Symbol.iterator](): IterableIterator<[string, string]> {
        return this.envMap[Symbol.iterator]();
    }

    /**
     * Returns the default iterator for the map.
     * @returns The default iterator for the map.
     */
    [Symbol.toStringTag]: string = 'Debug';

    /**
     * Finds the root directory containing the `node_modules` folder.
     *
     * @param startPath - The starting path to begin the search.
     * @returns The path to the root directory containing the `node_modules` folder.
     * @throws ReferenceError if the `node_modules` directory is not found.
     */
    protected findNodeModulesRoot(startPath: string): string {
        let currentPath: string = startPath;
        while (!existsSync(join(currentPath, 'node_modules'))) {
            let parentPath: string = dirname(currentPath);
            if (parentPath === currentPath) {
                throw new ReferenceError('node_modules directory not found');
            }
            currentPath = parentPath;
        }
        return currentPath;
    }
}
