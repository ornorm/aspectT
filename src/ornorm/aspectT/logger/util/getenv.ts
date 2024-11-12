
/**
 * Retrieves a configuration value from the environment variables.
 *
 * @param key - The key of the configuration value.
 * @param defaultValue - The default value to return if the key is not found.
 * @returns The configuration value as a `string`.
 */
function getenv(key: string, defaultValue: string = ''): string {
    return ifdef(key) ? Reflect.get(process.env, key) as string : defaultValue;
}

/**
 * Retrieves an `array` configuration value from the environment variables.
 *
 * @param key - The key of the configuration value.
 * @param defaultValue - The default value to return if the key is not found.
 * @returns The configuration value as an `array`.
 */
function getenv_array(key: string, defaultValue: any[]): any[] {
    return ifdef(key) ? JSON.parse(getenv(key, '[]')) : defaultValue;
}

/**
 * Retrieves a `BigInt` configuration value from the environment variables.
 *
 * @param key - The key of the configuration value.
 * @param defaultValue - The default value to return if the key is not found.
 * @returns The configuration value as a `BigInt`.
 */
function getenv_bigInt(key: string, defaultValue: bigint): bigint {
    return ifdef(key) ? BigInt(getenv(key, '0')) : defaultValue;
}

/**
 * Retrieves a `boolean` configuration value from the environment variables.
 *
 * @param key - The key of the configuration value.
 * @param defaultValue - The default value to return if the key is not found.
 * @returns The configuration value as a `boolean`.
 */
function getenv_boolean(key: string, defaultValue: boolean): boolean {
    return ifdef(key) ? getenv(key, 'false') === 'true' : defaultValue;
}

/**
 * Retrieves a `float` configuration value from the environment variables.
 *
 * @param key - The key of the configuration value.
 * @param defaultValue - The default value to return if the key is not found.
 * @returns The configuration value as a `float`.
 */
function getenv_float(key: string, defaultValue: number): number {
    return ifdef(key) ? parseFloat(getenv(key, '0')) : defaultValue;
}

/**
 * Retrieves an `int` configuration value from the environment variables.
 *
 * @param key - The key of the configuration value.
 * @param defaultValue - The default value to return if the key is not found.
 * @returns The configuration value as an `int`.
 */
function getenv_int(key: string, defaultValue: number): number {
    return ifdef(key) ? parseInt(getenv(key, '0'), 10) : defaultValue;
}

/**
 * Retrieves an `object` configuration value from the environment variables.
 *
 * @param key - The key of the configuration value.
 * @param defaultValue - The default value to return if the key is not found.
 * @returns The configuration value as an `object`.
 */
function getenv_object(key: string, defaultValue: object): object {
    return ifdef(key) ? JSON.parse(getenv(key, '{}')) : defaultValue;
}

/**
 * Retrieves a `string` configuration value from the environment variables.
 *
 * @param key - The key of the configuration value.
 * @param defaultValue - The default value to return if the key is not found.
 * @returns The configuration value as a `string`.
 */
function getenv_string(key: string, defaultValue: string): string {
    return getenv(key, defaultValue);
}

/**
 * Retrieves a `Symbol` configuration value from the environment variables.
 *
 * @param key - The key of the configuration value.
 * @param defaultValue - The default value to return if the key is not found.
 * @returns The configuration value as a `Symbol`.
 */
function getenv_symbol(key: string, defaultValue: symbol): symbol {
    return ifdef(key) ? Symbol(getenv(key)) : defaultValue;
}

/**
 * Checks if a given `key` exists in the environment variables.
 *
 * @param key - The key to check for existence.
 * @returns `true` if the key exists, `false` otherwise.
 */
function ifdef(key: string): boolean {
    return Reflect.has(process.env, key);
}

/**
 * Checks if a given `key` does not exist in the environment variables.
 *
 * @param key - The key to check for non-existence.
 * @returns `true` if the key does not exist, `false` otherwise.
 */
function ifndef(key: string): boolean {
    return !Reflect.has(process.env, key);
}

export {
    getenv,
    getenv_array,
    getenv_bigInt,
    getenv_boolean,
    getenv_float,
    getenv_int,
    getenv_object,
    getenv_string,
    getenv_symbol,
    ifdef,
    ifndef
}
