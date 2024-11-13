/**
 * @file file-stream.ts
 * @description This file contains the file stream implementation for the AspectT project.
 * @license MIT
 *
 * @autor Aimé Biendo
 * @contact abiendo@gmail.com
 *
 * @date 2023
 */
import { FileObject } from '@ornorm/aspectT';
import { Readable, ReadableOptions, Writable, WritableOptions } from 'stream';
/**
 * Type definition for a write chunk.
 */
export type Chunk = {
    chunk: any;
    encoding: BufferEncoding;
};
/**
 * Callback type for handling errors.
 * @param [error] - The error object, if any.
 */
export type ErrorCallback = (error?: Error | null) => void;
/**
 * Type definition for the result of a read operation.
 *
 * @property bytesRead - The number of bytes read.
 * @property buffer - The buffer that was read.
 * @see Buffer
 */
export type ReadBuffer = {
    bytesRead: number;
    buffer: Buffer;
};
/**
 * Type definition for the result of a write operation.
 * @property bytesWritten - The number of bytes written.
 * @property buffer - The buffer that was written.
 * @see Buffer
 */
export type WriteBuffer = {
    bytesWritten: number;
    buffer: Buffer;
};
export type ReadResult = (chunk: Chunk) => void;
export type ReadFileOptions = {
    encoding?: null | undefined;
    flag?: string | undefined;
};
/**
 * A readable stream for reading data from a file.
 * @see Readable
 */
export declare class FileReadableStream extends Readable {
    private fd;
    private readonly fileName;
    private readonly highWaterMark;
    private bytesRead;
    /**
     * Creates an instance of `FileReadableStream`.
     * @param file - The file object representing the file to read from.
     * @param [options] - Optional readable stream options.
     * @see FileObject
     * @see ReadableOptions
     */
    constructor(file: FileObject, options?: ReadableOptions);
    /**
     * Gets the file descriptor or `null` if closed.
     */
    get fileDescriptor(): number | null;
    /**
     * Gets the name of the file.
     */
    get name(): string;
    /**
     * Checks if the file is opened.
     */
    get opened(): boolean;
    /**
     * Gets the number of bytes read.
     */
    get readBytes(): number;
    /**
     * Initializes the stream by opening the file.
     * @param callback - The callback function.
     * @see ErrorCallback
     */
    _construct(callback: ErrorCallback): Promise<void>;
    /**
     * Destroys the stream by closing the file.
     * @param error - The error, if any or `null`.
     * @param The callback function.
     * @see ErrorCallback
     */
    _destroy(error: Error | null, callback: ErrorCallback): Promise<void>;
    /**
     * Reads data from the file.
     * @param size - The number of bytes to read.
     * @private
     */
    _read(size: number): Promise<void>;
}
/**
 * A writable stream for writing data to a file.
 * @see Writable
 */
export declare class FileWritableStream extends Writable {
    private readonly chunks;
    private chunkSize;
    private fd;
    private readonly fileName;
    private readonly highWaterMark;
    private writesCount;
    /**
     * Creates an instance of `FileWritableStream`.
     * @param file - The file object representing the file to write to.
     * @param [options] - Optional writable stream options.
     * @see FileObject
     * @see WritableOptions
     */
    constructor(file: FileObject, options?: WritableOptions);
    /**
     * Gets the concatenated buffer of all chunks.
     * @see Buffer
     */
    get buffer(): Buffer;
    /**
     * Gets the file descriptor or `null` if closed.
     */
    get fileDescriptor(): number | null;
    /**
     * Gets the name of the file.
     */
    get name(): string;
    /**
     * Checks if the file is opened.
     */
    get opened(): boolean;
    /**
     * Gets the number of bytes written.
     */
    get written(): number;
    /**
     * Initializes the stream by opening the file.
     * @param callback - The callback function.
     * @see ErrorCallback
     */
    _construct(callback: ErrorCallback): Promise<void>;
    /**
     * Destroys the stream by closing the file.
     * @param error - The error, if any or `null`.
     * @param The callback function.
     * @see ErrorCallback
     */
    _destroy(error: Error | null, callback: ErrorCallback): Promise<void>;
    /**
     * Finalizes the stream by writing any remaining data and closing the file.
     * @param The callback function.
     * @see ErrorCallback
     */
    _final(callback: ErrorCallback): Promise<void>;
    /**
     * Writes a chunk of data to the file.
     * @param chunk - The chunk of data to write.
     * @param encoding - The encoding of the chunk.
     * @param callback - The callback function.
     * @see BufferEncoding
     * @see ErrorCallback
     */
    _write(chunk: any, encoding: BufferEncoding, callback: ErrorCallback): void;
    /**
     * Writes multiple chunks of data to the file.
     * @param {Array<Chunk>} chunks - The chunks of data to write.
     * @param {function(Error | null): void} callback - The callback function.
     * @private
     */
    _writev(chunks: Array<Chunk>, callback: ErrorCallback): void;
}
