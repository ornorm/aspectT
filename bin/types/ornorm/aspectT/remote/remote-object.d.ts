/**
 * @file instrumentation.ts
 * @description This file contains the implementation of the Instrumentation class
 * which handles JSON-RPC 2.0 requests over a socket connection.
 *
 * The Instrumentation class sets up a server that listens for incoming
 * JSON-RPC requests, processes them, and sends back appropriate responses.
 *
 * It uses JSON (RFC 4627) as the data format and is transport agnostic,
 * meaning it can be used over various message passing environments.
 * @license MIT
 */
import { SocketInfo } from '@ornorm/aspectT';
/**
 * Class representing an instrumentation server that handles
 * `JSON-RPC 2.0` requests.
 */
export declare class RemoteObject {
    private static TAG;
    private server;
    private readonly proxy;
    private readonly revoke;
    /**
     * Create an instrumentation remote object server.
     * @param target - The target object to be proxied.
     * @param port - The port number on which the server will listen.
     */
    constructor(target: any);
    /**
     * Get the socket information from the debug environment.
     * @see SocketInfo
     */
    get socketInfo(): SocketInfo;
    /**
     * Start the instrumentation server.
     */
    start(): void;
    /**
     * Stop the instrumentation server and revoke the proxy.
     */
    stop(): void;
    /**
     * Handle incoming connections to the server.
     * @param socket - The socket representing the client connection.
     * @see Socket
     */
    private handleConnection;
    /**
     * Process incoming data from the socket.
     * @param socket - The socket representing the client connection.
     * @param data - The data received from the client.
     */
    private processData;
    /**
     * Handle a batch request.
     * @param socket - The socket representing the client connection.
     * @param requests - The array of `JSON-RPC` requests.
     * @see Socket
     * @see Request
     */
    private handleBatchRequest;
    /**
     * Handle a single request.
     * @param socket - The socket representing the client connection.
     * @param request - The `JSON-RPC` request object.
     * @see Socket
     * @see Request
     */
    private handleSingleRequest;
    /**
     * Handle a parse error.
     * @param socket - The socket representing the client connection.
     * @param error - The error object.
     * @see Socket
     */
    private handleParseError;
    /**
     * Handle a socket error.
     * @param socket - The socket representing the client connection.
     * @param error - The error object.
     * @see Socket
     * @see Error
     */
    private handleSocketError;
    /**
     * Send an error response to the client.
     * @param socket - The socket representing the client connection.
     * @param code - The error code.
     * @param message - The error message.
     * @param data - Additional error data (optional).
     * @see Socket
     */
    private sendErrorResponse;
    /**
     * Create an error response object.
     * @param code - The error code.
     * @param message - The error message.
     * @param data - Additional error data (optional).
     * @returns The `JSON-RPC` error response object.
     */
    private createErrorResponse;
    /**
     * Handle `JSON-RPC` requests and generate appropriate responses.
     * @param request - The `JSON-RPC` request object.
     * @returns The `JSON-RPC` response object.
     * @see Request
     * @see Response
     */
    private invoke;
    /**
     * Validate if the request is a valid `JSON-RPC` 2.0 request.
     * @param request - The `JSON-RPC` request object.
     * @returns True if the request is valid, false otherwise.
     */
    private isValidRequest;
    /**
     * Create an error object for ``JSON-RPC`` responses.
     * @param code - The error code.
     * @param message - The error message.
     * @param data - Additional error data (optional).
     * @returns The `JSON-RPC` error object.
     */
    private createError;
    /**
     * Create a `ProxyHandler` for the target object.
     *
     * @returns The `ProxyHandler` object.
     */
    private createHandler;
}
