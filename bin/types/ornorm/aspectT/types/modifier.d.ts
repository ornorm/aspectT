/**
 * The <code>int</code> value representing the <code>export</code>
 * modifier.
 */
export declare const EXPORT: string;
/**
 * The <code>int</code> value representing the <code>default</code>
 * modifier.
 */
export declare const DEFAULT: string;
/**
 * The <code>int</code> value representing the <code>declare</code>
 * modifier.
 */
export declare const DECLARE: string;
/**
 * The <code>int</code> value representing the <code>abstract</code>
 * modifier.
 */
export declare const ABSTRACT: string;
/**
 * The <code>int</code> value representing the <code>public</code>
 * modifier.
 */
export declare const PUBLIC: string;
/**
 * The <code>int</code> value representing the <code>protected</code>
 * modifier.
 */
export declare const PROTECTED: string;
/**
 * The <code>int</code> value representing the <code>private</code>
 * modifier.
 */
export declare const PRIVATE: string;
/**
 * The <code>int</code> value representing the <code>readonly</code>
 * modifier.
 */
export declare const READ_ONLY: string;
/**
 * The <code>int</code> value representing the <code>static</code>
 * modifier.
 */
export declare const STATIC: string;
/**
 * The <code>int</code> value representing the <code>async</code>
 * modifier.
 */
export declare const ASYNC: string;
/**
 * The <code>int</code> value representing the <code>const</code>
 * modifier.
 */
export declare const CONST: string;
/**
 * The <code>int</code> value representing the <code>override</code>
 * modifier.
 */
export declare const OVERRIDE: string;
/**
 * The <code>int</code> value representing the <code>in</code>
 * modifier.
 */
export declare const IN: string;
/**
 * The <code>int</code> value representing the <code>out</code>
 * modifier.
 */
export declare const OUT: string;
/**
 * The <code>int</code> value representing the <code>@</code>
 * modifier.
 */
export declare const DECORATOR: string;
/**
 *
 */
