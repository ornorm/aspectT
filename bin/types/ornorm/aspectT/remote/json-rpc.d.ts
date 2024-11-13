/**
 * @file json-rpc.ts
 * @description This file contains the type definitions and interfaces for
 * JSON-RPC 2.0 protocol.
 *
 * JSON-RPC is a stateless, light-weight remote procedure call (RPC)
 * protocol.
 *
 * Primarily this specification defines several data structures and the
 * rules around their processing.
 *
 * It is transport agnostic in that the concepts can be used within the
 * same process, over sockets, over http, or in many various message
 * passing environments. It uses JSON (RFC 4627) as data format.
 * @license MIT
 */
/**
 * @description A String specifying the version of the `JSON-RPC` protocol.
 *
 * `MUST` be exactly '2.0'.
 */
export type JsonRpcVersion = '2.0';
/**
 * @description A Structured value that holds the parameter values to
 * be used during the invocation of the method.
 *
 * Can be either an array (by-position) or an object (by-name).
 */
export type Params = Array<any> | Record<string, any>;
/**
 * @description An identifier established by the Client that `MUST`
 * contain a `String`, `Number`, or `NULL` value if included.
 */
export type Id = string | number | null;
/**
 * @description A Request object for `JSON-RPC 2.0`.
 */
export interface Request {
    /**
     * The `JSON-RPC` version.
     *
     * `MUST` be exactly '2.0'.
     * @see JsonRpcVersion
     */
    readonly jsonrpc: JsonRpcVersion;
    /** The name of the method to be invoked. */
    readonly method: string;
    /**
     * The parameter values to be used during the invocation of the method.
     *
     * This member `MAY` be omitted.
     * @see Params
     */
    params?: Params;
    /**
     * An identifier established by the Client.
     *
     * If omitted, it is assumed to be a notification.
     */
    id?: Id;
}
/**
 * @description A Notification object for `JSON-RPC 2.0`.
 *
 * It is a `Request object` without an `id` member.
 */
export type Notification = Omit<Request, 'id'>;
/**
 * @description A Response object for JSON-RPC 2.0.
 */
export interface Response {
    /**
     * The `JSON-RPC` version.
     *
     * MUST be exactly `2.0`.
     * @see JsonRpcVersion
     */
    readonly jsonrpc: JsonRpcVersion;
    /**
     * The result of the method invocation.
     *
     * This member is `REQUIRED` on success.
     */
    result?: any;
    /**
     * The `error object` if an error occurred during the method invocation.
     *
     * This member is `REQUIRED` on error.
     * @see ErrorObject
     */
    error?: ErrorObject;
    /**
     * The identifier of the Request object.
     *
     * `MUST` be the same as the value of the id member in the `Request
     * object`.
     */
    readonly id: Id;
}
/**
 * @description An Error object for `JSON-RPC 2.0`.
 */
export interface ErrorObject {
    /**
     * A Number that indicates the error type that occurred.
     *
     * This `MUST` be an integer.
     */
    readonly code: number;
    /** A String providing a short description of the error. */
    readonly message: string;
    /**
     * Additional information about the error.
     *
     * This may be omitted.
     */
    data?: any;
}
/**
 * @description Pre-defined error codes for `JSON-RPC 2.0`.
 */
export declare enum ErrorCode {
    /**
     * @description Invalid JSON was received by the server.
     * An error occurred on the server while parsing the JSON text.
     */
    ParseError = -32700,
    /**
     * @description The JSON sent is not a valid Request object.
     */
    InvalidRequest = -32600,
    /**
     * @description The method does not exist or is not available.
     */
    MethodNotFound = -32601,
    /**
     * @description Invalid method parameter(s).
     */
    InvalidParams = -32602,
    /**
     * @description Internal JSON-RPC error.
     */
    InternalError = -32603,
    /**
     * @description Reserved for implementation-defined server-errors.
     */
    ServerError = -32000
}
/**
 * @description A Batch request for `JSON-RPC 2.0`.
 *
 * It is an array of Request objects.
 */
export type BatchRequest = Array<Request>;
/**
 * @description A Batch response for `JSON-RPC 2.0`.
 *
 * It is an array of Response objects.
 */
export type BatchResponse = Array<Response>;
