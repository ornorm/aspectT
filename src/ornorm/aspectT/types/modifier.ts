/**
 * The <code>int</code> value representing the <code>export</code>
 * modifier.
 */
export const EXPORT: string = 'export';

/**
 * The <code>int</code> value representing the <code>default</code>
 * modifier.
 */
export const DEFAULT: string = 'default';

/**
 * The <code>int</code> value representing the <code>declare</code>
 * modifier.
 */
export const DECLARE: string = 'declare';

/**
 * The <code>int</code> value representing the <code>abstract</code>
 * modifier.
 */
export const ABSTRACT: string = 'abstract';

/**
 * The <code>int</code> value representing the <code>public</code>
 * modifier.
 */
export const PUBLIC: string = 'public';

/**
 * The <code>int</code> value representing the <code>protected</code>
 * modifier.
 */
export const PROTECTED: string = 'protected';

/**
 * The <code>int</code> value representing the <code>private</code>
 * modifier.
 */
export const PRIVATE: string = 'private';

/**
 * The <code>int</code> value representing the <code>readonly</code>
 * modifier.
 */
export const READ_ONLY: string = 'readonly';

/**
 * The <code>int</code> value representing the <code>static</code>
 * modifier.
 */
export const STATIC: string = 'static';

/**
 * The <code>int</code> value representing the <code>async</code>
 * modifier.
 */
export const ASYNC: string = 'async';

/**
 * The <code>int</code> value representing the <code>const</code>
 * modifier.
 */
export const CONST: string = 'const';

/**
 * The <code>int</code> value representing the <code>override</code>
 * modifier.
 */
export const OVERRIDE: string = 'override';

/**
 * The <code>int</code> value representing the <code>in</code>
 * modifier.
 */
export const IN: string = 'in';

/**
 * The <code>int</code> value representing the <code>out</code>
 * modifier.
 */
export const OUT: string = 'out';

/**
 * The <code>int</code> value representing the <code>@</code>
 * modifier.
 */
export const DECORATOR: string = '@';

const EXPORT_REG: RegExp = new RegExp(`^${EXPORT}$`, 'g');
const DEFAULT_REG: RegExp = new RegExp(`^${DEFAULT}$`, 'g');
const DECLARE_REG: RegExp = new RegExp(`^${DECLARE}$`, 'g');
const ABSTRACT_REG: RegExp = new RegExp(`^${ABSTRACT}$`, 'g');
const PUBLIC_REG: RegExp = new RegExp(`^${PUBLIC}$`, 'g');
const PROTECTED_REG: RegExp = new RegExp(`^${PROTECTED}$`, 'g');
const PRIVATE_REG: RegExp = new RegExp(`^${PRIVATE}$`, 'g');
const READONLY_REG: RegExp = new RegExp(`^${READ_ONLY}$`, 'g');
const STATIC_REG: RegExp = new RegExp(`^${STATIC}$`, 'g');
const ASYNC_REG: RegExp = new RegExp(`^${ASYNC}$`, 'g');
const CONST_REG: RegExp = new RegExp(`^${CONST}$`, 'g');
const OVERRIDE_REG: RegExp = new RegExp(`^${OVERRIDE}$`, 'g');
const IN_REG: RegExp = new RegExp(`^${IN}$`, 'g');
const OUT_REG: RegExp = new RegExp(`^${OUT}$`, 'g');
const DECORATOR_REG: RegExp = new RegExp(`^${DECORATOR}$`, 'g');

/**
 *
 */
export class Modifier {

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
    public static isAccessibilityModifier(mod: string): boolean {
        return Modifier.isPublic(mod) || Modifier.isProtected(mod) || Modifier.isPrivate(mod);
    }

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
    public static isParameterModifier(mod: string): boolean {
        return Modifier.isAccessibilityModifier(mod) || Modifier.isReadOnly(mod);
    }

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
    public static isClassMemberModifier(mod: string): boolean {
        return Modifier.isParameterModifier(mod) || Modifier.isReadOnly(mod) || Modifier.isStatic(mod);
    }

    /**
     * Return <tt>true</tt> if the number argument includes the
     * <tt>export</tt> modifier, <tt>false</tt> otherwise.
     *
     * @param    mod a set of modifiers
     * @return <tt>true</tt> if <code>mod</code> includes the
     * <tt>export</tt> modifier; <tt>false</tt> otherwise.
     */
    public static isExport(mod: string): boolean {
        return EXPORT_REG.test(mod);
    }

    /**
     * Return <tt>true</tt> if the number argument includes the
     * <tt>default</tt> modifier, <tt>false</tt> otherwise.
     *
     * @param    mod a set of modifiers
     * @return <tt>true</tt> if <code>mod</code> includes the
     * <tt>default</tt> modifier; <tt>false</tt> otherwise.
     */
    public static isDefault(mod: string): boolean {
        return DEFAULT_REG.test(mod);
    }

    /**
     * Return <tt>true</tt> if the number argument includes the
     * <tt>declare</tt> modifier, <tt>false</tt> otherwise.
     *
     * @param    mod a set of modifiers
     * @return <tt>true</tt> if <code>mod</code> includes the
     * <tt>declare</tt> modifier; <tt>false</tt> otherwise.
     */
    public static isDeclare(mod: string): boolean {
        return DECLARE_REG.test(mod);
    }

