/**
 * @file path-manager.ts
 * @description This file contains the path manager implementation for the AspectT project.
 * @license MIT
 *
 * @autor Aimé Biendo
 * @contact abiendo@gmail.com
 *
 * @date 2023
 */

import {FileObject, FilePath} from '@ornorm/aspectT';
import {existsSync} from 'fs';
import {dirname, join} from 'path';

let mgr: any;

/**
 * Manages the paths and directories of a project.
 *
 * The `PathManager` class provides methods to manage and retrieve paths
 * and directories within a project.
 *
 * It follows the singleton pattern to ensure only one instance is created.
 */
export class PathManager {
    private readonly projectLayout: Map<string, FilePath> = new Map<string, FilePath>();

    /* DEFAULT PROJECT DIRECTORIES */

    /**
     * The source directory name.
     */
    public static readonly SRC_DIRECTORY: string = 'src';
    /**
     * The libraries directory name.
     */
    public static readonly LIBS_DIRECTORY: string = 'libs';
    /**
     * The plugins directory name.
     */
    public static readonly PLUGINS_DIRECTORY: string = 'plugins';
    /**
     * The binary files directory name.
     */
    public static readonly BIN_DIRECTORY: string = 'bin';
    /**
     * The logs directory name.
     */
    public static readonly LOGS_DIRECTORY: string = 'logs';
    /**
     * The configuration files directory name.
     */
    public static readonly CONFIG_DIRECTORY: string = 'config';
    /**
     * The distribution files directory name.
     */
    public static readonly DIST_DIRECTORY: string = 'dist';
    /**
     * The documentation files directory name.
     */
    public static readonly DOCS_DIRECTORY: string = 'docs';
    /**
     * The test files directory name.
     */
    public static readonly TESTS_DIRECTORY: string = 'test';

    private static readonly TAG: string = 'PathManager';

    private readonly homePath: string;

    /**
     * Sole constructor.
     *
     * (For invocation by subclass constructors, typically implicit.)
     */
    protected constructor() {
        this.homePath = this.findNodeModulesRoot(process.cwd());
    }

    /**
     * Returns an instance of `PathManager`.
     *
     * This method ensures that only one instance of `PathManager` is
     * created (singleton pattern).
     *
     * If an instance already exists, it returns the existing instance; otherwise,
     * it creates a new one.
     *
     * @returns The singleton instance of `PathManager`.
     * @see PathManager
     */
    public static get(): PathManager {
        if (!mgr) {
            mgr = new PathManager();
        }
        return mgr;
    }

    /**
     * Returns the path to the `bin` directory.
     * @see FilePath
     */
    public get binDir(): FilePath | undefined {
        if (!this.hasDir(PathManager.BIN_DIRECTORY) && this.homeDir) {
            this.mapDir(PathManager.BIN_DIRECTORY, this.homeDir.resolve(PathManager.BIN_DIRECTORY));
        }
        return this.getDir(PathManager.BIN_DIRECTORY);
    }

    /**
     * Returns an array of `FilePath` objects representing the binary files.
     *
     * This method lists all the paths in the `bin` directory and returns them
     * as an array of `FilePath` objects.
     *
     * @returns An array of `FilePath` objects representing the binary files.
     * @see FilePath
     */
    public get binFiles(): Array<FilePath> {
        return this.binDir ? FileObject.listPaths(this.binDir) : [];
    }

    /**
     *  Returns the path to the `config` directory.
     *  @see FilePath
     */
    public get configDir(): FilePath | undefined {
        if (!this.hasDir(PathManager.CONFIG_DIRECTORY) && this.homeDir) {
            this.mapDir(PathManager.CONFIG_DIRECTORY, this.homeDir.resolve(PathManager.CONFIG_DIRECTORY));
        }
        return this.getDir(PathManager.CONFIG_DIRECTORY);
    }

    /**
     * Returns an array of `FilePath` objects representing the configuration files.
     *
     * This method lists all the paths in the `config` directory and returns them
     * as an array of `FilePath` objects.
     *
     * @returns An array of `FilePath` objects representing the configuration files.
     * @see FilePath
     */
    public get configFiles(): Array<FilePath> {
        return this.configDir ? FileObject.listPaths(this.configDir) : [];
    }

