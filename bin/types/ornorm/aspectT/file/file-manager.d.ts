/**
 * @file file-manager.ts
 * @description This file contains the path manager implementation for the AspectT project.
 * @license MIT
 *
 * @autor Aimé Biendo
 * @contact abiendo@gmail.com
 *
 * @date 2023
 */
import { FilePath } from '@ornorm/aspectT';
/**
 * Manages the paths and directories of a project.
 *
 * The `FileManager` class provides methods to manage and retrieve paths
 * and directories within a project.
 *
 * It follows the singleton pattern to ensure only one instance is created.
 */
export declare class FileManager {
    private readonly projectLayout;
    /**
     * The source directory name.
     */
    static readonly SRC_DIRECTORY: string;
    /**
     * The libraries directory name.
     */
    static readonly LIBS_DIRECTORY: string;
    /**
     * The plugins directory name.
     */
    static readonly PLUGINS_DIRECTORY: string;
    /**
     * The binary files directory name.
     */
    static readonly BIN_DIRECTORY: string;
    /**
     * The logs directory name.
     */
    static readonly LOGS_DIRECTORY: string;
    /**
     * The configuration files directory name.
     */
    static readonly CONFIG_DIRECTORY: string;
    /**
     * The distribution files directory name.
     */
    static readonly DIST_DIRECTORY: string;
    /**
     * The documentation files directory name.
     */
    static readonly DOCS_DIRECTORY: string;
    /**
     * The test files directory name.
     */
    static readonly TESTS_DIRECTORY: string;
    private static readonly TAG;
    private readonly homePath;
    /**
     * Sole constructor.
     *
     * (For invocation by subclass constructors, typically implicit.)
     */
    protected constructor();
    /**
     * Returns an instance of `FileManager`.
     *
     * This method ensures that only one instance of `FileManager` is
     * created (singleton pattern).
     *
     * If an instance already exists, it returns the existing instance; otherwise,
     * it creates a new one.
     *
     * @returns The singleton instance of `FileManager`.
     * @see FileManager
     */
    static get(): FileManager;
    /**
     * Returns the path to the `bin` directory.
     * @see FilePath
     */
    get binDir(): FilePath | undefined;
    /**
     * Returns an array of `FilePath` objects representing the binary files.
     *
     * This method lists all the paths in the `bin` directory and returns them
     * as an array of `FilePath` objects.
     *
     * @returns An array of `FilePath` objects representing the binary files.
     * @see FilePath
     */
    get binFiles(): Array<FilePath>;
    /**
     *  Returns the path to the `config` directory.
     *  @see FilePath
     */
    get configDir(): FilePath | undefined;
    /**
     * Returns an array of `FilePath` objects representing the configuration files.
     *
     * This method lists all the paths in the `config` directory and returns them
     * as an array of `FilePath` objects.
     *
     * @returns An array of `FilePath` objects representing the configuration files.
     * @see FilePath
     */
    get configFiles(): Array<FilePath>;
    /**
     * Returns the path to the `dist` directory.
     * @see FilePath
     */
    get distDir(): FilePath | undefined;
    /**
     * Returns an array of `FilePath` objects representing the distribution files.
     *
     * This method lists all the paths in the `dist` directory and returns them
     * as an array of `FilePath` objects.
     *
     * @returns An array of `FilePath` objects representing the distribution files.
     * @see FilePath
     */
    get distFiles(): Array<FilePath>;
    /**
     *  Returns the path to the `docs` directory.
     *  @see FilePath
     */
    get docsDir(): FilePath | undefined;
    /**
     * Returns an array of `FilePath` objects representing the documentation files.
     *
     * This method lists all the paths in the `docs` directory and returns them
     * as an array of `FilePath` objects.
     *
     * @returns An array of `FilePath` objects representing the documentation files.
     * @see FilePath
     */
    get docsFiles(): Array<FilePath>;
    /**
     * Returns the path to the root directory containing the `node_modules`
     * folder.
     * @see FilePath
     */
    get homeDir(): FilePath | undefined;
    /**
     * Returns an array of `FilePath` objects representing the home files.
     *
     * This method lists all the paths in the home directory and returns them
     * as an array of `FilePath` objects.
     *
     * @returns An array of `FilePath` objects representing the home files.
     * @see FilePath
     */
    get homeFiles(): Array<FilePath>;
    /**
     * Returns the path to the `libs` directory.
     * @see FilePath
     */
    get libsDir(): FilePath | undefined;
    /**
     * Returns an array of `FilePath` objects representing the library files.
     *
     *  This method lists all the paths in the `libs` directory and returns them
     *  as an array of `FilePath` objects.
     *
     *  @returns An array of `FilePath` objects representing the library files.
     *  @see FilePath
     */
    get libsFiles(): Array<FilePath>;
    /**
     * Returns the path to the `logs` directory.
     * @see FilePath
     */
    get logsDir(): FilePath | undefined;
    /**
     * Returns an array of `FilePath` objects representing the log files.
     *
     * This method lists all the paths in the `logs` directory and returns them
     * as an array of `FilePath` objects.
     *
     * @returns An array of `FilePath` objects representing the log files.
     * @see FilePath
     */
    get logsFiles(): Array<FilePath>;
    /**
     *  Returns the path to the `plugins` directory.
     *  @see FilePath
     */
    get pluginsDir(): FilePath | undefined;
    /**
     * Returns an array of `FilePath` objects representing the plugin files.
     *
     * This method lists all the paths in the `plugins` directory and returns them
     * as an array of `FilePath` objects.
     *
     * @returns An array of `FilePath` objects representing the plugin files.
     * @see FilePath
     */
    get pluginsFiles(): Array<FilePath>;
    /**
     * Returns the path to the `src` directory.
     * @see FilePath
     */
    get srcDir(): FilePath | undefined;
    /**
     * Returns an array of `FilePath` objects representing the source files.
     *
     * This method lists all the paths in the `src` directory and returns them
     * as an array of `FilePath` objects.
     *
     * @returns An array of `FilePath` objects representing the source files.
     * @see FilePath
     */
    get srcFiles(): Array<FilePath>;
    /**
     * Returns the path to the `tests` directory.
     * @see FilePath
     */
    get testsDir(): FilePath | undefined;
    /**
     * Returns an array of `FilePath` objects representing the test files.
     *
     * This method lists all the paths in the `tests` directory and returns them
     * as an array of `FilePath` objects.
     *
     * @returnsAn array of `FilePath` objects representing the test files.
     * @see FilePath
     */
    get testsFiles(): Array<FilePath>;
    /**
     * Gets the mapped FilePath for a given directory.
     * @param dir - The directory name.
     * @returns The FilePath object for the directory.
     */
    getDir(dir: string): FilePath | undefined;
    /**
     *  Checks if a directory is mapped.
     * @param dir - The directory name.
     * @returns `true` if the directory is mapped; `false` otherwise.
     */
    hasDir(dir: string): boolean;
    /**
     * Maps a directory name to a specified path.
     *
     * This method associates a given directory name with a specified path
     * and stores the mapping in the project layout.
     *
     * @param dir - The directory name to be mapped.
     * @param path - The path to be associated with the directory name.
     * @see FilePath
     */
    mapDir(dir: string, path: FilePath): void;
    /**
     * Parses a string layout of a project structure and maps the structure in memory.
     * ``` plaintext
     *       myProject/
     *         ├── src/
     *         ├── libs/
     *         ├── plugins/
     *         ├── bin/
     *         ├── logs/
     *         ├── config/
     *         ├── dist/
     *         ├── docs/
     *         └── test/
     *      ```
     * @param layout - The string layout of the project structure.
     */
    fromString(layout: string): void;
    /**
     * Generates a string representation of the project layout.
     *
     * This method iterates over the `projectLayout` map and constructs
     * a string representation of the project structure.
     *
     * @returns A string representing the project layout.
     */
    toString(): string;
    /**
     * Finds the root directory containing the `node_modules` folder.
     *
     * @param startPath - The starting path to begin the search.
     * @returns The path to the root directory containing the `node_modules`
     * folder.
     * @throws ReferenceError if the `node_modules` directory is not found.
     */
    protected findNodeModulesRoot(startPath: string): string;
}