    /**
     * Return <tt>true</tt> if the number argument includes the
     * <tt>abstract</tt> modifier, <tt>false</tt> otherwise.
     *
     * @param    mod a set of modifiers
     * @return <tt>true</tt> if <code>mod</code> includes the
     * <tt>abstract</tt> modifier; <tt>false</tt> otherwise.
     */
    public static isAbstract(mod: string): boolean {
        return ABSTRACT_REG.test(mod);
    }

    /**
     * Return <tt>true</tt> if the number argument includes the
     * <tt>public</tt> modifier, <tt>false</tt> otherwise.
     *
     * @param    mod a set of modifiers
     * @return <tt>true</tt> if <code>mod</code> includes the
     * <tt>public</tt> modifier; <tt>false</tt> otherwise.
     */
    public static isPublic(mod: string): boolean {
        return PUBLIC_REG.test(mod);
    }

    /**
     * Return <tt>true</tt> if the number argument includes the
     * <tt>protected</tt> modifier, <tt>false</tt> otherwise.
     *
     * @param    mod a set of modifiers
     * @return <tt>true</tt> if <code>mod</code> includes the
     * <tt>protected</tt> modifier; <tt>false</tt> otherwise.
     */
    public static isProtected(mod: string): boolean {
        return PROTECTED_REG.test(mod);
    }

    /**
     * Return <tt>true</tt> if the number argument includes the
     * <tt>private</tt> modifier, <tt>false</tt> otherwise.
     *
     * @param    mod a set of modifiers
     * @return <tt>true</tt> if <code>mod</code> includes the
     * <tt>private</tt> modifier; <tt>false</tt> otherwise.
     */
    public static isPrivate(mod: string): boolean {
        return PRIVATE_REG.test(mod);
    }

    /**
     * Return <tt>true</tt> if the number argument includes the
     * <tt>readonly</tt> modifier, <tt>false</tt> otherwise.
     *
     * @param    mod a set of modifiers
     * @return <tt>true</tt> if <code>mod</code> includes the
     * <tt>readonly</tt> modifier; <tt>false</tt> otherwise.
     */
    public static isReadOnly(mod: string): boolean {
        return READONLY_REG.test(mod);
    }

    /**
     * Return <tt>true</tt> if the number argument includes the
     * <tt>static</tt> modifier, <tt>false</tt> otherwise.
     *
     * @param    mod a set of modifiers
     * @return <tt>true</tt> if <code>mod</code> includes the
     * <tt>static</tt> modifier; <tt>false</tt> otherwise.
     */
    public static isStatic(mod: string): boolean {
        return STATIC_REG.test(mod);
    }

    /**
     * Return <tt>true</tt> if the number argument includes the
     * <tt>async</tt> modifier, <tt>false</tt> otherwise.
     *
     * @param    mod a set of modifiers
     * @return <tt>true</tt> if <code>mod</code> includes the
     * <tt>async</tt> modifier; <tt>false</tt> otherwise.
     */
    public static isAsync(mod: string): boolean {
        return ASYNC_REG.test(mod);
    }

    /**
     * Return <tt>true</tt> if the number argument includes the
     * <tt>const</tt> modifier, <tt>false</tt> otherwise.
     *
     * @param    mod a set of modifiers
     * @return <tt>true</tt> if <code>mod</code> includes the
     * <tt>const</tt> modifier; <tt>false</tt> otherwise.
     */
    public static isConst(mod: string): boolean {
        return CONST_REG.test(mod);
    }

    /**
     * Return <tt>true</tt> if the number argument includes the
     * <tt>override</tt> modifier, <tt>false</tt> otherwise.
     *
     * @param    mod a set of modifiers
     * @return <tt>true</tt> if <code>mod</code> includes the
     * <tt>override</tt> modifier; <tt>false</tt> otherwise.
     */
    public static isOverride(mod: string): boolean {
        return OVERRIDE_REG.test(mod);
    }

    /**
     * Return <tt>true</tt> if the number argument includes the
     * <tt>in</tt> modifier, <tt>false</tt> otherwise.
     *
     * @param    mod a set of modifiers
     * @return <tt>true</tt> if <code>mod</code> includes the
     * <tt>in</tt> modifier; <tt>false</tt> otherwise.
     */
    public static isIn(mod: string): boolean {
        return IN_REG.test(mod);
    }

    /**
     * Return <tt>true</tt> if the number argument includes the
     * <tt>out</tt> modifier, <tt>false</tt> otherwise.
     *
     * @param    mod a set of modifiers
     * @return <tt>true</tt> if <code>mod</code> includes the
     * <tt>out</tt> modifier; <tt>false</tt> otherwise.
     */
    public static isOut(mod: string): boolean {
        return OUT_REG.test(mod);
    }

    /**
     * Return <tt>true</tt> if the number argument includes the
     * <tt>@</tt> modifier, <tt>false</tt> otherwise.
     *
     * @param    mod a set of modifiers
     * @return <tt>true</tt> if <code>mod</code> includes the
     * <tt>@</tt> modifier; <tt>false</tt> otherwise.
     */
    public static isDecorator(mod: string): boolean {
        return DECORATOR_REG.test(mod);
    }
}

export default Modifier;
