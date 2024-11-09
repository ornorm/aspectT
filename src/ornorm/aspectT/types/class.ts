
import {
    BaseType,
    ClassDescriptor,
    Descriptor,
    Field,
    MemberDescriptor,
    Method,
    MethodDescriptor,
    ModuleDescriptor,
    Primitive,
    Prototype
} from '@ornorm/aspectT';

const LOADED_CLASSES: Record<string, Class> = {};

export class Class<T=any> {
    private readonly mBase: BaseType;
    private readonly mDeclaringClass: Function;
    private readonly mDeclaringModule: string;
    private readonly mFactory: Prototype<T>;
    private readonly mMembers: Array<Field>;
    private readonly mMethods: Array<Method>;
    private readonly mModifiers: Array<string>;
    private readonly mName: string;

    /**
     *
     * @param declaringModule
     * @param declaringClass
     * @param descriptor
     */
    constructor(
        declaringModule: string,
        declaringClass: Function,
        descriptor: ClassDescriptor
    ) {
        this.mDeclaringModule = declaringModule;
        this.mDeclaringClass = declaringClass;
        this.mBase = descriptor.base;
        this.mFactory = new Prototype<T>(
            declaringClass,
            descriptor.factory
        );
        this.mMembers = descriptor.members
            .map((desc: MemberDescriptor) => new Field(declaringClass, desc, true));
        this.mMethods = descriptor.methods
            .map((desc: MethodDescriptor) => new Method(declaringClass, desc));
        this.mModifiers = descriptor.modifiers;
        this.mName = descriptor.name;
    }

    /**
     * The type value.
     */
    public get base(): BaseType {
        return this.mBase;
    }

    /**
     * Returns the <code>Class</code> object representing the class or interface
     * that declares the method represented by this <code>Method</code> object.
     */
    public get declaringClass(): Function {
        return this.mDeclaringClass;
    }

    /**
     * Returns the module name that owned the class or interface.
     */
    public get declaringModule(): string {
        return this.mDeclaringModule;
    }

    /**
     * Returns the <code>Class</code> object representing the super class or interface
     * that declares the method represented by this <code>Class</code> object.
     */
    public get declaringSuperClass(): Function {
        return Object.getPrototypeOf(this.declaringClass.prototype).constructor;
    }

    /**
     * The class prototype {@link Prototype}.
     */
    public get factory(): Prototype<T> {
        return this.mFactory;
    }

    /**
     * Determines if this <code>Class</code> object represents an array class.
     *
     * @return  <code>true</code> if this object represents an array class;
     *          <code>false</code> otherwise.
     */
    public get isArray(): boolean {
        return this.declaringClass === Array;
    }

    /**
     * Determines if the specified <code>Class</code> object represents an
     * interface type.
     *
     * @return  <code>true</code> if this object represents an interface;
     *          <code>false</code> otherwise.
     */
    public get isInterface(): boolean {
        return this.base === 'Interface';
    }

    /**
     * Determines if the specified <code>Class</code> object represents a
     * primitive type.
     *
     * @return true if and only if this class represents a primitive type
     */
    public get isPrimitive(): boolean {
        return Primitive.isPrimitive(this.name);
    }

    /**
     * The static {@link Field}.
     */
    public get members(): Array<Field> {
        return this.mMembers;
    }

    /**
     * The static {@link Method}.
     */
    public get methods(): Array<Method> {
        return this.mMethods;
    }

    /**
     * The type modifiers.
     */
    public get modifiers(): Array<string> {
        return this.mModifiers;
    }

    /**
     * The type name.
     */
    public get name(): string {
        return this.mName;
    }

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
    public get superclass(): Class {
        return Class.loadClass(this.declaringSuperClass.name);
    }

    /**
     * Record a loaded class with this class.
     *
     * @param name The class name.
     * @param type A type be registered.
     */
    public static addClass<C extends Function=any>(name: string, type: C): void {
        Descriptor.addType(name, type);
    }

    /**
     * Returns the <code>Function</code> object associated with the class or
     * interface with the given string name.
     *
     * @param name the fully qualified name of the desired class.
     * @return     the <code>Fucntion</code> object for the class with the
     *             specified name.
     */
    public static forName<C extends Function=any>(name: string): C {
        const declaringClass: C = Descriptor.getType(name);
        if (!declaringClass) {
            throw new ReferenceError('ClassNotFoundException');
        }
        return declaringClass;
    }

    /**
     * Return the type of the specified instance.
     *
     * @param instance Object to require.
     * @return  The instance type
     */
    public static getClass(instance: any): Function {
        return Object.getPrototypeOf(instance).constructor;
    }

    /**
     * Get all method names.
     *
     * @param instance Object to require.
     * @return All object field names.
     */
    public static getClassMethodNames(instance: any): Array<string> {
        const methods: Array<string> = [];
        Object.getOwnPropertyNames(
            Object.getPrototypeOf(instance)
        )
            .forEach((propertyName: string) => {
                if (typeof instance[propertyName] === 'function' && !methods.includes(propertyName)) {
                    methods.push(propertyName);
                }
            });

        return methods;
    }

