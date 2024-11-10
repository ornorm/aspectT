import {Log} from '@ornorm';
import { existsSync, readFileSync } from 'fs';
import { join, dirname, resolve } from 'path';

export class PathManager {
    public static readonly PROPERTIES_FILE: string = 'idea.properties.file';
    public static readonly PROPERTIES_FILE_NAME: string = 'idea.properties';
    public static readonly PROPERTY_HOME_PATH: string = 'idea.home.path';
    public static readonly PROPERTY_CONFIG_PATH: string = 'idea.config.path';
    public static readonly PROPERTY_SYSTEM_PATH: string = 'idea.system.path';
    public static readonly PROPERTY_SCRATCH_PATH: string = 'idea.scratch.path';
    public static readonly PROPERTY_PLUGINS_PATH: string = 'idea.plugins.path';
    public static readonly PROPERTY_LOG_PATH: string = 'idea.log.path';
    public static readonly PROPERTY_LOG_CONFIG_FILE: string = 'idea.log.config.properties.file';
    public static readonly PROPERTY_PATHS_SELECTOR: string = 'idea.paths.selector';
    public static readonly SYSTEM_PATHS_CUSTOMIZER: string = 'idea.paths.customizer';

    public static readonly OPTIONS_DIRECTORY: string = 'options';
    public static readonly DEFAULT_EXT: string = '.json';

    private static readonly PROPERTY_HOME: string = 'idea.home';
    private static readonly PROPERTY_VENDOR_NAME: string = 'idea.vendor.name';

    private static readonly JRE_DIRECTORY: string = 'jbr';
    private static readonly LIB_DIRECTORY: string = 'libs';
    private static readonly PLUGINS_DIRECTORY: string = 'plugins';
    private static readonly BIN_DIRECTORY: string = 'bin';
    private static readonly LOG_DIRECTORY: string = 'logs';
    private static readonly CONFIG_DIRECTORY: string = 'config';
    private static readonly SYSTEM_DIRECTORY: string = 'system';
    private static readonly COMMUNITY_MARKER: string = 'intellij.idea.community.main.iml';
    private static readonly ULTIMATE_MARKER: string = '.ultimate.root.marker';
    private static readonly PRODUCT_INFO_JSON: string = 'product-info.json';

    private static readonly TAG: string = 'PathManager';

    private static ourHomePath: string | null = null;
    private static ourBinDirectories: Array<string> | null = null;
    private static ourCommonDataPath: string | null = null;
    private static ourPathSelector: string | null =
        process.env[PathManager.PROPERTY_PATHS_SELECTOR] || null;
    private static ourConfigPath: string | null = null;
    private static ourSystemPath: string | null = null;
    private static ourScratchPath: string | null = null;
    private static ourPluginPath: string | null = null;
    private static ourLogPath: string | null = null;
    private static ourStartupScriptDir: string | null = null;
    private static ourOriginalConfigDir: string | null = null;
    private static ourOriginalSystemDir: string | null = null;
    private static ourOriginalLogDir: string | null = null;
    private static ourArchivedCompiledClassesMapping: { [key: string]: string } | null = null;

    /**
     * Bin path may be not what you want when developing an IDE.
     *
     * Consider using {@link findBinFile} if applicable.
     */
    public static get binPath(): string {
        return `${PathManager.homePath}/${PathManager.BIN_DIRECTORY}`;
    }

    public static findBinFile(fileName: string): string | null {
        for (Path binDir : getBinDirectories()) {
            Path candidate = binDir.resolve(fileName);
            if (Files.isRegularFile(candidate)) {
                return candidate;
            }
        }
        return null;
    }

    public static get homePath(): string {
        return PathManager.getHomePathInternal();
    }


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

    private static getHomePathInternal(insideIde: boolean = true): string {
        if (PathManager.ourHomePath) {
            return PathManager.ourHomePath;
        }
        let explicit: string | null =
            PathManager.getExplicitPath(PathManager.PROPERTY_HOME_PATH) ||
            PathManager.getExplicitPath(PathManager.PROPERTY_HOME);
        if (explicit) {
            if (!existsSync(explicit)) {
                PathManager.ourHomePath = explicit;
                throw new ReferenceError(`Invalid home path '${explicit}'`);
            }
            PathManager.ourHomePath = explicit;
        } else if (insideIde) {
            const result: string | null = PathManager.getHomePathFor(PathManager);
            if (!result) {
                const advice: string =
                    process.platform === 'darwin' ?
                        'reinstall the software.' :
                        'make sure product-info.json is present in the installation directory.';
                throw new ReferenceError(`Could not find installation home path. Please ${advice}`);
            }
            PathManager.ourHomePath = result;
        }
        if (PathManager.ourHomePath && process.platform === 'win32') {
            try {
                PathManager.ourHomePath = resolve(PathManager.ourHomePath);
            } catch (ignored: any) {
                Log.e('PathManager', 'Failed to resolve home path', ignored);
            }
        }

        if (!PathManager.ourHomePath) {
            PathManager.ourBinDirectories = [];
        } else {
            const root: string = resolve(PathManager.ourHomePath);
            PathManager.ourBinDirectories = PathManager.getBinDirectories(root);
        }

        return PathManager.ourHomePath;
    }

