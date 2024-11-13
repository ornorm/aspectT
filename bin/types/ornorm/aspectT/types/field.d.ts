import { MemberDescriptor } from '@ornorm/aspectT';
/**
 * A <code>Field</code> provides information about, and dynamic access to, a
 * single field of a class or an interface.  The reflected field may
 * be a class (static) field or an instance field.
 */
export declare class Field {
    private readonly mDeclaringClass;
    private readonly mIsGetter;
    private readonly mIsProperty;
    private readonly mIsSetter;
    private readonly mModifiers;
    private readonly mName;
    private readonly mIstatic;
    private readonly mType;
    /**
     * Create a field instance.
     *
     * @param declaringClass The class that hold this field.
     * @param descriptor The {@link MemberDescriptor} to be used.
     * @param isStatic True when static?
     */
    constructor(declaringClass: Function, descriptor: MemberDescriptor, isStatic?: boolean);
    /**
     * Returns the <code>Class</code> object representing the class or interface
     * that declares the method represented by this <code>Method</code> object.
     */
    get declaringClass(): Function;
    /**
     * True when getter.
     */
    get isGetter(): boolean;
    /**
     * True when primitive type.
     */
    get isPrimitive(): boolean;
    /**
     * True for property.
     */
    get isProperty(): boolean;
    /**
     * True when can be read.
     */
    get isReadable(): boolean;
    /**
     * True when setter.
     */
    get isSetter(): boolean;
    /**
     * True when static.
     */
    get isStatic(): boolean;
    /**
     * True when can be written.
     */
    get isWritable(): boolean;
    /**
     * Returns the typescript language modifiers for the field represented
     * by this <code>Field</code> object, as an array of string.
     * The <code>Modifier</code> class should be used to decode the modifiers.
     *
     * @see Modifier
     */
    get modifiers(): Array<string>;
    /**
     * Member name.
     */
    get name(): string;
    /**
     * The member type.
     */
    get type(): string;
    /**
     * Returns the value of the field represented by this <code>Field</code>, on
     * the specified object. The value is automatically wrapped in an
     * object if it has a primitive type.
     *
     * <p>The underlying field's value is obtained as follows:
     *
     * <p>If the underlying field is a static field, the <code>obj</code> argument
     * is ignored; it may be null.
     *
     * <p>Otherwise, the underlying field is an instance field.  If the
     * specified <code>obj</code> argument is null, the method throws a
     * <code>NullPointerException.</code> If the specified object is not an
     * instance of the class or interface declaring the underlying
     * field, the method throws an <code>IllegalArgumentException</code>.
     *
     * <p>If this <code>Field</code> object enforces Java language access control, and
     * the underlying field is inaccessible, the method throws an
     * <code>IllegalAccessException</code>.
     * If the underlying field is static, the class that declared the
     * field is initialized if it has not already been initialized.
     *
     * <p>Otherwise, the value is retrieved from the underlying instance
     * or static field.  If the field has a primitive type, the value
     * is wrapped in an object before being returned, otherwise it is
     * returned as is.
     *
     * <p>If the field is hidden in the type of <code>obj</code>,
     * the field's value is obtained according to the preceding rules.
     *
     * @param obj object from which the represented field's value is
     * to be extracted
     * @return the value of the represented field in object
     * <tt>obj</tt>; primitive values are wrapped in an appropriate
     * object before being returned
     */
    get(obj: any): any;
    /**
     * Gets the value of a static or instance <code>bigint</code> field.
     *
     * @param obj the object to extract the <code>bigint</code> value
     * from
     * @return the value of the <code>bigint</code> field
     * @see       Field#get
     */
    getBigInt(obj: any): bigint;
    /**
     * Gets the value of a static or instance <code>boolean</code> field.
     *
     * @param obj the object to extract the <code>boolean</code> value
     * from
     * @return the value of the <code>boolean</code> field
     * @see       Field#get
     */
    getBoolean(obj: any): boolean;
    /**
     * Gets the value of a static or instance field of type
     * <code>number</code> or of another primitive type convertible to
     * type <code>number</code> via a widening conversion.
     *
     * @param obj the object to extract the <code>number</code> value
     * from
     * @return the value of the field converted to type <code>number</code>
     * @see       Field#get
     */
    getNumber(obj: any): number;
    /**
     * Gets the value of a static or instance field of type
     * <code>char</code> or of another primitive type convertible to
     * type <code>char</code> via a widening conversion.
     *
     * @param obj the object to extract the <code>char</code> value
     * from
     * @return the value of the field converted to type <code>string</code>
     * @see Field#get
     */
    getString(obj: any): string;
    /**
     * Gets the value of a static or instance <code>symbol</code> field.
     *
     * @param obj the object to extract the <code>symbol</code> value
     * from
     * @return the value of the <code>symbol</code> field
     * @see       Field#get
     */
    getSymbol(obj: any): symbol;
    /**
     * Sets the field represented by this <code>Field</code> object on the
     * specified object argument to the specified new value. The new
     * value is automatically unwrapped if the underlying field has a
     * primitive type.
     *
     * <p>The operation proceeds as follows:
     *
     * <p>If the underlying field is static, the <code>obj</code> argument is
     * ignored; it may be null.
     *
     * <p>Otherwise the underlying field is an instance field.  If the
     * specified object argument is null, the method throws a
     * <code>NullPointerException</code>.  If the specified object argument is not
     * an instance of the class or interface declaring the underlying
     * field, the method throws an <code>IllegalArgumentException</code>.
     *
     * <p>If this <code>Field</code> object enforces Java language access control, and
     * the underlying field is inaccessible, the method throws an
     * <code>IllegalAccessException</code>.
     *
     * <p>If the underlying field is final, the method throws an
     * <code>IllegalAccessException</code> unless
     * <code>setAccessible(true)</code> has succeeded for this field
     * and this field is non-static. Setting a final field in this way
     * is meaningful only during deserialization or reconstruction of
     * instances of classes with blank final fields, before they are
     * made available for access by other parts of a program. Use in
     * any other context may have unpredictable effects, including cases
     * in which other parts of a program continue to use the original
     * value of this field.
     *
     * <p>If the underlying field is of a primitive type, an unwrapping
     * conversion is attempted to convert the new value to a value of
     * a primitive type.  If this attempt fails, the method throws an
     * <code>IllegalArgumentException</code>.
     *
     * <p>If, after possible unwrapping, the new value cannot be
     * converted to the type of the underlying field by an identity or
     * widening conversion, the method throws an
     * <code>IllegalArgumentException</code>.
     *
     * <p>If the underlying field is static, the class that declared the
     * field is initialized if it has not already been initialized.
     *
     * <p>The field is set to the possibly unwrapped and widened new value.
     *
     * <p>If the field is hidden in the type of <code>obj</code>,
     * the field's value is set according to the preceding rules.
     *
     * @param obj the object whose field should be modified
     * @param value the new value for the field of <code>obj</code>
     * being modified
     * @return A Boolean indicating whether setting the property was successful.
     */
    set(obj: any, value: any): boolean;
    /**
     * Sets the value of a field as a <code>bigint</code> on the specified object.
     *
     * @param obj the object whose field should be modified
     * @param value  the new value for the field of <code>obj</code>
     * being modified
     * @return A Boolean indicating whether setting the property was successful
     * @see       Field#set
     */
    setBigInt(obj: any, value: bigint): boolean;
    /**
     * Sets the value of a field as a <code>boolean</code> on the specified object.
     *
     * @param obj the object whose field should be modified
     * @param value   the new value for the field of <code>obj</code>
     * being modified
     * @return A Boolean indicating whether setting the property was successful
     * @see       Field#set
     */
    setBoolean(obj: any, value: boolean): boolean;
    /**
     * Sets the value of a field as a <code>number</code> on the specified object..
     *
     * @param obj the object whose field should be modified
     * @param value  the new value for the field of <code>obj</code>
     * being modified
     * @return A Boolean indicating whether setting the property was successful
     * @see       Field#set
     */
    setNumber(obj: any, value: number): boolean;
    /**
     * Sets the value of a field as a <code>string</code> on the specified object.
     *
     * @param obj the object whose field should be modified
     * @param value   the new value for the field of <code>obj</code>
     * being modified
     * @return A Boolean indicating whether setting the property was successful
     * @see       Field#set
     */
    setString(obj: any, value: string): boolean;
    /**
     * Sets the value of a field as a <code>symbol</code> on the specified object.
     *
     * @param obj the object whose field should be modified
     * @param value   the new value for the field of <code>obj</code>
     * being modified
     * @return A Boolean indicating whether setting the property was successful
     * @see       Field#set
     */
    setSymbol(obj: any, value: symbol): boolean;
}
export default Field;
