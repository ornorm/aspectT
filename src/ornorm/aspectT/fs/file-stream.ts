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

import {FileObject} from '@ornorm/aspectT';
import {close, open, read, write} from 'fs';
import {Readable, ReadableOptions, Writable, WritableOptions} from 'stream';
import {promisify} from 'util';

const openAsync = promisify(open) as (path: string | Buffer | URL, flags: string) => Promise<number>;
const closeAsync = promisify(close) as (fd: number) => Promise<void>;
const readAsync = promisify(read) as (fd: number, buffer: Buffer, offset: number, length: number, position: number) => Promise<{
    bytesRead: number;
    buffer: Buffer
}>;
const writeAsync = promisify(write) as (fd: number, buffer: Buffer, offset?: number, length?: number, position?: number) => Promise<{
    bytesWritten: number;
    buffer: Buffer
}>;

/**
 * Type definition for a write chunk.
 */
export type Chunk = { chunk: any; encoding: BufferEncoding; };

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
export type ReadBuffer = { bytesRead: number; buffer: Buffer; };

/**
 * Type definition for the result of a write operation.
 * @property bytesWritten - The number of bytes written.
 * @property buffer - The buffer that was written.
 * @see Buffer
 */
export type WriteBuffer = { bytesWritten: number; buffer: Buffer; };

export type ReadResult = (chunk: Chunk) => void;

export type ReadFileOptions = {
    encoding?: null | undefined;
    flag?: string | undefined;
};

/**
 * A readable stream for reading data from a file.
 * @see Readable
 */
export class FileReadableStream extends Readable {
    private fd: number | null = null;
    private readonly fileName: string;
    private readonly highWaterMark: number = 16 * 1024;
    private bytesRead: number = 0;

    /**
     * Creates an instance of `FileReadableStream`.
     * @param file - The file object representing the file to read from.
     * @param [options] - Optional readable stream options.
     * @see FileObject
     * @see ReadableOptions
     */
    constructor(file: FileObject, options?: ReadableOptions) {
        super(options);
        this.fileName = file.name;
        this.highWaterMark = options?.highWaterMark || this.highWaterMark;
    }

    /**
     * Gets the file descriptor or `null` if closed.
     */
    public get fileDescriptor(): number | null {
        return this.fd;
    }

    /**
     * Gets the name of the file.
     */
    public get name(): string {
        return this.fileName;
    }

    /**
     * Checks if the file is opened.
     */
    public get opened(): boolean {
        return this.fd !== null;
    }

    /**
     * Gets the number of bytes read.
     */
    public get readBytes(): number {
        return this.bytesRead;
    }

    /**
     * Initializes the stream by opening the file.
     * @param callback - The callback function.
     * @see ErrorCallback
     */
    public async _construct(callback: ErrorCallback): Promise<void> {
        try {
            this.fd = await openAsync(this.name, 'r');
            this.emit('open', this.fd);
            callback();
        } catch (err: any) {
            callback(err);
        }
    }

    /**
     * Destroys the stream by closing the file.
     * @param error - The error, if any or `null`.
     * @param The callback function.
     * @see ErrorCallback
     */
    public async _destroy(error: Error | null, callback: ErrorCallback): Promise<void> {
        if (this.fd) {
            try {
                await closeAsync(this.fd);
                this.emit('close', this.fd);
                callback(error);
            } catch (err: any) {
                callback(err);
            }
        } else {
            callback(error);
        }
    }

    /**
     * Reads data from the file.
     * @param size - The number of bytes to read.
     * @private
     */
    public async _read(size: number): Promise<void> {
        if (this.fd) {
            try {
                const readBuffer: ReadBuffer =
                    await readAsync(this.fd, Buffer.alloc(size), 0, size, 0);
                this.bytesRead += readBuffer.bytesRead;
                if (readBuffer.bytesRead > 0) {
                    this.push(readBuffer.buffer.slice(0, readBuffer.bytesRead));
                } else {
                    this.push(null);
                }
            } catch (err: any) {
                this.destroy(err);
            }
        } else {
            this.destroy(new RangeError('File descriptor is not open'));
        }
    }
}

/**
 * A writable stream for writing data to a file.
 * @see Writable
 */
export class FileWritableStream extends Writable {
    private readonly chunks: Array<Buffer> = [];
    private chunkSize: number = 0;
    private fd: number | null = null;
    private readonly fileName: string;
    private readonly highWaterMark: number = 16 * 1024;
    private writesCount: number = 0;

