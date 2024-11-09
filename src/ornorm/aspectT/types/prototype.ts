import {
    Constructor,
    ConstructorDescriptor,
    Field,
    MemberDescriptor,
    Method,
    MethodDescriptor,
    PrototypeDescriptor
} from '@ornorm/aspectT';

export class Prototype<T> {
    private readonly mConstructors: Array<Constructor<T>>;
    private readonly mDeclaringClass: Function;
    private readonly mExtendsClass: Array<string>;
    private readonly mImplementsInterfaces: Array<string>;
    private readonly mMembers: Array<Field>;
    private readonly mMethods: Array<Method>;

    /**
     *
     * @param declaringClass
     * @param descriptor
     */
    constructor(
        declaringClass: Function,
        descriptor: PrototypeDescriptor
    ) {
        this.mDeclaringClass = declaringClass;
        this.mConstructors = descriptor.constructors
            .map((desc: ConstructorDescriptor) => new Constructor<T>(declaringClass, desc));
        this.mExtendsClass = descriptor.extendsClass;
        this.mImplementsInterfaces = descriptor.implementsInterfaces;
        this.mMembers = descriptor.members
            .map((desc: MemberDescriptor) => new Field(declaringClass, desc));
        this.mMethods = descriptor.methods
            .map((desc: MethodDescriptor) => new Method(declaringClass, desc));
    }

    /**
     * A list of {@link Constructor}.
     */
    public get constructors(): Array<Constructor<T>> {
        return this.mConstructors;
    }

    /**
     * Returns the <code>Class</code> object representing the class or interface
     * that declares the method represented by this <code>Method</code> object.
     */
    public get declaringClass(): Function {
        return this.mDeclaringClass;
    }

    /**
     * Represent the list of extended super classes.
     */
    public get extendsClass(): Array<string> {
        return this.mExtendsClass;
    }

    /**
     * Represent the list of implemented interfaces.
     */
    public get implementsInterfaces(): Array<string> {
        return this.mImplementsInterfaces;
    }

    /**
     * A list of {@link Field}.
     */
    public get members(): Array<Field> {
        return this.mMembers;
    }

    /**
     * A list of {@link Method}.
     */
    public get methods(): Array<Method> {
        return this.mMethods;
    }
}

export default Prototype;
