
import { threadId } from 'worker_threads';
import { hrtime } from 'process';
import { ElogErrCode } from '../inc/index';
/**
 * EasyLogger port initialize
 *
 * @return result
 */
export function elog_port_init(): ElogErrCode {
    const result: ElogErrCode = ElogErrCode.ELOG_NO_ERR;

    /* add your code here */

    return result;
}

/**
 * EasyLogger port deinitialize
 *
 */
export function elog_port_deinit(): void {
    /* add your code here */
}

/**
 * output log port interface
 *
 * @param log output of log
 * @param size log size
 */
export function elog_port_output(char: string, log: any, size_t: number, size: number): void {

    /* add your code here */

}

/**
 * output lock
 */
export function elog_port_output_lock(): void {
    /* add your code here */
}

/**
 * output unlock
 */
export function elog_port_output_unlock(): void {
    /* add your code here */
}

/**
 * get current time interface
 *
 * @return current time
 */
export function elog_port_get_time(): string {
    const time: [number, number] = hrtime();
    const seconds: number = time[0];
    const nanoseconds: number = time[1];
    return `${seconds}s ${nanoseconds / 1e6}ms`;
}

/**
 * get current process name interface
 *
 * @return current process name
 */
export function elog_port_get_p_info(): string | null {
    return process.title;
}

/**
 * get current thread name interface
 *
 * @return current thread name
 */
export function elog_port_get_t_info(): string | null {
    return `${threadId}`;
}
