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

import { createServer, Server, Socket } from 'net';
import { Request, Response, ErrorObject, ErrorCode } from '@ornorm/aspectT';

/**
 * Class representing an instrumentation server that handles
 * ``JSON-RPC` 2.0` requests.
 */
export class Instrumentation {
    private server: Server;
    private readonly port: number;
    private readonly proxy: any;
    private readonly revoke: () => void;

    /**
     * Create an instrumentation server.
     * @param target - The target object to be proxied.
     * @param port - The port number on which the server will listen.
     */
    constructor(target: any, port: number) {
        this.port = port;
        const { proxy, revoke } = Proxy.revocable(target, this.createHandler());
        this.proxy = proxy;
        this.revoke = revoke;
        this.server = createServer(this.handleConnection.bind(this));
    }

    /**
     * Start the instrumentation server.
     */
    public start(): void {
        this.server.listen(this.port, (): void => {
            console.log(`Instrumentation server listening on port ${this.port}`);
        });
    }

    /**
     * Stop the instrumentation server and revoke the proxy.
     */
    public stop(): void {
        this.server.close((): void => {
            console.log(`Instrumentation server stopped`);
        });
        this.revoke();
    }

    /**
     * Handle incoming connections to the server.
     * @param socket - The socket representing the client connection.
     * @see Socket
     */
    private handleConnection(socket: Socket): void {
        socket.on('data', (data: Buffer): void => {
            this.processData(socket, data);
        });

        socket.on('end', (): void => {
            console.log('Client disconnected');
        });

        socket.on('error', (err: Error): void => {
            this.handleSocketError(socket, err);
        });
    }

    /**
     * Process incoming data from the socket.
     * @param socket - The socket representing the client connection.
     * @param data - The data received from the client.
     */
    private processData(socket: Socket, data: Buffer): void {
        try {
            const requests: Array<Request> | Request = JSON.parse(data.toString().trim());
            if (Array.isArray(requests)) {
                this.handleBatchRequest(socket, requests);
            } else {
                this.handleSingleRequest(socket, requests);
            }
        } catch (e: any) {
            this.handleParseError(socket, e);
        }
    }

    /**
     * Handle a batch request.
     * @param socket - The socket representing the client connection.
     * @param requests - The array of `JSON-RPC` requests.
     * @see Socket
     * @see Request
     */
    private handleBatchRequest(socket: Socket, requests: Array<Request>): void {
        if (requests.length === 0) {
            this.sendErrorResponse(socket, ErrorCode.InvalidRequest, 'Invalid Request');
        } else {
            const responses: Array<Response> = requests.map((req) => {
                if (!this.isValidRequest(req)) {
                    return this.createErrorResponse(ErrorCode.InvalidRequest, 'Invalid Request');
                }
                return this.invoke(req);
            });
            socket.write(JSON.stringify(responses));
        }
    }

    /**
     * Handle a single request.
     * @param socket - The socket representing the client connection.
     * @param request - The `JSON-RPC` request object.
     * @see Socket
     * @see Request
     */
    private handleSingleRequest(socket: Socket, request: Request): void {
        if (!this.isValidRequest(request)) {
            this.sendErrorResponse(socket, ErrorCode.InvalidRequest, 'Invalid Request');
        } else {
            const response: Response = this.invoke(request);
            socket.write(JSON.stringify(response));
        }
    }

    /**
     * Handle a parse error.
     * @param socket - The socket representing the client connection.
     * @param error - The error object.
     * @see Socket
     */
    private handleParseError(socket: Socket, error: any): void {
        console.error('Error handling request:', error);
        this.sendErrorResponse(socket, ErrorCode.ParseError, 'Parse error', error.message);
    }

    /**
     * Handle a socket error.
     * @param socket - The socket representing the client connection.
     * @param error - The error object.
     * @see Socket
     * @see Error
     */
    private handleSocketError(socket: Socket, error: Error): void {
        console.error('Socket error:', error);
        this.sendErrorResponse(socket, -32000, 'Socket error', error.message);
    }

    /**
     * Send an error response to the client.
     * @param socket - The socket representing the client connection.
     * @param code - The error code.
     * @param message - The error message.
     * @param data - Additional error data (optional).
     * @see Socket
     */
    private sendErrorResponse(
        socket: Socket, code: number, message: string, data?: any
    ): void {
        const errorResponse: Response = {
            jsonrpc: '2.0',
            id: null,
            error: this.createError(code, message, data)
        };
        socket.write(JSON.stringify(errorResponse));
    }

    /**
     * Create an error response object.
     * @param code - The error code.
     * @param message - The error message.
     * @param data - Additional error data (optional).
     * @returns The `JSON-RPC` error response object.
     */
    private createErrorResponse(code: number, message: string, data?: any): Response {
        return {
            jsonrpc: '2.0',
            id: null,
            error: this.createError(code, message, data)
        };
    }

