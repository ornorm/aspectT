import { ModuleDescriptor } from '@ornorm/aspectT';
/**
 *
 */
export declare class Script {
    /**
     * Generate the typescript source code.
     *
     * @param classPaths List of code class names.
     * @param outputPath FilePath of the script.
     * @return The generated code
     */
    static generateTypesScript(descriptors: Array<ModuleDescriptor>, outputPath: string): string;
    /**
     * Generate the module imports code source.
     *
     * @param mod The {@link ModuleDescriptor} that hold imports.
     * @param classPaths List of code class names.
     * @param outputPath FilePath of the script.
     * @return The generated code source
     */
    static generateImports(mod: ModuleDescriptor, classPaths: Array<string>, outputPath: string): string;
    /**
     * Get an absolute path a relative one.
     *
     * @param relativePath To be resolved.
     * @return The resolved path
     */
    static getAbsolutePath(relativePath: string): string;
    /**
     * Get a relative path from to absolute paths.
     *
     * @param fromAbsolutePath Source absolute path.
     * @param toAbsolutePath Destination absolute path.
     * @return A relative path
     */
    static getRelativeTo(fromAbsolutePath: string, toAbsolutePath: string): string;
}
export default Script;
