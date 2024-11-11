import path from 'path';
import {ClassDescriptor, ModuleDescriptor} from '@ornorm/aspectT';

/**
 *
 */
export class Script {

    /**
     * Generate the typescript source code.
     *
     * @param classPaths List of code class names.
     * @param outputPath FilePath of the script.
     * @return The generated code
     */
    public static generateTypesScript(descriptors: Array<ModuleDescriptor>, outputPath: string): string {
        const classPaths: Array<string> = [];
        const imports: Array<string> = descriptors.map((mod: ModuleDescriptor) =>
            Script.generateImports(mod, classPaths, outputPath)
        );
        return `${imports.join('')}

const ClassPath: Map<string, any> = new Map<string, any>();
${classPaths.join('\n')}

const Descriptors: Array<Record<string, any>> = 
${JSON.stringify(descriptors, null, 4)};

export {ClassPath, Descriptors};
                `.replace(new RegExp('"', 'g'), '\'');
    }

    /**
     * Generate the module imports code source.
     *
     * @param mod The {@link ModuleDescriptor} that hold imports.
     * @param classPaths List of code class names.
     * @param outputPath FilePath of the script.
     * @return The generated code source
     */
    public static generateImports(
        mod: ModuleDescriptor, classPaths: Array<string>, outputPath: string
    ): string {
        if (mod.classes.length) {
            let imp: string = 'import {';
            const outPutDir: string = Script.getAbsolutePath(outputPath);
            const moduleDir: string = Script.getRelativeTo(outPutDir, mod.path);
            const classes: Array<string> = mod.classes
                .filter((classDesc: ClassDescriptor) => classDesc.modifiers.includes('export'))
                .map((classDesc: ClassDescriptor) => classDesc.name);
            classPaths.push(...classes.map((key: string) => `ClassPath.set('${key}', ${key});`));
            imp += `${classes.join(',')}`;
            imp += '} from ';
            return `${imp} '${moduleDir}/${mod.name}';\n`;
        }
        return '';
    }

    /**
     * Get an absolute path a relative one.
     *
     * @param relativePath To be resolved.
     * @return The resolved path
     */
    public static getAbsolutePath(relativePath: string): string {
        return path.resolve(path.parse(path.resolve(relativePath)).dir);
    }

    /**
     * Get a relative path from to absolute paths.
     *
     * @param fromAbsolutePath Source absolute path.
     * @param toAbsolutePath Destination absolute path.
     * @return A relative path
     */
    public static getRelativeTo(fromAbsolutePath: string, toAbsolutePath: string): string {
        const relativePath: string = path.relative(fromAbsolutePath, toAbsolutePath);
        if (!relativePath.startsWith('.')) {
            return`./${relativePath}`;
        }
        return relativePath;
    }

}

export default Script;
