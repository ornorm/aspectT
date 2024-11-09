import {
    MethodDescriptor, Parameter, ParameterDescriptor
} from '@ornorm/aspectT';

/**
 * @see MethodDescriptor
 */
export class Method {
    private readonly mIsAbstract: boolean;
    private readonly mIsAsync: boolean;
    private readonly mDeclaringClass: Function;
    private readonly mIsGenerator: boolean;
    private readonly mIsImplementation: boolean;
    private readonly mIsOverload: boolean;
    private readonly mIsSignature: boolean;
    private readonly mIsStatic: boolean;
    private readonly mModifiers: Array<string>;
    private readonly mName: string;
    private readonly mParameters: Array<Parameter>;
    private readonly mReturnType: string;

    /**
     *
     * @param declaringClass
     * @param descriptor
     */
    constructor(
        declaringClass: Function,
        descriptor: MethodDescriptor
    ) {
        this.mDeclaringClass = declaringClass;
        this.mIsAbstract = descriptor.isAbstract;
        this.mIsAsync = descriptor.isAsync;
        this.mIsGenerator = descriptor.isGenerator;
        this.mIsImplementation = descriptor.isImplementation;
        this.mIsOverload = descriptor.isOverload;
        this.mIsSignature = descriptor.isSignature;
        this.mIsStatic = descriptor.isStatic;
        this.mModifiers = descriptor.modifiers;
        this.mName = descriptor.name;
        this.mParameters = descriptor.parameters
            .map((desc: ParameterDescriptor) => new Parameter(desc));
        this.mReturnType = descriptor.returnType;
    }

    /**
     * Returns the <code>Class</code> object representing the class or interface
     * that declares the method represented by this <code>Method</code> object.
     */
    public get declaringClass(): Function {
        return this.mDeclaringClass;
    }

    /**
     * True for abstract.
     */
    public get isAbstract(): boolean {
        return this.mIsAbstract;
    }

    /**
     * True for static.
     */
    public get isAsync(): boolean {
        return this.mIsAsync;
    }

    /**
     * True for generator method.
     */
    public get isGenerator(): boolean {
        return this.mIsGenerator;
    }

    /**
     * True when implemented.
     */
    public get isImplementation(): boolean {
        return this.mIsImplementation;
    }

    /**
     * True for when overridden.
     */
    public get isOverload(): boolean {
        return this.mIsOverload;
    }

    /**
     * True for signature.
     */
    public get isSignature(): boolean {
        return this.mIsSignature;
    }

    /**
     * True for static.
     */
    public get isStatic(): boolean {
        return this.mIsStatic;
    }

    /**
     * List of modifiers.
     */
    public get modifiers(): Array<string> {
        return this.mModifiers;
    }

    /**
     * Method name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * List of {@link ParameterDescriptor}.
     */
    public get parameters(): Array<Parameter> {
        return this.mParameters;
    }

    /**
     * Typeof return.
     */
    public get returnType(): string {
        return this.mReturnType;
    }

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
    public invoke(obj: any, ...args: Array<any>): any {
        const method: Function | undefined = Reflect.get(obj, this.name);
        if (typeof method === 'undefined') {
            throw new ReferenceError(`NullPointerException undefined method ${this.name}`);
        }
        if (typeof method !== 'function') {
            throw new TypeError(`ClassCastException invalid type for method ${this.name}`);
        }
        try {
            return Reflect.apply(method, obj, args);
        } catch (e) {
            throw new Error(`InvocationTargetException ${(e as Error).message}`);
        }
    }
}

export default Method;
