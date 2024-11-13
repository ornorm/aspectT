import { MethodDescriptor, Parameter } from '@ornorm/aspectT';
/**
 * @see MethodDescriptor
 */
export declare class Method {
    private readonly mIsAbstract;
    private readonly mIsAsync;
    private readonly mDeclaringClass;
    private readonly mIsGenerator;
    private readonly mIsImplementation;
    private readonly mIsOverload;
    private readonly mIsSignature;
    private readonly mIsStatic;
    private readonly mModifiers;
    private readonly mName;
    private readonly mParameters;
    private readonly mReturnType;
    /**
     *
     * @param declaringClass
     * @param descriptor
     */
    constructor(declaringClass: Function, descriptor: MethodDescriptor);
    /**
     * Returns the <code>Class</code> object representing the class or interface
     * that declares the method represented by this <code>Method</code> object.
     */
    get declaringClass(): Function;
    /**
     * True for abstract.
     */
    get isAbstract(): boolean;
    /**
     * True for static.
     */
    get isAsync(): boolean;
    /**
     * True for generator method.
     */
    get isGenerator(): boolean;
    /**
     * True when implemented.
     */
    get isImplementation(): boolean;
    /**
     * True for when overridden.
     */
    get isOverload(): boolean;
    /**
     * True for signature.
     */
    get isSignature(): boolean;
    /**
     * True for static.
     */
    get isStatic(): boolean;
    /**
     * List of modifiers.
     */
    get modifiers(): Array<string>;
    /**
     * Method name.
     */
    get name(): string;
    /**
     * List of {@link ParameterDescriptor}.
     */
    get parameters(): Array<Parameter>;
    /**
     * Typeof return.
     */
    get returnType(): string;
    /**
     * Invokes the underlying method represented by this <code>Method</code>
     * object, on the specified object with the specified parameters.
     * Individual parameters are automatically unwrapped to match
     * primitive formal parameters, and both primitive and reference
     * parameters are subject to method invocation conversions as
     * necessary.
     *
     * <p>If the underlying method is static, then the specified <code>obj</code>
     * argument is ignored. It may be null.
     *
     * <p>If the number of formal parameters required by the underlying method is
     * 0, the supplied <code>args</code> array may be of length 0 or null.
     *
     * <p>If the underlying method is an instance method, it is invoked
     * using dynamic method lookup as documented in The Java Language
     * Specification, Second Edition, section 15.12.4.4; in particular,
     * overriding based on the runtime type of the target object will occur.
     *
     * <p>If the underlying method is static, the class that declared
     * the method is initialized if it has not already been initialized.
     *
     * <p>If the method completes normally, the value it returns is
     * returned to the caller of invoke; if the value has a primitive
     * type, it is first appropriately wrapped in an object. However,
     * if the value has the type of an array of a primitive type, the
     * elements of the array are <i>not</i> wrapped in objects; in
     * other words, an array of primitive type is returned.  If the
     * underlying method return type is void, the invocation returns
     * null.
     *
     * @param obj  the object the underlying method is invoked from
     * @param args the arguments used for the method call
     * @return the result of dispatching the method represented by
     * this object on <code>obj</code> with parameters
     * <code>args</code>
     */
    invoke(obj: any, ...args: Array<any>): any;
}
export default Method;