    /**
     * Returns the path to the `dist` directory.
     * @see FilePath
     */
    public get distDir(): FilePath | undefined {
        if (!this.hasDir(PathManager.DIST_DIRECTORY) && this.homeDir) {
            this.mapDir(PathManager.DIST_DIRECTORY, this.homeDir.resolve(PathManager.DIST_DIRECTORY));
        }
        return this.getDir(PathManager.DIST_DIRECTORY);
    }

    /**
     * Returns an array of `FilePath` objects representing the distribution files.
     *
     * This method lists all the paths in the `dist` directory and returns them
     * as an array of `FilePath` objects.
     *
     * @returns An array of `FilePath` objects representing the distribution files.
     * @see FilePath
     */
    public get distFiles(): Array<FilePath> {
        return this.distDir ? FileObject.listPaths(this.distDir) : [];
    }

    /**
     *  Returns the path to the `docs` directory.
     *  @see FilePath
     */
    public get docsDir(): FilePath | undefined {
        if (!this.hasDir(PathManager.DOCS_DIRECTORY) && this.homeDir) {
            this.mapDir(PathManager.DOCS_DIRECTORY, this.homeDir.resolve(PathManager.DOCS_DIRECTORY));
        }
        return this.getDir(PathManager.DOCS_DIRECTORY);
    }

    /**
     * Returns an array of `FilePath` objects representing the documentation files.
     *
     * This method lists all the paths in the `docs` directory and returns them
     * as an array of `FilePath` objects.
     *
     * @returns An array of `FilePath` objects representing the documentation files.
     * @see FilePath
     */
    public get docsFiles(): Array<FilePath> {
        return this.docsDir ? FileObject.listPaths(this.docsDir) : [];
    }

    /**
     * Returns the path to the root directory containing the `node_modules`
     * folder.
     * @see FilePath
     */
    public get homeDir(): FilePath | undefined {
        if (!this.hasDir(this.homePath)) {
            this.mapDir(this.homePath, FileObject.filePath(this.homePath));
        }
        return this.getDir(this.homePath);
    }

    /**
     * Returns an array of `FilePath` objects representing the home files.
     *
     * This method lists all the paths in the home directory and returns them
     * as an array of `FilePath` objects.
     *
     * @returns An array of `FilePath` objects representing the home files.
     * @see FilePath
     */
    public get homeFiles(): Array<FilePath> {
        return this.homeDir ? FileObject.listPaths(this.homeDir) : [];
    }

    /**
     * Returns the path to the `libs` directory.
     * @see FilePath
     */
    public get libsDir(): FilePath | undefined {
        if (!this.hasDir(PathManager.LIBS_DIRECTORY) && this.homeDir) {
            this.mapDir(PathManager.LIBS_DIRECTORY, this.homeDir.resolve(PathManager.LIBS_DIRECTORY));
        }
        return this.getDir(PathManager.LIBS_DIRECTORY);
    }

    /**
     * Returns an array of `FilePath` objects representing the library files.
     *
     *  This method lists all the paths in the `libs` directory and returns them
     *  as an array of `FilePath` objects.
     *
     *  @returns An array of `FilePath` objects representing the library files.
     *  @see FilePath
     */
    public get libsFiles(): Array<FilePath> {
        return this.libsDir ? FileObject.listPaths(this.libsDir) : [];
    }

    /**
     * Returns the path to the `logs` directory.
     * @see FilePath
     */
    public get logsDir(): FilePath | undefined  {
        if (!this.hasDir(PathManager.LOGS_DIRECTORY) && this.homeDir) {
            this.mapDir(PathManager.LOGS_DIRECTORY, this.homeDir.resolve(PathManager.LOGS_DIRECTORY));
        }
        return this.getDir(PathManager.LOGS_DIRECTORY);
    }

    /**
     * Returns an array of `FilePath` objects representing the log files.
     *
     * This method lists all the paths in the `logs` directory and returns them
     * as an array of `FilePath` objects.
     *
     * @returns An array of `FilePath` objects representing the log files.
     * @see FilePath
     */
    public get logsFiles(): Array<FilePath> {
        return this.logsDir ? FileObject.listPaths(this.logsDir) : [];
    }