    /**
     * Creates an instance of `FileWritableStream`.
     * @param file - The file object representing the file to write to.
     * @param [options] - Optional writable stream options.
     * @see FileObject
     * @see WritableOptions
     */
    constructor(file: FileObject, options?: WritableOptions) {
        super(options);
        this.fileName = file.name;
        this.highWaterMark = options?.highWaterMark || this.highWaterMark;
    }

    /**
     * Gets the concatenated buffer of all chunks.
     * @see Buffer
     */
    public get buffer(): Buffer {
        return Buffer.concat(this.chunks);
    }

    /**
     * Gets the file descriptor or `null` if closed.
     */
    public get fileDescriptor(): number | null {
        return this.fd;
    }

    /**
     * Gets the name of the file.
     */
    public get name(): string {
        return this.fileName;
    }

    /**
     * Checks if the file is opened.
     */
    public get opened(): boolean {
        return this.fd !== null;
    }

    /**
     * Gets the number of bytes written.
     */
    public get written(): number {
        return this.writesCount;
    }

    /**
     * Initializes the stream by opening the file.
     * @param callback - The callback function.
     * @see ErrorCallback
     */
    public async _construct(callback: ErrorCallback): Promise<void> {
        try {
            this.fd = await openAsync(this.name, 'w');
            this.emit('open', this.fd);
            callback();
        } catch (err: any) {
            callback(err);
        }
    }

    /**
     * Destroys the stream by closing the file.
     * @param error - The error, if any or `null`.
     * @param The callback function.
     * @see ErrorCallback
     */
    public async _destroy(error: Error | null, callback: ErrorCallback): Promise<void> {
        if (this.fd) {
            try {
                await closeAsync(this.fd);
                this.emit('close', this.fd);
                callback(error);
            } catch (err: any) {
                callback(err);
            }
        } else {
            callback(error);
        }
    }

    /**
     * Finalizes the stream by writing any remaining data and closing the file.
     * @param The callback function.
     * @see ErrorCallback
     */
    public async _final(callback: ErrorCallback): Promise<void> {
        if (this.fd) {
            try {
                const written: WriteBuffer = await writeAsync(this.fd, Buffer.concat(this.chunks));
                this.fd = null;
                this.writesCount += written.bytesWritten;
                this.emit('finalize', this.writesCount);
                callback();
            } catch (err: any) {
                callback(err);
            }
        } else {
            callback(new RangeError('File descriptor is not open'));
        }
    }

    /**
     * Writes a chunk of data to the file.
     * @param chunk - The chunk of data to write.
     * @param encoding - The encoding of the chunk.
     * @param callback - The callback function.
     * @see BufferEncoding
     * @see ErrorCallback
     */
    public _write(chunk: any, encoding: BufferEncoding, callback: ErrorCallback): void {
        if (!Buffer.isBuffer(chunk)) {
            chunk = Buffer.from(chunk, encoding);
        }
        this.chunks.push(chunk);
        this.chunkSize += chunk.length;
        if (this.chunkSize > this.highWaterMark) {
            if (this.fd) {
                write(
                    this.fd,
                    Buffer.concat(this.chunks),
                    (err: NodeJS.ErrnoException | null, written: number) => {
                        if (err) {
                            callback(err);
                        } else {
                            this.chunkSize = 0;
                            this.chunks.length = 0;
                            this.writesCount += written;
                            this.emit('write', written);
                            callback();
                        }
                    });
            } else {
                callback(new RangeError('File descriptor is not open'));
            }
        } else {
            callback();
        }
    }

    /**
     * Writes multiple chunks of data to the file.
     * @param {Array<Chunk>} chunks - The chunks of data to write.
     * @param {function(Error | null): void} callback - The callback function.
     * @private
     */
    _writev(
        chunks: Array<Chunk>,
        callback: ErrorCallback,
    ): void {
        if (this.fd) {
            const buffers: Array<any> = chunks.map((Chunk: Chunk) => Chunk.chunk);
            const totalLength: number = buffers.reduce((acc: any, buffer: Buffer) => acc + buffer.length, 0);
            const combinedBuffer: Buffer = Buffer.concat(buffers, totalLength);
            this.chunkSize += combinedBuffer.length;
            write(this.fd, combinedBuffer, (err: NodeJS.ErrnoException | null, written: number) => {
                if (err) {
                    callback(err);
                } else {
                    this.writesCount += written;
                    this.emit('writev', written);
                    callback();
                }
            });
        } else {
            callback(new RangeError('File descriptor is not open'));
        }
    }
}
