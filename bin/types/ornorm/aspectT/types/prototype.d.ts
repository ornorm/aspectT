import { Constructor, Field, Method, PrototypeDescriptor } from '@ornorm/aspectT';
export declare class Prototype<T> {
    private readonly mConstructors;
    private readonly mDeclaringClass;
    private readonly mExtendsClass;
    private readonly mImplementsInterfaces;
    private readonly mMembers;
    private readonly mMethods;
    /**
     *
     * @param declaringClass
     * @param descriptor
     */
    constructor(declaringClass: Function, descriptor: PrototypeDescriptor);
    /**
     * A list of {@link Constructor}.
     */
    get constructors(): Array<Constructor<T>>;
    /**
     * Returns the <code>Class</code> object representing the class or interface
     * that declares the method represented by this <code>Method</code> object.
     */
    get declaringClass(): Function;
    /**
     * Represent the list of extended super classes.
     */
    get extendsClass(): Array<string>;
    /**
     * Represent the list of implemented interfaces.
     */
    get implementsInterfaces(): Array<string>;
    /**
     * A list of {@link Field}.
     */
    get members(): Array<Field>;
    /**
     * A list of {@link Method}.
     */
    get methods(): Array<Method>;
}
export default Prototype;
