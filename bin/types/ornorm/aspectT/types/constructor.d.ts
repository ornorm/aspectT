import { ConstructorDescriptor, Parameter } from '@ornorm/aspectT';
/**
 * @see ConstructorDescriptor
 */
export declare class Constructor<T> {
    private readonly mClassDescriptor;
    private readonly mDeclaringClass;
    private readonly mModifiers;
    private readonly mParameters;
    private readonly mReturnType;
    /**
     *
     * @param declaringClass
     * @param descriptor
     */
    constructor(declaringClass: Function, descriptor: ConstructorDescriptor);
    /**
     * Returns the <code>Class</code> object representing the class that declares
     * the constructor represented by this <code>Constructor</code> object.
     */
    get declaringClass(): Function;
    /**
     * List of modifiers.
     */
    get modifiers(): Array<string>;
    /**
     * Returns the name of this constructor, as a string.  This is
     * always the same as the simple name of the constructor's declaring
     * class.
     */
    get name(): string;
    /**
     * List of {@link ParameterDescriptor}.
     */
    get parameters(): Array<Parameter>;
    /**
     * The type of return.
     */
    get returnType(): string;
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
    newInstance(...args: Array<any>): T;
}
export default Constructor;
