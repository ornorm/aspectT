import {ParameterDescriptor} from '@ornorm/aspectT';

/**
 *
 * @see ParameterDescriptor
 */
export class Parameter implements ParameterDescriptor {
    private readonly mIndex: number;
    private readonly mIsOptional: boolean;
    private readonly mIsRestParameter: boolean;
    private readonly mModifiers: Array<string>;
    private readonly mName: string;
    private readonly mType: string;

    /**
     *
     * @param descriptor
     */
    constructor(
        descriptor: ParameterDescriptor
    ) {
        this.mIndex = descriptor.index;
        this.mIsOptional = descriptor.isOptional;
        this.mIsRestParameter = descriptor.isRestParameter;
        this.mModifiers = descriptor.modifiers;
        this.mName = descriptor.name;
        this.mType = descriptor.type;
    }

    /**
     * Index of parameter.
     */
    public get index(): number {
        return this.mIndex;
    }

    /**
     * True when optional.
     */
    public get isOptional(): boolean {
        return this.mIsOptional;
    }

    /**
     * True when rest parameter.
     */
    public get isRestParameter(): boolean {
        return this.mIsRestParameter;
    }

    /**
     * List of modifiers.
     */
    public get modifiers(): Array<string> {
        return this.mModifiers;
    }

    /**
     * Parameter name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Parameter type.
     */
    public get type(): string {
        return this.mType;
    }
}

export default Parameter;
