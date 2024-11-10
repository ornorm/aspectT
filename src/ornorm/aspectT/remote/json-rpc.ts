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

/*
 * 7 Examples
 * Syntax:
 *
 * --> data sent to Server
 * <-- data sent to Client
 * rpc call with positional parameters:
 *
 * --> {"jsonrpc": "2.0", "method": "subtract", "params": [42, 23], "id": 1}
 * <-- {"jsonrpc": "2.0", "result": 19, "id": 1}
 *
 * --> {"jsonrpc": "2.0", "method": "subtract", "params": [23, 42], "id": 2}
 * <-- {"jsonrpc": "2.0", "result": -19, "id": 2}
 * rpc call with named parameters:
 *
 * --> {"jsonrpc": "2.0", "method": "subtract", "params": {"subtrahend": 23, "minuend": 42}, "id": 3}
 * <-- {"jsonrpc": "2.0", "result": 19, "id": 3}
 *
 * --> {"jsonrpc": "2.0", "method": "subtract", "params": {"minuend": 42, "subtrahend": 23}, "id": 4}
 * <-- {"jsonrpc": "2.0", "result": 19, "id": 4}
 * a Notification:
 *
 * --> {"jsonrpc": "2.0", "method": "update", "params": [1,2,3,4,5]}
 * --> {"jsonrpc": "2.0", "method": "foobar"}
 * rpc call of non-existent method:
 *
 * --> {"jsonrpc": "2.0", "method": "foobar", "id": "1"}
 * <-- {"jsonrpc": "2.0", "error": {"code": -32601, "message": "Method not found"}, "id": "1"}
 * rpc call with invalid JSON:
 *
 * --> {"jsonrpc": "2.0", "method": "foobar, "params": "bar", "baz]
 * <-- {"jsonrpc": "2.0", "error": {"code": -32700, "message": "Parse error"}, "id": null}
 * rpc call with invalid Request object:
 *
 * --> {"jsonrpc": "2.0", "method": 1, "params": "bar"}
 * <-- {"jsonrpc": "2.0", "error": {"code": -32600, "message": "Invalid Request"}, "id": null}
 * rpc call Batch, invalid JSON:
 *
 * --> [
 *   {"jsonrpc": "2.0", "method": "sum", "params": [1,2,4], "id": "1"},
 *   {"jsonrpc": "2.0", "method"
 * ]
 * <-- {"jsonrpc": "2.0", "error": {"code": -32700, "message": "Parse error"}, "id": null}
 * rpc call with an empty Array:
 * --> []
 * <-- {"jsonrpc": "2.0", "error": {"code": -32600, "message": "Invalid Request"}, "id": null}
 * rpc call with an invalid Batch (but not empty):
 * --> [1]
 * <-- [
 *   {"jsonrpc": "2.0", "error": {"code": -32600, "message": "Invalid Request"}, "id": null}
 * ]
 * rpc call with invalid Batch:
 *
 * --> [1,2,3]
 * <-- [
 *   {"jsonrpc": "2.0", "error": {"code": -32600, "message": "Invalid Request"}, "id": null},
 *   {"jsonrpc": "2.0", "error": {"code": -32600, "message": "Invalid Request"}, "id": null},
 *   {"jsonrpc": "2.0", "error": {"code": -32600, "message": "Invalid Request"}, "id": null}
 * ]
 * rpc call Batch:
 *
 * --> [
 *         {"jsonrpc": "2.0", "method": "sum", "params": [1,2,4], "id": "1"},
 *         {"jsonrpc": "2.0", "method": "notify_hello", "params": [7]},
 *         {"jsonrpc": "2.0", "method": "subtract", "params": [42,23], "id": "2"},
 *         {"foo": "boo"},
 *         {"jsonrpc": "2.0", "method": "foo.get", "params": {"name": "myself"}, "id": "5"},
 *         {"jsonrpc": "2.0", "method": "get_data", "id": "9"}
 *     ]
 * <-- [
 *         {"jsonrpc": "2.0", "result": 7, "id": "1"},
 *         {"jsonrpc": "2.0", "result": 19, "id": "2"},
 *         {"jsonrpc": "2.0", "error": {"code": -32600, "message": "Invalid Request"}, "id": null},
 *         {"jsonrpc": "2.0", "error": {"code": -32601, "message": "Method not found"}, "id": "5"},
 *         {"jsonrpc": "2.0", "result": ["hello", 5], "id": "9"}
 *     ]
 * rpc call Batch (all notifications):
 *
 * --> [
 *         {"jsonrpc": "2.0", "method": "notify_sum", "params": [1,2,4]},
 *         {"jsonrpc": "2.0", "method": "notify_hello", "params": [7]}
 *     ]
 * <-- //Nothing is returned for all notification batches
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
export enum ErrorCode {
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
