import { ClassDeclaration, ClassInstancePropertyTypes, ExpressionWithTypeArguments, InterfaceDeclaration, MethodDeclaration, MethodSignature, Node, ParameterDeclaration, PropertyDeclaration, PropertySignature, SourceFile, Type } from 'ts-morph';
import { ClassDescriptor, ConstructorDescriptor, InterfaceDescriptor, MemberDescriptor, MethodDescriptor, ModuleDescriptor, ParameterDescriptor } from '@ornorm/aspectT';
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
export declare const HIDE_NS_URI_METHODS: number;
/**
 * Include bases prototype.
 */
export declare const INCLUDE_BASES: number;
/**
 * Include interfaces.
 */
export declare const INCLUDE_INTERFACES: number;
/**
 * Include variables.
 */
export declare const INCLUDE_VARIABLES: number;
/**
 * Include accessors.
 */
export declare const INCLUDE_ACCESSORS: number;
/**
 * Include methods.
 */
export declare const INCLUDE_METHODS: number;
/**
 * Include metadata.
 */
export declare const INCLUDE_METADATA: number;
/**
 * Include constructor.
 */
export declare const INCLUDE_CONSTRUCTOR: number;
/**
 * Include traits.
 */
export declare const INCLUDE_TRAITS: number;
/**
 * Include traits interface.
 */
export declare const USE_I_TRAITS: number;
/**
 * Hide everything from the base Object class
 */
export declare const HIDE_OBJECT: number;
/**
 * Supported flags.
 */
export declare const INCLUDE_ALL: number;
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
export declare const DESCRIBE_TYPE_CONFIG_PATH: string;
/**
 * An utilities class used to extract data from source file.
 *
 * @see SourceFile
 */
export declare class DescriptorType {
    /**
     * Generate a class path file
     *
     * @param describeTypeConfig The config file path.
     * @return When generated
     */
    static classPath(describeTypeConfig?: string): Promise<void>;
    /**
     * Describe library types.
     *
     * @param options The {@link DescribeTypeOptions} used to describe library.
     * @return Exit on complete
     */
    static describeType(options: DescribeTypeOptions): Promise<void>;
    /**
     * Describe library input types.
     *
     * @param options The {@link DescribeTypeInputOptions} used to describe input.
     * @return A list of {@link ModuleDescriptor}
     */
    static describeTypeInput(options: DescribeTypeInputOptions): Promise<Array<ModuleDescriptor>>;
    /**
     * Generate library output description.
     *
     * @param options The {@link DescribeTypeInputOptions} used to generate output.
     * @return A {@link Promise} for completion
     */
    static describeTypeOutput(options: DescribeTypeOutputOptions): Promise<void>;
    /**
     * Get a {@link ModuleDescriptor} from the specified source file.
     *
     * @param sourceFile The {@link SourceFile} to use.
     * @return The module descriptor
     */
    static getModule(sourceFile: SourceFile): ModuleDescriptor;
    /**
     * Get a {@link ClassDescriptor} from a class declaration.
     *
     * @param classDeclaration The {@link ClassDeclaration} to use.
     * @return The class descriptor
     */
    static getClass(classDeclaration: ClassDeclaration): ClassDescriptor;
    /**
     * Get an {@link InterfaceDescriptor} from an interface declaration.
     *
     * @param interfaceDeclaration An {@link InterfaceDeclaration} to use.
     * @return An interface descriptor
     */
    static getInterface(interfaceDeclaration: InterfaceDeclaration): InterfaceDescriptor;
    /**
     * Get an interface name from the specified expression.
     *
     * @param expressionWithTypeArguments The {@link ExpressionWithTypeArguments} to use.
     * @return An interface name
     */
    static getInterfaceName(expressionWithTypeArguments: ExpressionWithTypeArguments): string;
    /**
     * Get all inherited classes from the specified class declaration.
     *
     * @param classDeclaration The {@link ClassDeclaration} to use.
     * @return A list of inherited class names
     */
    static getBaseClasses(classDeclaration: ClassDeclaration): Array<string>;
    /**
     * Get a list of {@link ConstructorDescriptor} from a class declartion.
     *
     * @param classDeclaration A {@link ClassDeclaration} to be used.
     * @return A list of class descriptor
     */
    static getConstructors(classDeclaration: ClassDeclaration): Array<ConstructorDescriptor>;
    /**
     * Return the {@link MethodDescriptor} for a method.
     *
     * @param methodDeclaration The method.
     * @return The {@link MethodDescriptor} for the specified method
     */
    static getMethod(methodDeclaration: MethodDeclaration): MethodDescriptor;
    /**
     * Return the {@link MethodDescriptor} for an interface method.
     *
     * @param methodDeclaration The method.
     * @return The {@link MethodDescriptor} for the specified method
     */
    static getInterfaceMethod(methodDeclaration: MethodSignature): MethodDescriptor;
    /**
     * Get a {@link MemberDescriptor} object.
     *
     * @param classOrInstanceProperty The target to be described.
     * @return The descriptor to be used
     */
    static getMember(classOrInstanceProperty: PropertySignature | PropertyDeclaration | ClassInstancePropertyTypes): MemberDescriptor;
    /**
     * Get a modifier from a {@link node}.
     *
     * @param node To get modifier.
     * @return The modifier to be used
     */
    static getModifier(node: Node): string;
    /**
     * Return the descriptor for the specified {@link ParameterDeclaration}.
     *
     * @param parameter To be describe.
     * @param index The position.
     * @return The {@link ParameterDescriptor}
     */
    static getParameter(parameter: ParameterDeclaration, index: number): ParameterDescriptor;
    /**
     * Return the name of the specified {@link Type}.
     *
     * @param type To get name.
     * @return The name
     */
    static getTypeName(type: Type): string;
}