    /**
     * Return the type name of the specified instance.
     *
     * @param obj Object to require.
     * @return  The instance type name
     */
    public static getClassName(instance: any): string {
        return Class.getClass(instance).name;
    }

    /**
     * Get all fields names.
     *
     * @param instance Object to require.
     * @return All object field names.
     */
    public static getFieldNames(instance: any): Array<string> {
        const fields: Array<string> = [];
        for (; instance !== null && instance !== undefined; instance = Object.getPrototypeOf(instance)) {
            Object.getOwnPropertyNames(instance)
                .forEach((propertyName: string) => {
                    if (typeof instance[propertyName] !== 'function' && !fields.includes(propertyName)) {
                        fields.push(propertyName);
                    }
                });
        }

        return fields;
    }

    /**
     * Get all getters names.
     *
     * @param instance Object to require.
     * @return All object getters names.
     */
    public static getGetterNames(instance: any): Array<string> {
        const getters: Array<string> = [];
        for (; instance !== null && instance !== undefined; instance = Object.getPrototypeOf(instance)) {
            getters.push(...(Object.entries(
                    Object.getOwnPropertyDescriptors(instance)
                ).filter((e: Array<any>) => e[1].get === 'function' && e[0] !== '__proto__')
                    .map((e: Array<any>) => e[0] !))
            );
        }

        return getters;
    }

    /**
     * Get all method names.
     *
     * @param instance Object to require.
     * @return All object field names.
     */
    public static getMethodNames(instance: any): Array<string> {
        const methods: Array<string> = [];
        for (; instance !== null && instance !== undefined; instance = Object.getPrototypeOf(instance)) {
            Object.getOwnPropertyNames(instance)
                .forEach((propertyName: string) => {
                    if (typeof instance[propertyName] === 'function' && !methods.includes(propertyName)) {
                        methods.push(propertyName);
                    }
                });
        }

        return methods;
    }

    /**
     * Return the super type of the specified instance.
     *
     * @param instance Object to require.
     * @return  The instance super type
     */
    public static getSuperClass(instance: any): Function {
        const proto: Function = Object.getPrototypeOf(instance);
        return Object.getPrototypeOf(proto).constructor;
    }

    /**
     * Return the super type of the specified instance.
     *
     * @param instance Object to require.
     * @return  All the instance super type
     */
    public static getSuperClasses(instance: any): Array<Function> {
        const superclasses: Array<Function> = [];
        for (; instance !== null && instance !== undefined; instance = Object.getPrototypeOf(instance)) {
            if (!superclasses.includes(instance.constructor)) {
                superclasses.push(instance.constructor);
            }
        }
        superclasses.shift();

        return superclasses;
    }

    /**
     * Return the super type name of the specified instance.
     *
     * @param instance Object to require.
     * @return  The instance super type name
     */
    public static getSuperClassName(instance: any): string {
        return Class.getSuperClass(instance).name;
    }

    /**
     * Return the super type names of the specified instance.
     *
     * @param instance Object to require.
     * @return  The instance super type names
     */
    public static getSuperClassNames(instance: any): Array<string> {
        const superclasses: Array<string> = [];
        for (; instance !== null && instance !== undefined; instance = Object.getPrototypeOf(instance)) {
            const className: string = instance.constructor.name;
            if (!superclasses.includes(className)) {
                superclasses.push(className);
            }
        }
        superclasses.shift();

        return superclasses;
    }

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
    public static isAssignableFrom(src: Function, dst: Function): boolean {
        if (src === dst) {
            return true;
        }
        let instance: any = src.prototype;
        for (; instance !== null && instance !== undefined; instance = Object.getPrototypeOf(instance)) {
            if (instance.constructor === dst) {
                return true;
            }
        }

        return false;
    }

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
    public static isInstance(instance: any, F: Function): boolean {
        return instance instanceof F;
    }

    /**
     *  Loads the class with the specified name.
     *
     * @param name The class name.
     * @return The resulting class
     */
    public static loadClass<C extends Function=any>(name: string): Class<C> {
        if (Reflect.has(LOADED_CLASSES, name)) {
            return Reflect.get(LOADED_CLASSES, name);
        }
        const descriptors: [ModuleDescriptor, ClassDescriptor] | undefined = Descriptor.getModuleOfClass(name);
        if (descriptors !== undefined) {
            const moduleDescriptor: ModuleDescriptor = descriptors[0];
            const classDescriptor: ClassDescriptor = descriptors[1];
            const declaringClass: C = Class.forName(name);
            const cls: Class<C> = new Class<C>(
                moduleDescriptor.name,
                declaringClass,
                classDescriptor
            );
            Reflect.set(LOADED_CLASSES, name, cls);
            return cls;
        } else {
            throw new ReferenceError('ModuleNotFoundException');
        }
    }

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
    public isAssignableFrom(cls: Function): boolean {
        return Class.isAssignableFrom(cls, this.declaringClass);
    }

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
    public isInstance(obj: any): boolean {
        return Class.isInstance(obj, this.declaringClass);
    }

}

export default Class;
