import {
    ClassDescriptor,
    ConstructorDescriptor,
    Descriptor,
    Parameter,
    ParameterDescriptor
} from '@ornorm/aspectT';

/**
 * @see ConstructorDescriptor
 */
export class Constructor<T> {
    private readonly mClassDescriptor: ClassDescriptor | undefined;
    private readonly mDeclaringClass: Function;
    private readonly mModifiers: Array<string>;
    private readonly mParameters: Array<Parameter>;
    private readonly mReturnType: string;

    /**
     *
     * @param declaringClass
     * @param descriptor
     */
    constructor(
        declaringClass: Function,
        descriptor: ConstructorDescriptor
    ) {
        this.mDeclaringClass = declaringClass;
        this.mClassDescriptor = Descriptor.getClass(declaringClass.name);
        this.mModifiers = descriptor.modifiers;
        this.mParameters = descriptor.parameters
            .map((desc: ParameterDescriptor) => new Parameter(desc));
        this.mReturnType = descriptor.returnType;
    }

    /**
     * Returns the <code>Class</code> object representing the class that declares
     * the constructor represented by this <code>Constructor</code> object.
     */
    public get declaringClass(): Function {
        return this.mDeclaringClass;
    }

    /**
     * List of modifiers.
     */
    public get modifiers(): Array<string> {
        return this.mModifiers;
    }

    /**
     * Returns the name of this constructor, as a string.  This is
     * always the same as the simple name of the constructor's declaring
     * class.
     */
    public get name(): string {
        return this.declaringClass.name;
    }

    /**
     * List of {@link ParameterDescriptor}.
     */
    public get parameters(): Array<Parameter> {
        return this.mParameters;
    }

    /**
     * The type of return.
     */
    public get returnType(): string {
        return this.mReturnType;
    }

    /**
     * Uses the constructor represented by this <code>Constructor</code> object to
     * create and initialize a new instance of the constructor's
     * declaring class, with the specified initialization parameters.
     * Individual parameters are automatically unwrapped to match
     * primitive formal parameters, and both primitive and reference
     * parameters are subject to method invocation conversions as necessary.
     *
     * <p>If the number of formal parameters required by the underlying constructor
     * is 0, the supplied <code>initargs</code> array may be of length 0 or null.
     *
     * <p>If the required access and argument checks succeed and the
     * instantiation will proceed, the constructor's declaring class
     * is initialized if it has not already been initialized.
     *
     * <p>If the constructor completes normally, returns the newly
     * created and initialized instance.
     *
     * @param args array of objects to be passed as arguments to
     * the constructor call; values of primitive types are wrapped in
     * a wrapper object of the appropriate type (e.g. a <tt>float</tt>
     * in a {@link java.lang.Float Float})
     *
     * @return a new object created by calling the constructor
     * this object represents
     */
    public newInstance(...args: Array<any>): T {
        if (
            (this.mClassDescriptor && this.mClassDescriptor.modifiers.includes('abstract')) ||
            this.mModifiers.includes('private') ||
            this.mModifiers.includes('protected')
        ) {
            throw new TypeError(
                'InstantiationException abstract, private or protected class instance cant be made'
            );
        }
        try {
            return Reflect.construct(this.declaringClass, args) as T;
        } catch (e) {
            throw new Error(`InvocationTargetException ${(e as Error).message}`);
        }
    }
}

export default Constructor;
