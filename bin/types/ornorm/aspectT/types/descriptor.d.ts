/**
 * The base type of descriptors.
 */
export type BaseType = 'Module' | 'Class' | 'Interface';
/**
 * Interface that represent a {@link SourceFile}.
 *
 * @see ClassDescriptor
 * @see InterfaceDescriptor
 * @see Descriptor
 */
export interface ModuleDescriptor {
    base: BaseType;
    /**
     * The module name.
     */
    name: string;
    /**
     * The list of classes.
     */
    classes: Array<ClassDescriptor>;
    /**
     * The list of interfaces.
     */
    interfaces: Array<InterfaceDescriptor>;
    /**
     * FilePath of the source.
     */
    path: string;
}
/**
 * Interface that represent a {@link ClassDeclaration}.
 *
 * @see MemberDescriptor
 * @see MethodDescriptor
 * @see PrototypeDescriptor
 * @see ModuleDescriptor
 */
export interface ClassDescriptor {
    base: BaseType;
    /**
     * The class modifiers.
     */
    modifiers: Array<string>;
    /**
     * The class name.
     */
    name: string;
    /**
     * The static methods.
     */
    methods: Array<MethodDescriptor>;
    /**
     * The static members.
     */
    members: Array<MemberDescriptor>;
    /**
     * The class prototype.
     */
    factory: PrototypeDescriptor;
}
/**
 * Interface that describe an interface.
 *
 * @see BaseType
 * @see MethodDescriptor
 * @see MemberDescriptor
 */
export interface InterfaceDescriptor {
    base: BaseType;
    /**
     * The interface modifiers.
     */
    modifiers: Array<string>;
    /**
     * The interface name.
     */
    name: string;
    /**
     * The methods.
     */
    methods: Array<MethodDescriptor>;
    /**
     * The members.
     */
    members: Array<MemberDescriptor>;
}
/**
 * Interface that describe a {@link ClassDeclaration} instance.
 *
 * @see MemberDescriptor
 * @see MethodDescriptor
 * @see PrototypeDescriptor
 * @see ModuleDescriptor
 */
export interface PrototypeDescriptor {
    /**
     * Represent the list of extended super classes.
     */
    extendsClass: Array<string>;
    /**
     * Represent the list of implemented interfaces.
     */
    implementsInterfaces: Array<string>;
    /**
     * A list of {@link ConstructorDescriptor}.
     */
    constructors: Array<ConstructorDescriptor>;
    /**
     * A list of {@link MethodDescriptor}.
     */
    methods: Array<MethodDescriptor>;
    /**
     * A list of {@link MemberDescriptor}.
     */
    members: Array<MemberDescriptor>;
}
/**
 * An interface that represent a descriptor for member.
 */
export interface MemberDescriptor {
    /**
     * List of modifiers.
     */
    modifiers: Array<string>;
    /**
     * True when getter.
     */
    isGetter: boolean;
    /**
     * True when setter.
     */
    isSetter: boolean;
    /**
     * True for property.
     */
    isProperty: boolean;
    /**
     * Member name.
     */
    name: string;
    /**
     * The member type.
     */
    type: string;
}
/**
 * Interface that represent a descriptor for constructor.
 *
 * @see ParameterDescriptor
 */
export interface ConstructorDescriptor {
    /**
     * List of modifiers.
     */
    modifiers: Array<string>;
    /**
     * List of {@link ParameterDescriptor}.
     */
    parameters: Array<ParameterDescriptor>;
    /**
     * The type of return.
     */
    returnType: string;
}
/**
 * Interface that represent a descriptor for methods.`
 *
 * @see ParameterDescriptor
 */
export interface MethodDescriptor {
    /**
     * True for abstract.
     */
    isAbstract: boolean;
    /**
     * True for static.
     */
    isStatic: boolean;
    /**
     * True for signature.
     */
    isSignature: boolean;
    /**
     * True for async.
     */
    isAsync: boolean;
    /**
     * True for when overridden.
     */
    isOverload: boolean;
    /**
     * True when implemented.
     */
    isImplementation: boolean;
    /**
     * True for generator method.
     */
    isGenerator: boolean;
    /**
     * List of modifiers.
     */
    modifiers: Array<string>;
    /**
     * Method name.
     */
    name: string;
    /**
     * List of {@link ParameterDescriptor}.
     */
    parameters: Array<ParameterDescriptor>;
    /**
     * Typeof return.
     */
    returnType: string;
}
/**
 * Interface that represent a descriptor for parameters.
 */
export interface ParameterDescriptor {
    /**
     * Index of parameter.
     */
    index: number;
    /**
     * True when optional.
     */
    isOptional: boolean;
    /**
     * True when rest parameter.
     */
    isRestParameter: boolean;
    /**
     * List of modifiers.
     */
    modifiers: Array<string>;
    /**
     * Parameter name.
     */
    name: string;
    /**
     * Parameter type.
     */
    type: string;
}
/**
 * Descriptor class handle class registration and descriptors.
 */
export declare class Descriptor {
    /**
     * Get the number of {@link ModuleDescriptor}s.
     */
    static get numModules(): number;
    /**
     * Get the number of types.
     */
    static get numTypes(): number;
    /**
     * Register a new type.
     *
     * @param name An identifier.
     * @param type A type.
     */
    static addType(name: string, type: Function): void;
    /**
     * Clear all registered descriptors.
     */
    static clearDescriptors(): void;
    /**
     * Clear all registered types.
     */
    static clearTypes(): void;
    /**
     * Find a {@link ClassDescriptor} by name.
     *
     * @param className The descriptor name.
     * @return The descriptor otherwise undefined
     */
    static getClass(className: string): ClassDescriptor | undefined;
    /**
     * Find an {@link InterfaceDescriptor}  by name.
     *
     * @param interfaceName The descriptor name.
     * @return The descriptor otherwise undefined
     */
    static getInterface(interfaceName: string): InterfaceDescriptor | undefined;
    /**
     * Find an {@link ModuleDescriptor}  by name.
     *
     * @param interfaceName The descriptor name.
     * @return The descriptor otherwise undefined
     */
    static getModule(moduleName: string): ModuleDescriptor | undefined;
    /**
     * Find a {@link ModuleDescriptor} by name.
     *
     * @param className The class name owned by the descriptor.
     * @return The descriptor otherwise undefined
     */
    static getModuleOfClass(className: string): [ModuleDescriptor, ClassDescriptor] | undefined;
    /**
     * Find a {@link ModuleDescriptor} by name.
     *
     * @param interfaceName The class name owned by the descriptor.
     * @return The descriptor otherwise undefined
     */
    static getModuleOfInterface(interfaceName: string): [ModuleDescriptor, InterfaceDescriptor] | undefined;
    /**
     * Return a registered type.
     *
     * @param name Type to be found.
     * @return A type otherwise undefined
     */
    static getType(name: string): any;
    /**
     * Unregister a new type.
     *
     * @param name An identifier.
     */
    static removeType(name: string): void;
    /**
     * Set a list of {@link ModuleDescriptor}.
     *
     * @param descriptors The list.
     */
    static setDescriptors(descriptors: Array<ModuleDescriptor>): void;
    /**
     * Set a map of {@link Function}.
     *
     * @param types The map.
     */
    static setTypes(types: Map<string, any>): void;
}
export default Descriptor;
