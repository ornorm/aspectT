import {cat, ShellString, test} from 'shelljs';
import {
    ClassDeclaration,
    ClassInstancePropertyTypes,
    ConstructorDeclaration,
    ExpressionWithTypeArguments,
    InterfaceDeclaration,
    MethodDeclaration,
    MethodSignature,
    Node,
    ParameterDeclaration,
    Project,
    PropertyDeclaration,
    PropertySignature,
    SourceFile,
    Type
} from 'ts-morph';
import Script from './script';
import {
    ClassDescriptor,
    ConstructorDescriptor,
    InterfaceDescriptor,
    MemberDescriptor,
    MethodDescriptor,
    ModuleDescriptor,
    ParameterDescriptor
} from '@ornorm/aspectT';

/**
 * Resolve type.
 */
export type Resolve<T> = (value: T | PromiseLike<T>) => void;

/**
 * Reject type.
 */
export type Reject = (reason?: any) => void;

/**
 * Hide methods with namespace URI.
 */
export const HIDE_NS_URI_METHODS: number = 0x0001;
/**
 * Include bases prototype.
 */
export const INCLUDE_BASES: number = 0x0002;
/**
 * Include interfaces.
 */
export const INCLUDE_INTERFACES: number = 0x0004;
/**
 * Include variables.
 */
export const INCLUDE_VARIABLES: number = 0x0008;
/**
 * Include accessors.
 */
export const INCLUDE_ACCESSORS: number = 0x0010;
/**
 * Include methods.
 */
export const INCLUDE_METHODS: number = 0x0020;
/**
 * Include metadata.
 */
export const INCLUDE_METADATA: number = 0x0040;
/**
 * Include constructor.
 */
export const INCLUDE_CONSTRUCTOR: number = 0x0080;
/**
 * Include traits.
 */
export const INCLUDE_TRAITS: number = 0x0100;
/**
 * Include traits interface.
 */
export const USE_I_TRAITS: number = 0x0200;
/**
 * Hide everything from the base Object class
 */
export const HIDE_OBJECT: number = 0x0400;
/**
 * Supported flags.
 */
export const INCLUDE_ALL: number =
    INCLUDE_BASES | INCLUDE_INTERFACES | INCLUDE_VARIABLES |
    INCLUDE_ACCESSORS | INCLUDE_METHODS | INCLUDE_METADATA |
    INCLUDE_CONSTRUCTOR | INCLUDE_TRAITS | HIDE_NS_URI_METHODS |
    HIDE_OBJECT;

/**
 * Describe type input options.
 */
export interface DescribeTypeInputOptions {
    inputPath: Array<string>;
    tsConfigPath: string;
}

/**
 * Describe type output options.
 * @see ModuleDescriptor
 */
export interface DescribeTypeOutputOptions {
    descriptors: Array<ModuleDescriptor>;
    outputPath: string;
}

/**
 * Describe type options.
 * @see DescribeTypeInputOptions
 */
export interface DescribeTypeOptions extends DescribeTypeInputOptions {
    outputPath: string;
    describeTypeConfig: string;
}

/**
 * The path of the config.
 */
export const DESCRIBE_TYPE_CONFIG_PATH: string = './describe.type.json';

/**
 * An utilities class used to extract data from source file.
 *
 * @see SourceFile
 */
