/**
 * Retrieves a configuration value from the environment variables.
 *
 * @param key - The key of the configuration value.
 * @param defaultValue - The default value to return if the key is not found.
 * @returns The configuration value as a `string`.
 */
declare function getenv(key: string, defaultValue?: string): string;
/**
 * Retrieves an `array` configuration value from the environment variables.
 *
 * @param key - The key of the configuration value.
 * @param defaultValue - The default value to return if the key is not found.
 * @returns The configuration value as an `array`.
 */
declare function getenv_array(key: string, defaultValue: any[]): any[];
/**
 * Retrieves a `BigInt` configuration value from the environment variables.
 *
 * @param key - The key of the configuration value.
 * @param defaultValue - The default value to return if the key is not found.
 * @returns The configuration value as a `BigInt`.
 */
declare function getenv_bigInt(key: string, defaultValue: bigint): bigint;
/**
 * Retrieves a `boolean` configuration value from the environment variables.
 *
 * @param key - The key of the configuration value.
 * @param defaultValue - The default value to return if the key is not found.
 * @returns The configuration value as a `boolean`.
 */
declare function getenv_boolean(key: string, defaultValue: boolean): boolean;
/**
 * Retrieves a `float` configuration value from the environment variables.
 *
 * @param key - The key of the configuration value.
 * @param defaultValue - The default value to return if the key is not found.
 * @returns The configuration value as a `float`.
 */
declare function getenv_float(key: string, defaultValue: number): number;
/**
 * Retrieves an `int` configuration value from the environment variables.
 *
 * @param key - The key of the configuration value.
 * @param defaultValue - The default value to return if the key is not found.
 * @returns The configuration value as an `int`.
 */
declare function getenv_int(key: string, defaultValue: number): number;
/**
 * Retrieves an `object` configuration value from the environment variables.
 *
 * @param key - The key of the configuration value.
 * @param defaultValue - The default value to return if the key is not found.
 * @returns The configuration value as an `object`.
 */
declare function getenv_object(key: string, defaultValue: object): object;
/**
 * Retrieves a `string` configuration value from the environment variables.
 *
 * @param key - The key of the configuration value.
 * @param defaultValue - The default value to return if the key is not found.
 * @returns The configuration value as a `string`.
 */
declare function getenv_string(key: string, defaultValue: string): string;
/**
 * Retrieves a `Symbol` configuration value from the environment variables.
 *
 * @param key - The key of the configuration value.
 * @param defaultValue - The default value to return if the key is not found.
 * @returns The configuration value as a `Symbol`.
 */
declare function getenv_symbol(key: string, defaultValue: symbol): symbol;
/**
 * Checks if a given `key` exists in the environment variables.
 *
 * @param key - The key to check for existence.
 * @returns `true` if the key exists, `false` otherwise.
 */
declare function ifdef(key: string): boolean;
/**
 * Checks if a given `key` does not exist in the environment variables.
 *
 * @param key - The key to check for non-existence.
 * @returns `true` if the key does not exist, `false` otherwise.
 */
declare function ifndef(key: string): boolean;
export { getenv, getenv_array, getenv_bigInt, getenv_boolean, getenv_float, getenv_int, getenv_object, getenv_string, getenv_symbol, ifdef, ifndef };
