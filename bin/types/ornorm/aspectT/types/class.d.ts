import { BaseType, ClassDescriptor, Field, Method, Prototype } from '@ornorm/aspectT';
export declare class Class<T = any> {
    private readonly mBase;
    private readonly mDeclaringClass;
    private readonly mDeclaringModule;
    private readonly mFactory;
    private readonly mMembers;
    private readonly mMethods;
    private readonly mModifiers;
    private readonly mName;
    /**
     *
     * @param declaringModule
     * @param declaringClass
     * @param descriptor
     */
    constructor(declaringModule: string, declaringClass: Function, descriptor: ClassDescriptor);
    /**
     * The type value.
     */
    get base(): BaseType;
    /**
     * Returns the <code>Class</code> object representing the class or interface
     * that declares the method represented by this <code>Method</code> object.
     */
    get declaringClass(): Function;
    /**
     * Returns the module name that owned the class or interface.
     */
    get declaringModule(): string;
    /**
     * Returns the <code>Class</code> object representing the super class or interface
     * that declares the method represented by this <code>Class</code> object.
     */
    get declaringSuperClass(): Function;
    /**
     * The class prototype {@link Prototype}.
     */
    get factory(): Prototype<T>;
    /**
     * Determines if this <code>Class</code> object represents an array class.
     *
     * @return  <code>true</code> if this object represents an array class;
     *          <code>false</code> otherwise.
     */
    get isArray(): boolean;
    /**
     * Determines if the specified <code>Class</code> object represents an
     * interface type.
     *
     * @return  <code>true</code> if this object represents an interface;
     *          <code>false</code> otherwise.
     */
    get isInterface(): boolean;
    /**
     * Determines if the specified <code>Class</code> object represents a
     * primitive type.
     *
     * @return true if and only if this class represents a primitive type
     */
    get isPrimitive(): boolean;
    /**
     * The static {@link Field}.
     */
    get members(): Array<Field>;
    /**
     * The static {@link Method}.
     */
    get methods(): Array<Method>;
    /**
     * The type modifiers.
     */
    get modifiers(): Array<string>;
    /**
     * The type name.
     */
    get name(): string;
    /**
     * Returns the <code>Class</code> representing the superclass of the entity
     * (class, interface, primitive type or void) represented by this
     * <code>Class</code>.  If this <code>Class</code> represents either the
     * <code>Object</code> class, an interface, a primitive type, or void, then
     * null is returned.  If this object represents an array class then the
     * <code>Class</code> object representing the <code>Object</code> class is
     * returned.
     *
     * @return the superclass of the class represented by this object.
     */
    get superclass(): Class;
    /**
     * Record a loaded class with this class.
     *
     * @param name The class name.
     * @param type A type be registered.
     */
    static addClass<C extends Function = any>(name: string, type: C): void;
    /**
     * Returns the <code>Function</code> object associated with the class or
     * interface with the given string name.
     *
     * @param name the fully qualified name of the desired class.
     * @return     the <code>Fucntion</code> object for the class with the
     *             specified name.
     */
    static forName<C extends Function = any>(name: string): C;
    /**
     * Return the type of the specified instance.
     *
     * @param instance Object to require.
     * @return  The instance type
     */
    static getClass(instance: any): Function;
    /**
     * Get all method names.
     *
     * @param instance Object to require.
     * @return All object field names.
     */
    static getClassMethodNames(instance: any): Array<string>;
    /**
     * Return the type name of the specified instance.
     *
     * @param obj Object to require.
     * @return  The instance type name
     */
    static getClassName(instance: any): string;
    /**
     * Get all fields names.
     *
     * @param instance Object to require.
     * @return All object field names.
     */
    static getFieldNames(instance: any): Array<string>;
    /**
     * Get all getters names.
     *
     * @param instance Object to require.
     * @return All object getters names.
     */
    static getGetterNames(instance: any): Array<string>;
    /**
     * Get all method names.
     *
     * @param instance Object to require.
     * @return All object field names.
     */
    static getMethodNames(instance: any): Array<string>;
    /**
     * Return the super type of the specified instance.
     *
     * @param instance Object to require.
     * @return  The instance super type
     */
    static getSuperClass(instance: any): Function;
    /**
     * Return the super type of the specified instance.
     *
     * @param instance Object to require.
     * @return  All the instance super type
     */
    static getSuperClasses(instance: any): Array<Function>;
    /**
     * Return the super type name of the specified instance.
     *
     * @param instance Object to require.
     * @return  The instance super type name
     */
    static getSuperClassName(instance: any): string;
    /**
     * Return the super type names of the specified instance.
     *
     * @param instance Object to require.
     * @return  The instance super type names
     */
    static getSuperClassNames(instance: any): Array<string>;
    /**
     * Determines if the class or interface represented by this
     * <code>Class</code> object is either the same as, or is a superclass or
     * superinterface of, the class or interface represented by the specified
     * <code>Class</code> parameter. It returns <code>true</code> if so;
     * otherwise it returns <code>false</code>. If this <code>Class</code>
     * object represents a primitive type, this method returns
     * <code>true</code> if the specified <code>Class</code> parameter is
     * exactly this <code>Class</code> object; otherwise it returns
     * <code>false</code>.
     *
     * @param src The source type.
     * @param dst The destination type.
     * @return the <code>boolean</code> value indicating whether objects of the
     * type <code>cls</code> can be assigned to objects of this class
     */
    static isAssignableFrom(src: Function, dst: Function): boolean;
    /**
     * Determines if the specified <code>Object</code> is assignment-compatible
     * with the object represented by this <code>Class</code>.  This method is
     * the dynamic equivalent of the Java language <code>instanceof</code>
     * operator. The method returns <code>true</code> if the specified
     * <code>Object</code> argument is non-null and can be cast to the
     * reference type represented by this <code>Class</code> object without
     * raising a <code>ClassCastException.</code> It returns <code>false</code>
     * otherwise.
     *
     * @param instance the object to check.
     * @param type To be checked.
     * @return  true if <code>obj</code> is an instance of this class
     */
    static isInstance(instance: any, F: Function): boolean;
    /**
     *  Loads the class with the specified name.
     *
     * @param name The class name.
     * @return The resulting class
     */
    static loadClass<C extends Function = any>(name: string): Class<C>;
    /**
     * Determines if the class or interface represented by this
     * <code>Class</code> object is either the same as, or is a superclass or
     * superinterface of, the class or interface represented by the specified
     * <code>Class</code> parameter. It returns <code>true</code> if so;
     * otherwise it returns <code>false</code>. If this <code>Class</code>
     * object represents a primitive type, this method returns
     * <code>true</code> if the specified <code>Class</code> parameter is
     * exactly this <code>Class</code> object; otherwise it returns
     * <code>false</code>.
     *
     * <p> Specifically, this method tests whether the type represented by the
     * specified <code>Class</code> parameter can be converted to the type
     * represented by this <code>Class</code> object via an identity conversion
     * or via a widening reference conversion. See <em>The Java Language
     * Specification</em>, sections 5.1.1 and 5.1.4 , for details.
     *
     * @param cls the <code>Class</code> object to be checked
     * @return the <code>boolean</code> value indicating whether objects of the
     * type <code>cls</code> can be assigned to objects of this class
     */
    isAssignableFrom(cls: Function): boolean;
    /**
     * Determines if the specified <code>Object</code> is assignment-compatible
     * with the object represented by this <code>Class</code>.  This method is
     * the dynamic equivalent of the Java language <code>instanceof</code>
     * operator. The method returns <code>true</code> if the specified
     * <code>Object</code> argument is non-null and can be cast to the
     * reference type represented by this <code>Class</code> object without
     * raising a <code>ClassCastException.</code> It returns <code>false</code>
     * otherwise.
     *
     * <p> Specifically, if this <code>Class</code> object represents a
     * declared class, this method returns <code>true</code> if the specified
     * <code>Object</code> argument is an instance of the represented class (or
     * of any of its subclasses); it returns <code>false</code> otherwise. If
     * this <code>Class</code> object represents an array class, this method
     * returns <code>true</code> if the specified <code>Object</code> argument
     * can be converted to an object of the array class by an identity
     * conversion or by a widening reference conversion; it returns
     * <code>false</code> otherwise. If this <code>Class</code> object
     * represents an interface, this method returns <code>true</code> if the
     * class or any superclass of the specified <code>Object</code> argument
     * implements this interface; it returns <code>false</code> otherwise. If
     * this <code>Class</code> object represents a primitive type, this method
     * returns <code>false</code>.
     *
     * @param   obj the object to check
     * @return  true if <code>obj</code> is an instance of this class
     */
    isInstance(obj: any): boolean;
}
export default Class;