export class DescriptorType {
    /**
     * Generate a class path file
     *
     * @param describeTypeConfig The config file path.
     * @return When generated
     */
    public static async classPath(
        describeTypeConfig: string = DESCRIBE_TYPE_CONFIG_PATH
    ): Promise<void> {
        try {
            if (test('-e', describeTypeConfig)) {
                const str: ShellString = cat(describeTypeConfig);
                const config: DescribeTypeOptions = JSON.parse(str);
                if (config.tsConfigPath === '') {
                    config.tsConfigPath = `${process.cwd()}/tsconfig.json`;
                }
                await DescriptorType.describeType(config);
            } else {
                console.log('No files found');
            }
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Describe library types.
     *
     * @param options The {@link DescribeTypeOptions} used to describe library.
     * @return Exit on complete
     */
    public static async describeType(options: DescribeTypeOptions): Promise<void> {
        try {
            await DescriptorType.describeTypeOutput({
                outputPath: options.outputPath,
                descriptors: await DescriptorType.describeTypeInput(options)
            });
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Describe library input types.
     *
     * @param options The {@link DescribeTypeInputOptions} used to describe input.
     * @return A list of {@link ModuleDescriptor}
     */
    public static describeTypeInput(options: DescribeTypeInputOptions): Promise<Array<ModuleDescriptor>> {
        const {inputPath, tsConfigPath}: DescribeTypeInputOptions = options;
        return new Promise<Array<ModuleDescriptor>>((
            res: Resolve<Array<ModuleDescriptor>>,
            rej: Reject
        ): void => {
            try {
                const excluded: Array<RegExp> = inputPath.map((reg: string) => new RegExp(reg, 'g'));
                const project: Project = new Project({
                    tsConfigFilePath: tsConfigPath
                });
                const sourceFiles: Array<SourceFile> = project
                    .getSourceFiles()
                    .filter((sourceFile: SourceFile) => {
                        if (sourceFile.isDeclarationFile()) {
                            return false;
                        }
                        /*
                        console.log('----------------------');
                        console.log(sourceFile.getFilePath());
                        console.log(sourceFile.getDirectoryPath());
                        console.log(sourceFile.getBaseName());
                        console.log(sourceFile.getBaseNameWithoutExtension());
                        */
                        return excluded.every((reg: RegExp) => !reg.test(sourceFile.getFilePath()));
                    });

                res(sourceFiles.map(DescriptorType.getModule.bind(DescriptorType)));
            } catch (e) {
                rej(e);
            }
        });
    }


    /**
     * Generate library output description.
     *
     * @param options The {@link DescribeTypeInputOptions} used to generate output.
     * @return A {@link Promise} for completion
     */
    public static describeTypeOutput(
        options: DescribeTypeOutputOptions
    ): Promise<void> {
        const {descriptors, outputPath}: DescribeTypeOutputOptions = options;
        return new Promise<void>((
            res: Resolve<void>,
            rej: Reject
        ) => {
            try {
                const str: ShellString = new ShellString(
                    Script.generateTypesScript(descriptors, outputPath)
                );
                str.to(outputPath);
                res();
            } catch (e) {
                rej(e);
            }
        });
    }

    /**
     * Get a {@link ModuleDescriptor} from the specified source file.
     *
     * @param sourceFile The {@link SourceFile} to use.
     * @return The module descriptor
     */
    public static getModule(sourceFile: SourceFile): ModuleDescriptor {
        return {
            base: 'Module',
            name: sourceFile.getBaseName().replace(/.(ts|js)$/, ''),
            path: sourceFile.getDirectoryPath(),
            classes: sourceFile.getClasses().map(DescriptorType.getClass.bind(DescriptorType)),
            interfaces: sourceFile.getInterfaces().map(DescriptorType.getInterface.bind(DescriptorType))
        };
    }

    /**
     * Get a {@link ClassDescriptor} from a class declaration.
     *
     * @param classDeclaration The {@link ClassDeclaration} to use.
     * @return The class descriptor
     */
    public static getClass(classDeclaration: ClassDeclaration): ClassDescriptor {
        return {
            base: 'Class',
            modifiers: classDeclaration.getModifiers().map(DescriptorType.getModifier.bind(DescriptorType)),
            name: classDeclaration.getName() || '',
            methods: classDeclaration.getMethods().map(DescriptorType.getMethod.bind(DescriptorType)),
            members: classDeclaration.getProperties().map(DescriptorType.getMember.bind(DescriptorType)),
            factory: {
                extendsClass: DescriptorType.getBaseClasses(classDeclaration),
                implementsInterfaces: classDeclaration.getImplements().map(DescriptorType.getInterfaceName.bind(DescriptorType)),
                constructors: DescriptorType.getConstructors(classDeclaration),
                methods: classDeclaration.getInstanceMethods().map(DescriptorType.getMethod.bind(DescriptorType)),
                members: classDeclaration.getInstanceProperties().map(DescriptorType.getMember.bind(DescriptorType))
            }
        };
    }

    /**
     * Get an {@link InterfaceDescriptor} from an interface declaration.
     *
     * @param interfaceDeclaration An {@link InterfaceDeclaration} to use.
     * @return An interface descriptor
     */
    public static getInterface(interfaceDeclaration: InterfaceDeclaration): InterfaceDescriptor {
        return {
            base: 'Interface',
            modifiers: interfaceDeclaration.getModifiers().map(DescriptorType.getModifier.bind(DescriptorType)),
            name: interfaceDeclaration.getName(),
            methods: interfaceDeclaration.getMethods().map(DescriptorType.getInterfaceMethod.bind(DescriptorType)),
            members: interfaceDeclaration.getProperties().map(DescriptorType.getMember.bind(DescriptorType))
        };
    }

    /**
     * Get an interface name from the specified expression.
     *
     * @param expressionWithTypeArguments The {@link ExpressionWithTypeArguments} to use.
     * @return An interface name
     */
    public static getInterfaceName(expressionWithTypeArguments: ExpressionWithTypeArguments): string {
        return DescriptorType.getTypeName(expressionWithTypeArguments.getType());
    }

    /**
     * Get all inherited classes from the specified class declaration.
     *
     * @param classDeclaration The {@link ClassDeclaration} to use.
     * @return A list of inherited class names
     */
    public static getBaseClasses(classDeclaration: ClassDeclaration): Array<string> {
        const classes: Array<string> = [];
        let base: ClassDeclaration | undefined = classDeclaration.getBaseClass();
        while (base) {
            const className: string | undefined = base.getName();
            if (className) {
                classes.push(className);
                base = base.getBaseClass();
            }
        }
        return classes;
    }

    /**
     * Get a list of {@link ConstructorDescriptor} from a class declartion.
     *
     * @param classDeclaration A {@link ClassDeclaration} to be used.
     * @return A list of class descriptor
     */
    public static getConstructors(classDeclaration: ClassDeclaration): Array<ConstructorDescriptor> {
        return classDeclaration
            .getConstructors()
            .map((constructorDeclaration: ConstructorDeclaration) => ({
                modifiers: constructorDeclaration.getModifiers().map(DescriptorType.getModifier.bind(DescriptorType)),
                parameters: constructorDeclaration.getParameters().map(DescriptorType.getParameter.bind(DescriptorType)),
                returnType: DescriptorType.getTypeName(constructorDeclaration.getReturnType())
            }));
    }

    /**
     * Return the {@link MethodDescriptor} for a method.
     *
     * @param methodDeclaration The method.
     * @return The {@link MethodDescriptor} for the specified method
     */
    public static getMethod(methodDeclaration: MethodDeclaration): MethodDescriptor {
        return {
            isSignature: methodDeclaration.getKindName() === 'MethodSignature',
            isAbstract: methodDeclaration.isAbstract(),
            isStatic: methodDeclaration.isStatic(),
            isAsync: methodDeclaration.isAsync(),
            isOverload: methodDeclaration.isOverload(),
            isImplementation: methodDeclaration.isImplementation(),
            isGenerator: methodDeclaration.isGenerator(),
            modifiers: methodDeclaration.getModifiers().map(DescriptorType.getModifier.bind(this)),
            name: methodDeclaration.getName(),
            parameters: methodDeclaration.getParameters().map(DescriptorType.getParameter.bind(this)),
            returnType: DescriptorType.getTypeName(methodDeclaration.getReturnType())
        };
    }

    /**
     * Return the {@link MethodDescriptor} for an interface method.
     *
     * @param methodDeclaration The method.
     * @return The {@link MethodDescriptor} for the specified method
     */
    public static getInterfaceMethod(methodDeclaration: MethodSignature): MethodDescriptor {
        return {
            isSignature: methodDeclaration.getKindName() === 'MethodSignature',
            isAbstract: false,
            isStatic: false,
            isAsync: false,
            isOverload: false,
            isImplementation: false,
            isGenerator: false,
            modifiers: [],
            name: methodDeclaration.getName(),
            parameters: methodDeclaration.getParameters().map(DescriptorType.getParameter.bind(this)),
            returnType: DescriptorType.getTypeName(methodDeclaration.getReturnType())
        };
    }

    /**
     * Get a {@link MemberDescriptor} object.
     *
     * @param classOrInstanceProperty The target to be described.
     * @return The descriptor to be used
     */
    public static getMember(
        classOrInstanceProperty: PropertySignature | PropertyDeclaration | ClassInstancePropertyTypes
    ): MemberDescriptor {
        const kindName: string = classOrInstanceProperty.getKindName();
        return {
            isGetter: kindName === 'SetAccessor',
            isSetter: kindName === 'GetAccessor',
            isProperty: kindName === 'PropertyDeclaration' || kindName === 'PropertySignature',
            modifiers: classOrInstanceProperty.getModifiers().map(DescriptorType.getModifier.bind(DescriptorType)),
            name: classOrInstanceProperty.getName(),
            type: DescriptorType.getTypeName(classOrInstanceProperty.getType())
        };
    }

    /**
     * Get a modifier from a {@link node}.
     *
     * @param node To get modifier.
     * @return The modifier to be used
     */
    public static getModifier(node: Node): string {
        return node.getKindName().replace('Keyword', '').toLowerCase();
    }

    /**
     * Return the descriptor for the specified {@link ParameterDeclaration}.
     *
     * @param parameter To be describe.
     * @param index The position.
     * @return The {@link ParameterDescriptor}
     */
    public static getParameter(parameter: ParameterDeclaration, index: number): ParameterDescriptor {
        return {
            index,
            isOptional: parameter.isOptional(),
            isRestParameter: parameter.isRestParameter(),
            modifiers: parameter.getModifiers().map(DescriptorType.getModifier.bind(DescriptorType)),
            name: parameter.getName(),
            type: DescriptorType.getTypeName(parameter.getType())
        };
    }

    /**
     * Return the name of the specified {@link Type}.
     *
     * @param type To get name.
     * @return The name
     */
    public static getTypeName(type: Type): string {
        const qualifiedClassName: Array<string> = type.getText().split('.');
        const typeName: string = qualifiedClassName[qualifiedClassName.length - 1];
        const indexOfType: number = typeName.indexOf('<');
        return indexOfType !== -1 ? typeName.substring(0, indexOfType) : typeName;
    }
}
