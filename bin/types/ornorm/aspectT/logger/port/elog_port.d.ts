import { ElogErrCode } from 'src/ornorm/aspectT/logger';
/**
 * EasyLogger port initialize
 *
 * @return result
 */
export declare function elog_port_init(): ElogErrCode;
/**
 * EasyLogger port deinitialize
 *
 */
export declare function elog_port_deinit(): void;
/**
 * output log port interface
 *
 * @param log output of log
 * @param size log size
 */
export declare function elog_port_output(char: string, log: any, size_t: number, size: number): void;
/**
 * output lock
 */
export declare function elog_port_output_lock(): void;
/**
 * output unlock
 */
export declare function elog_port_output_unlock(): void;
/**
 * get current time interface
 *
 * @return current time
 */
export declare function elog_port_get_time(): string;
/**
 * get current process name interface
 *
 * @return current process name
 */
export declare function elog_port_get_p_info(): string | null;
/**
 * get current thread name interface
 *
 * @return current thread name
 */
export declare function elog_port_get_t_info(): string | null;