    /**
     *  Returns the path to the `plugins` directory.
     *  @see FilePath
     */
    public get pluginsDir(): FilePath | undefined {
        if (!this.hasDir(PathManager.PLUGINS_DIRECTORY) && this.homeDir) {
            this.mapDir(PathManager.PLUGINS_DIRECTORY, this.homeDir.resolve(PathManager.PLUGINS_DIRECTORY));
        }
        return this.getDir(PathManager.PLUGINS_DIRECTORY);
    }

    /**
     * Returns an array of `FilePath` objects representing the plugin files.
     *
     * This method lists all the paths in the `plugins` directory and returns them
     * as an array of `FilePath` objects.
     *
     * @returns An array of `FilePath` objects representing the plugin files.
     * @see FilePath
     */
    public  get pluginsFiles(): Array<FilePath> {
        return this.pluginsDir ? FileObject.listPaths(this.pluginsDir) : [];
    }

    /**
     * Returns the path to the `src` directory.
     * @see FilePath
     */
    public get srcDir(): FilePath | undefined {
        if (!this.hasDir(PathManager.SRC_DIRECTORY) && this.homeDir) {
            this.mapDir(PathManager.SRC_DIRECTORY, this.homeDir.resolve(PathManager.SRC_DIRECTORY));
        }
        return this.getDir(PathManager.SRC_DIRECTORY);
    }

    /**
     * Returns an array of `FilePath` objects representing the source files.
     *
     * This method lists all the paths in the `src` directory and returns them
     * as an array of `FilePath` objects.
     *
     * @returns An array of `FilePath` objects representing the source files.
     * @see FilePath
     */
    public get srcFiles(): Array<FilePath> {
        return this.srcDir ? FileObject.listPaths(this.srcDir) : [];
    }

    /**
     * Returns the path to the `tests` directory.
     * @see FilePath
     */
    public get testsDir(): FilePath | undefined {
        if (!this.hasDir(PathManager.TESTS_DIRECTORY) && this.homeDir) {
            this.mapDir(PathManager.TESTS_DIRECTORY, this.homeDir.resolve(PathManager.TESTS_DIRECTORY));
        }
        return this.getDir(PathManager.TESTS_DIRECTORY);
    }

    /**
     * Returns an array of `FilePath` objects representing the test files.
     *
     * This method lists all the paths in the `tests` directory and returns them
     * as an array of `FilePath` objects.
     *
     * @returnsAn array of `FilePath` objects representing the test files.
     * @see FilePath
     */
    public get testsFiles(): Array<FilePath> {
        return this.testsDir ? FileObject.listPaths(this.testsDir) : [];
    }

    /**
     * Gets the mapped FilePath for a given directory.
     * @param dir - The directory name.
     * @returns The FilePath object for the directory.
     */
    public getDir(dir: string): FilePath | undefined {
        return this.projectLayout.get(dir);
    }

    /**
     *  Checks if a directory is mapped.
     * @param dir - The directory name.
     * @returns `true` if the directory is mapped; `false` otherwise.
     */
    public hasDir(dir: string): boolean {
        return this.projectLayout.has(dir);
    }

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
    public mapDir(dir: string, path: FilePath): void {
        this.projectLayout.set(dir, path);
    }

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
    public fromString(layout: string): void {
        const lines: Array<string> = layout.split('\n');
        if (this.homeDir) {
            const rootPath: FilePath = this.homeDir;
            lines.forEach((line: string) => {
                const trimmedLine: string = line.trim();
                if (trimmedLine) {
                    const parts: Array<string> = trimmedLine.split('/');
                    let currentPath: FilePath = rootPath;
                    parts.forEach((part: string) => {
                        currentPath = currentPath.resolve(part);
                    });
                    this.mapDir(trimmedLine, currentPath);
                }
            });
        }
    }

    /**
     * Generates a string representation of the project layout.
     *
     * This method iterates over the `projectLayout` map and constructs
     * a string representation of the project structure.
     *
     * @returns A string representing the project layout.
     */
    public toString(): string {
        let layout: string = '';
        this.projectLayout.forEach((path: FilePath, dir: string) => (
            layout += `${dir}/\n`
        ));
        return layout;
    }

    /**
     * Finds the root directory containing the `node_modules` folder.
     *
     * @param startPath - The starting path to begin the search.
     * @returns The path to the root directory containing the `node_modules`
     * folder.
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