    /**
     * Handle `JSON-RPC` requests and generate appropriate responses.
     * @param request - The `JSON-RPC` request object.
     * @returns The `JSON-RPC` response object.
     * @see Request
     * @see Response
     */
    private invoke(request: Request): Response {
        const response: Response = {
            jsonrpc: '2.0',
            id: request.id ?? null
        };
        try {
            const propertyDescriptor: PropertyDescriptor | undefined =
                Reflect.getOwnPropertyDescriptor(this.proxy, request.method);
            if (propertyDescriptor) {
                if (typeof propertyDescriptor.value === 'function') {
                    // Method is a function
                    const result: any = Reflect.apply(propertyDescriptor.value, this.proxy, Array.isArray(request.params) ? request.params : []);
                    response.result = result;
                } else if (typeof propertyDescriptor.get === 'function') {
                    // Method is a getter
                    const result: any = Reflect.apply(propertyDescriptor.get, this.proxy, []);
                    response.result = result;
                } else if (typeof propertyDescriptor.set === 'function') {
                    // Method is a setter
                    Reflect.apply(propertyDescriptor.set, this.proxy, Array.isArray(request.params) ? request.params : []);
                    response.result = null; // Setters do not return a value
                } else {
                    response.error = this.createError(ErrorCode.MethodNotFound, 'Method not found');
                }
            } else {
                response.error = this.createError(ErrorCode.MethodNotFound, 'Method not found');
            }
        } catch (error: any) {
            response.error = this.createError(ErrorCode.InternalError, 'Internal error', error);
        }
        return response;
    }

    /**
     * Validate if the request is a valid `JSON-RPC` 2.0 request.
     * @param request - The `JSON-RPC` request object.
     * @returns True if the request is valid, false otherwise.
     */
    private isValidRequest(request: Request): boolean {
        return request.jsonrpc === '2.0' && typeof request.method === 'string';
    }

    /**
     * Create an error object for ``JSON-RPC`` responses.
     * @param code - The error code.
     * @param message - The error message.
     * @param data - Additional error data (optional).
     * @returns The `JSON-RPC` error object.
     */
    private createError(code: number, message: string, data?: any): ErrorObject {
        return { code, message, data };
    }

    /**
     * Create a `ProxyHandler` for the target object.
     *
     * @returns The `ProxyHandler` object.
     */
    private createHandler(): ProxyHandler<any> {
        return {
            apply: (target: Function, thisArg: any, argumentsList: Array<any>): any => {
                console.log(`apply called with args: ${argumentsList}`);
                return Reflect.apply(target, thisArg, argumentsList);
            },
            construct: (target: any, args: Array<any>, newTarget: Function): any => {
                console.log(`construct called with args: ${args}`);
                return Reflect.construct(target, args, newTarget);
            },
            defineProperty: (target: any, prop: PropertyKey, descriptor: PropertyDescriptor): boolean => {
                console.log(`defineProperty called for prop: ${String(prop)}`);
                return Reflect.defineProperty(target, prop, descriptor);
            },
            deleteProperty: (target: any, prop: PropertyKey): boolean => {
                console.log(`deleteProperty called for prop: ${String(prop)}`);
                return Reflect.deleteProperty(target, prop);
            },
            get: (target: any, prop: PropertyKey, receiver: any): any => {
                console.log(`get called for prop: ${String(prop)}`);
                return Reflect.get(target, prop, receiver);
            },
            getOwnPropertyDescriptor: (target: any, prop: PropertyKey): PropertyDescriptor | undefined => {
                console.log(`getOwnPropertyDescriptor called for prop: ${String(prop)}`);
                return Reflect.getOwnPropertyDescriptor(target, prop);
            },
            getPrototypeOf: (target: any): object | null => {
                console.log(`getPrototypeOf called`);
                return Reflect.getPrototypeOf(target);
            },
            has: (target: any, prop: PropertyKey): boolean => {
                console.log(`has called for prop: ${String(prop)}`);
                return Reflect.has(target, prop);
            },
            isExtensible: (target: any): boolean => {
                console.log(`isExtensible called`);
                return Reflect.isExtensible(target);
            },
            ownKeys: (target: any): ArrayLike<string | symbol> => {
                console.log(`ownKeys called`);
                return Reflect.ownKeys(target).filter((key: string | symbol) =>
                    typeof key === 'string' || typeof key === 'symbol');
            },
            preventExtensions: (target: any): boolean => {
                console.log(`preventExtensions called`);
                return Reflect.preventExtensions(target);
            },
            set: (target: any, prop: PropertyKey, value: any, receiver: any): boolean => {
                console.log(`set called for prop: ${String(prop)} with value: ${value}`);
                return Reflect.set(target, prop, value, receiver);
            },
            setPrototypeOf: (target: any, proto: any): boolean => {
                console.log(`setPrototypeOf called`);
                return Reflect.setPrototypeOf(target, proto);
            }
        };
    }
}