export declare class Modifier {
    /**
     * Return <tt>true</tt> if the number argument includes the
     * <tt>public</tt>, <tt>protected</tt> or <tt>private</tt> modifier,
     * <tt>false</tt> otherwise.
     *
     * @param    mod a set of modifiers
     * @return <tt>true</tt> if <code>mod</code> includes the
     * <tt>public</tt>, <tt>protected</tt> or <tt>private</tt> modifier;
     * <tt>false</tt> otherwise.
     */
    static isAccessibilityModifier(mod: string): boolean;
    /**
     * Return <tt>true</tt> if the number argument includes the
     * <tt>public</tt>, <tt>protected</tt>, <tt>private</tt> or
     * <tt>readonly</tt> modifier, <tt>false</tt> otherwise.
     *
     * @param    mod a set of modifiers
     * @return <tt>true</tt> if <code>mod</code> includes the
     * <tt>public</tt>, <tt>protected</tt>, <tt>private</tt> or
     * <tt>readonly</tt> modifier; <tt>false</tt> otherwise.
     */
    static isParameterModifier(mod: string): boolean;
    /**
     * Return <tt>true</tt> if the number argument includes the
     * <tt>public</tt>, <tt>protected</tt>, <tt>private</tt>,
     * <tt>readonly</tt> or <tt>static</tt> modifier,
     * <tt>false</tt> otherwise.
     *
     * @param    mod a set of modifiers
     * @return <tt>true</tt> if <code>mod</code> includes the
     * <tt>public</tt>, <tt>protected</tt>, <tt>private</tt>,
     * <tt>readonly</tt> or <tt>static</tt> modifier; <tt>false</tt>
     * otherwise.
     */
    static isClassMemberModifier(mod: string): boolean;
    /**
     * Return <tt>true</tt> if the number argument includes the
     * <tt>export</tt> modifier, <tt>false</tt> otherwise.
     *
     * @param    mod a set of modifiers
     * @return <tt>true</tt> if <code>mod</code> includes the
     * <tt>export</tt> modifier; <tt>false</tt> otherwise.
     */
    static isExport(mod: string): boolean;
    /**
     * Return <tt>true</tt> if the number argument includes the
     * <tt>default</tt> modifier, <tt>false</tt> otherwise.
     *
     * @param    mod a set of modifiers
     * @return <tt>true</tt> if <code>mod</code> includes the
     * <tt>default</tt> modifier; <tt>false</tt> otherwise.
     */
    static isDefault(mod: string): boolean;
    /**
     * Return <tt>true</tt> if the number argument includes the
     * <tt>declare</tt> modifier, <tt>false</tt> otherwise.
     *
     * @param    mod a set of modifiers
     * @return <tt>true</tt> if <code>mod</code> includes the
     * <tt>declare</tt> modifier; <tt>false</tt> otherwise.
     */
    static isDeclare(mod: string): boolean;
    /**
     * Return <tt>true</tt> if the number argument includes the
     * <tt>abstract</tt> modifier, <tt>false</tt> otherwise.
     *
     * @param    mod a set of modifiers
     * @return <tt>true</tt> if <code>mod</code> includes the
     * <tt>abstract</tt> modifier; <tt>false</tt> otherwise.
     */
    static isAbstract(mod: string): boolean;
    /**
     * Return <tt>true</tt> if the number argument includes the
     * <tt>public</tt> modifier, <tt>false</tt> otherwise.
     *
     * @param    mod a set of modifiers
     * @return <tt>true</tt> if <code>mod</code> includes the
     * <tt>public</tt> modifier; <tt>false</tt> otherwise.
     */
    static isPublic(mod: string): boolean;
    /**
     * Return <tt>true</tt> if the number argument includes the
     * <tt>protected</tt> modifier, <tt>false</tt> otherwise.
     *
     * @param    mod a set of modifiers
     * @return <tt>true</tt> if <code>mod</code> includes the
     * <tt>protected</tt> modifier; <tt>false</tt> otherwise.
     */
    static isProtected(mod: string): boolean;
    /**
     * Return <tt>true</tt> if the number argument includes the
     * <tt>private</tt> modifier, <tt>false</tt> otherwise.
     *
     * @param    mod a set of modifiers
     * @return <tt>true</tt> if <code>mod</code> includes the
     * <tt>private</tt> modifier; <tt>false</tt> otherwise.
     */
    static isPrivate(mod: string): boolean;
    /**
     * Return <tt>true</tt> if the number argument includes the
     * <tt>readonly</tt> modifier, <tt>false</tt> otherwise.
     *
     * @param    mod a set of modifiers
     * @return <tt>true</tt> if <code>mod</code> includes the
     * <tt>readonly</tt> modifier; <tt>false</tt> otherwise.
     */
    static isReadOnly(mod: string): boolean;
    /**
     * Return <tt>true</tt> if the number argument includes the
     * <tt>static</tt> modifier, <tt>false</tt> otherwise.
     *
     * @param    mod a set of modifiers
     * @return <tt>true</tt> if <code>mod</code> includes the
     * <tt>static</tt> modifier; <tt>false</tt> otherwise.
     */
    static isStatic(mod: string): boolean;
    /**
     * Return <tt>true</tt> if the number argument includes the
     * <tt>async</tt> modifier, <tt>false</tt> otherwise.
     *
     * @param    mod a set of modifiers
     * @return <tt>true</tt> if <code>mod</code> includes the
     * <tt>async</tt> modifier; <tt>false</tt> otherwise.
     */
    static isAsync(mod: string): boolean;
    /**
     * Return <tt>true</tt> if the number argument includes the
     * <tt>const</tt> modifier, <tt>false</tt> otherwise.
     *
     * @param    mod a set of modifiers
     * @return <tt>true</tt> if <code>mod</code> includes the
     * <tt>const</tt> modifier; <tt>false</tt> otherwise.
     */
    static isConst(mod: string): boolean;
    /**
     * Return <tt>true</tt> if the number argument includes the
     * <tt>override</tt> modifier, <tt>false</tt> otherwise.
     *
     * @param    mod a set of modifiers
     * @return <tt>true</tt> if <code>mod</code> includes the
     * <tt>override</tt> modifier; <tt>false</tt> otherwise.
     */
    static isOverride(mod: string): boolean;
    /**
     * Return <tt>true</tt> if the number argument includes the
     * <tt>in</tt> modifier, <tt>false</tt> otherwise.
     *
     * @param    mod a set of modifiers
     * @return <tt>true</tt> if <code>mod</code> includes the
     * <tt>in</tt> modifier; <tt>false</tt> otherwise.
     */
    static isIn(mod: string): boolean;
    /**
     * Return <tt>true</tt> if the number argument includes the
     * <tt>out</tt> modifier, <tt>false</tt> otherwise.
     *
     * @param    mod a set of modifiers
     * @return <tt>true</tt> if <code>mod</code> includes the
     * <tt>out</tt> modifier; <tt>false</tt> otherwise.
     */
    static isOut(mod: string): boolean;
    /**
     * Return <tt>true</tt> if the number argument includes the
     * <tt>@</tt> modifier, <tt>false</tt> otherwise.
     *
     * @param    mod a set of modifiers
     * @return <tt>true</tt> if <code>mod</code> includes the
     * <tt>@</tt> modifier; <tt>false</tt> otherwise.
     */
    static isDecorator(mod: string): boolean;
}
export default Modifier;
