import { ParameterDescriptor } from '@ornorm/aspectT';
/**
 *
 * @see ParameterDescriptor
 */
export declare class Parameter implements ParameterDescriptor {
    private readonly mIndex;
    private readonly mIsOptional;
    private readonly mIsRestParameter;
    private readonly mModifiers;
    private readonly mName;
    private readonly mType;
    /**
     *
     * @param descriptor
     */
    constructor(descriptor: ParameterDescriptor);
    /**
     * Index of parameter.
     */
    get index(): number;
    /**
     * True when optional.
     */
    get isOptional(): boolean;
    /**
     * True when rest parameter.
     */
    get isRestParameter(): boolean;
    /**
     * List of modifiers.
     */
    get modifiers(): Array<string>;
    /**
     * Parameter name.
     */
    get name(): string;
    /**
     * Parameter type.
     */
    get type(): string;
}
export default Parameter;