    private static getBinDirectories(root: string): Array<string> {
        const binDirs: Array<string> = [];
        const candidates: Array<string> = [
            join(root, PathManager.BIN_DIRECTORY),
            join(PathManager.getCommunityHomePath(root), 'bin')
        ];
        const osSuffix: string =
            process.platform === 'win32' ? 'win' : process.platform === 'darwin' ? 'mac' : 'linux';
        for (let dir of candidates) {
            if (binDirs.includes(dir) || !existsSync(dir)) {
                continue;
            }
            binDirs.push(dir);
            dir = join(dir, osSuffix);
            if (existsSync(dir)) {
                binDirs.push(dir);
                if (process.platform === 'win32' || process.platform === 'linux') {
                    const arch: string | null =
                        process.arch === 'x64' ? 'amd64' : process.arch === 'arm64' ? 'aarch64' : null;
                    if (arch) {
                        dir = join(dir, arch);
                        if (existsSync(dir)) {
                            binDirs.push(dir);
                        }
                    }
                }
            }
        }
        return binDirs;
    }

    private static getExplicitPath(property: string): string | null {
        const path: string | undefined = Reflect.get(process.env, property);
        if (!path) {
            return null;
        }
        const quoted: boolean = path.length > 1 && path.startsWith('"') && path.endsWith('"');
        return PathManager.getAbsolutePath(quoted ? path.slice(1, -1) : path);
    }

    private static getAbsolutePath(path: string): string {
        if (path.startsWith('~/') || path.startsWith('~\\')) {
            path = `${process.env.HOME}${path.slice(1)}`;
        }
        return resolve(path);
    }

    private static getCommunityHomePath(homePath: string): string {
        const isRunningFromSources: boolean = existsSync(join(homePath, '.idea'));
        if (!isRunningFromSources) {
            return homePath;
        }
        const possibleCommunityPaths: Array<string> = [
            join(homePath, 'community'),
            join(homePath, '..', '..', '..', 'community'),
            join(homePath, '..', '..', '..', '..', 'community')
        ];
        for (const possibleCommunityPath of possibleCommunityPaths) {
            if (existsSync(join(possibleCommunityPath, PathManager.COMMUNITY_MARKER))) {
                return resolve(possibleCommunityPath);
            }
        }
        return homePath;
    }

    private static getHomePathFor(aClass: any): string | null {
        const resourceRoot: string | null =
            PathManager.getResourceRoot(aClass, `/${aClass.name.replace(/\./g, '/')}.ts`);
        if (!resourceRoot) {
            return null;
        }
        const root: string = resolve(resourceRoot);
        let currentRoot: string = root;
        while (currentRoot !== dirname(currentRoot)) {
            if (PathManager.isIdeaHome(currentRoot)) {
                return currentRoot;
            }
            currentRoot = dirname(currentRoot);
        }
        return null;
    }

    private static getResourceRoot(context: any, path: string): string | null {
        const url: string = context.getResource(path) || context.getResource(path.slice(1));
        if (!url) {
            return null;
        }
        return PathManager.extractRoot(url, path);
    }

    private static extractRoot(resourceURL: any, resourcePath: string): string | null {
        if (!resourcePath.startsWith('/') && !resourcePath.startsWith('\\')) {
            Log.e(PathManager.TAG, `precondition failed: ${resourcePath}`);
            return null;
        }
        let resultPath: string | null = null;
        const protocol: string = resourceURL.protocol;
        if (protocol === 'file:') {
            try {
                const result: string = new URL(resourceURL).pathname;
                const path: string = result.replace(/\\/g, '/');
                const testResourcePath: string = resourcePath.replace(/\\/g, '/');
                if (path.toLowerCase().endsWith(testResourcePath.toLowerCase())) {
                    resultPath = path.slice(0, path.length - resourcePath.length);
                }
            } catch (e: any) {
                throw new ReferenceError(
                    `URL='${resourceURL}', path='${resourcePath}', msg: ${e.message}`
                );
            }
        } else if (protocol === 'jar:') {
            const jarPath: string | null = PathManager.splitJarUrl(resourceURL.pathname);
            if (jarPath) {
                resultPath = jarPath;
            }
        }
        if (!resultPath) {
            Log.e(PathManager.TAG, `cannot extract '${resourcePath}' from '${resourceURL}'`);
            return null;
        }
        return resolve(resultPath);
    }

    private static splitJarUrl(url: string): string | null {
        const pivot = url.indexOf('!');
        if (pivot < 0) return null;

        let jarPath = url.slice(0, pivot);
        if (jarPath.startsWith('jar:')) {
            jarPath = jarPath.slice(4);
        }

        if (jarPath.startsWith('file:')) {
            try {
                const result = new URL(jarPath).pathname;
                return result.replace(/\\/g, '/');
            } catch (e) {
                jarPath = jarPath.slice(5);
                if (jarPath.startsWith('//')) {
                    return jarPath.slice(2);
                } else if (jarPath.startsWith(':')) {
                    return jarPath.slice(1);
                } else {
                    return jarPath;
                }
            }
        }

        return jarPath;
    }
}
