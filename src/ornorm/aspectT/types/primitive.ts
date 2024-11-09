const PRIMITIVE_REG: RegExp = new RegExp(
    '^(bigint|BigInt|boolean|Boolean|number|Number|string|String|symbol|Symbol)$',
    'g');

/**
 * Utility class for primitive?
 */
export class Primitive {
    /**
     * True when the specified type is primitive.
     *
     * @param type To be checked.
     * @return True when primitive
     */
    public static isPrimitive(type: string): boolean {
        return PRIMITIVE_REG.test(type);
    }
}

export default Primitive;
