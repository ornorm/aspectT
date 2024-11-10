/**
 * This TypeScript code is a port of the File class originally written in Java.
 * The original Java code was created by Oracle and/or its affiliates.
 *
 * Ported to TypeScript by Aimé Biendo <abiendo@gmail.com> as part of the AspectT Inc. AOP project.
 *
 * This file is part of the AspectT Inc. product, a seamless aspect-oriented extension to the TypeScript™ programming language.
 * JavaScript platform compatible. Easy to learn and use.
 *
 * Copyright (c) 1994, 2011, Oracle and/or its affiliates. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Oracle designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Oracle in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Oracle, 500 Oracle Parkway, Redwood Shores, CA 94065 USA
 * or visit www.oracle.com if you need additional information or have any
 * questions.
 */

import {FileFilter, Path} from '@ornorm/aspectT';
import {execSync} from 'child_process';
import {EventEmitter} from 'events';
import {
    accessSync,
    chmodSync,
    constants,
    createReadStream,
    createWriteStream,
    EncodingOption,
    existsSync,
    FSWatcher,
    mkdirSync,
    mkdtempSync,
    readdirSync,
    ReadStream,
    realpathSync,
    renameSync,
    StatsBase,
    statSync,
    unlinkSync,
    utimesSync,
    watch,
    WatchEventType,
    writeFileSync,
    WriteStream
} from 'fs';
import {tmpdir} from 'os';
import {basename, delimiter, dirname, isAbsolute, join, resolve, sep} from 'path';

/**
 * A type definition for a function that handles file system watch events.
 *
 * @param eventType - A string indicating the type of change (`"rename"` or `"change"`).
 * @param filename - A string representing the name of the file that changed, or `null` if not provided.
 */
export type WatchHandler = (eventType: string, filename: string | null) => void;

/**
 * A class that wraps around the `StatsBase` object to provide type-safe
 * access to file statistics.
 * @template T - The type of the statistics values, defaults to `number`.
 * @see StatsBase
 */
export class FileStats<T> implements StatsBase<T> {
    private readonly stats: StatsBase<T>;

    /**
     * Constructs a new `FileStats` object.
     * @param stats - The underlying `StatsBase` object.
     * @see StatsBase
     */
    constructor(stats: StatsBase<T>) {
        this.stats = stats;
    }

    /**
     * Gets the device ID.
     */
    public get dev(): T {
        return this.stats.dev;
    }

    /**
     * Gets the inode number.
     */
    public get ino(): T {
        return this.stats.ino;
    }

    /**
     * Gets the file mode.
     */
    public get mode(): T {
        return this.stats.mode;
    }

    /**
     * Gets the number of hard links.
     */
    public get nlink(): T {
        return this.stats.nlink;
    }

    /**
     * Gets the user ID of the owner.
     */
    public get uid(): T {
        return this.stats.uid;
    }

    /**
     * Gets the group ID of the owner.
     */
    public get gid(): T {
        return this.stats.gid;
    }

    /**
     * Gets the device ID (if special file).
     */
    public get rdev(): T {
        return this.stats.rdev;
    }

    /**
     * Gets the total size, in bytes.
     */
    public get size(): T {
        return this.stats.size;
    }

    /**
     * Gets the block size for filesystem I/O.
     */
    public get blksize(): T {
        return this.stats.blksize;
    }

    /**
     * Gets the number of 512B blocks allocated.
     */
    public get blocks(): T {
        return this.stats.blocks;
    }

    /**
     * Gets the time of last access, in milliseconds.
     */
    public get atimeMs(): T {
        return this.stats.atimeMs;
    }

    /**
     * Gets the time of last modification, in milliseconds.
     */
    public get mtimeMs(): T {
        return this.stats.mtimeMs;
    }

    /**
     * Gets the time of last status change, in milliseconds.
     */
    public get ctimeMs(): T {
        return this.stats.ctimeMs;
    }

    /**
     * Gets the time of file creation, in milliseconds.
     */
    public get birthtimeMs(): T {
        return this.stats.birthtimeMs;
    }

    /**
     * Gets the time of last access.
     */
    public get atime(): Date {
        return this.stats.atime;
    }

    /**
     * Gets the time of last modification.
     */
    public get mtime(): Date {
        return this.stats.mtime;
    }

    /**
     * Gets the time of last status change.
     */
    public get ctime(): Date {
        return this.stats.ctime;
    }

    /**
     * Gets the time of file creation.
     */
    public get birthtime(): Date {
        return this.stats.birthtime;
    }

    /**
     * Retrieves the file statistics for the specified file path.
     *
     * @param filePath The path of the file to retrieve statistics for.
     * @returns A `FileStats` object containing the statistics of the file.
     * @see FileStats
     */
    public static get(filePath: string): FileStats<number> {
        return new FileStats<number>(statSync(filePath))
    }

    /**
     * Checks if the file is a regular file.
     * @returns  True if the file is a regular file, false otherwise.
     * @inheritDoc
     */
    public isFile(): boolean {
        return this.stats.isFile();
    }

    /**
     * Checks if the file is a directory.
     * @returns  True if the file is a directory, false otherwise.
     * @inheritDoc
     */
    public isDirectory(): boolean {
        return this.stats.isDirectory();
    }

    /**
     * Checks if the file is a block device.
     * @returns  True if the file is a block device, false otherwise.
     * @inheritDoc
     */
    public isBlockDevice(): boolean {
        return this.stats.isBlockDevice();
    }

    /**
     * Checks if the file is a character device.
     * @returns  True if the file is a character device, false otherwise.
     * @inheritDoc
     */
    public isCharacterDevice(): boolean {
        return this.stats.isCharacterDevice();
    }

    /**
     * Checks if the file is a symbolic link.
     * @returns  True if the file is a symbolic link, false otherwise.
     * @inheritDoc
     */
    public isSymbolicLink(): boolean {
        return this.stats.isBlockDevice();
    }

    /**
     * Checks if the file is a FIFO (named pipe).
     * @returns  True if the file is a FIFO, false otherwise.
     * @inheritDoc
     */
    public isFIFO(): boolean {
        return this.stats.isFIFO();
    }

    /**
     * Checks if the file is a socket.
     * @returns  True if the file is a socket, false otherwise.
     * @inheritDoc
     */
    public isSocket(): boolean {
        return this.stats.isBlockDevice();
    }
}

/**
 * An abstract representation of file and directory path names.
 *
 * User interfaces and operating systems use system-dependent `pathname`
 * to name files and directories.
 *
 * This class presents an abstract, system-independent view of hierarchical
 * path names.
 *
 * An `abstract pathname` has two components:
 *
 * - An optional system-dependent `prefix` string, such as a disk-drive
 *      specifier, `"/"` for the UNIX root directory, or `"\\\\"` for a
 *      Microsoft Windows UNC pathname, and
 * - A sequence of zero or more string `names`.
 *
 * The first name in an abstract pathname may be a directory name or, in the
 * case of Microsoft Windows UNC path names, a hostname.
 *
 * Each subsequent name in an abstract pathname denotes a directory;
 * the last name may denote either a directory or a file.
 *
 * The `empty` abstract pathname has no prefix and an empty name sequence.
 *
 * The conversion of a pathname string to or from an abstract pathname is
 * inherently system-dependent.
 *
 * When an abstract pathname is converted into a pathname string, each
 * name is separated from the next by a single copy of the default `separator character`.
 *
 * The default name-separator character is defined by the system property
 * `file.separator`, and is made available in the public static fields {@link separator} and
 * {@link separatorChar} of this class.
 *
 * When a pathname string is converted into an abstract pathname, the names
 * within it may be separated by the default name-separator character or by any
 * other name-separator character that is supported by the underlying system.
 *
 * A pathname, whether abstract or in string form, may be either
 * `absolute` or `relative`.
 *
 * An absolute pathname is complete in that no other information is required
 * in order to locate the file that it denotes.
 *
 * A relative pathname, in contrast, must be interpreted in terms of
 * information taken from some other pathname.
 *
 * The `parent` of an abstract pathname may be obtained by invoking
 * the {@link gparent} method of this class and consists of the path name's
 * prefix and each name in the path name's name sequence except for the last.
 *
 * Each directory's absolute pathname is an ancestor of any `FileObject`
 * with an absolute abstract pathname which begins with the directory's
 * absolute pathname.
 *
 * For example, the directory denoted by the abstract pathname `"/usr"`
 * is an ancestor of the directory denoted by the pathname `"/usr/local/bin"`.
 *
 * The prefix concept is used to handle root directories on UNIX platforms,
 * and drive specifiers, root directories and UNC pathnames on
 * Microsoft Windows platforms, as follows:
 *
 * - For UNIX platforms, the prefix of an absolute pathname is always
 * `"/"`.
 *
 * - Relative path names have no prefix.
 *
 * The abstract pathname denoting the root directory has the prefix
 * `"/"` and an empty name sequence.
 *
 * - For Microsoft Windows platforms, the prefix of a pathname that
 * contains a drive specifier consists of the drive letter followed by `":"` and
 * possibly followed by `"\\"` if the pathname is absolute.
 *
 * The prefix of a UNC pathname is `"\\\\"`; the hostname and the share
 * name are the first two names in the name sequence.
 *
 * A relative pathname that does not specify a drive has no prefix.
 *
 * Instances of this class may or may not denote an actual file-system
 * object such as a file or a directory.
 *
 * If it does denote such an object then that object resides in a `partition`.
 *
 * A partition is an operating system-specific portion of storage for a file
 * system.
 *
 * A single storage device (e.g. a physical disk-drive, flash memory, CD-ROM)
 * may contain multiple partitions.
 *
 * The object, if any, will reside on the partition `named` by some ancestor
 * of the absolute form of this pathname.
 *
 * A file system may implement restrictions to certain operations on the
 * actual file-system object, such as reading, writing, and executing.
 *
 * These restrictions are collectively known as `access permissions`.
 *
 * The file system may have multiple sets of access permissions on a
 * single object.
 *
 * For example, one set may apply to the object's `owner`, and another
 * may apply to all other users.
 *
 * The access permissions on an object may cause some methods in this
 * class to fail.
 *
 * Instances of the `FileObject` class are immutable; that is, once
 * created, the abstract pathname represented by a `FileObject` object
 * will never change.
 * @author  Aimé Biendo <abiendo@gmail.com>
 * @since   aspectT1.0
 */
export class FileObject extends EventEmitter implements Path {
    /**
     * This abstract path name's normalized pathname string.
     *
     * A normalized pathname string uses the default name-separator
     * character and does not contain any duplicate or redundant separators.
     */
    protected filePath: string;
    protected fileStats: FileStats<number>;

    /**
     * Creates a new `FileObject` instance by converting the given
     * pathname string into an abstract pathname.
     *
     * If the given string is the empty string, then the result is the empty
     * abstract pathname.
     *
     * @param filePath  A pathname string
     */
    constructor(filePath: string);

    /**
     * Creates a new `FileObject` instance from a parent pathname string
     * and a child pathname string.
     *
     * If `parent` is `null` then the new `FileObject` instance is created as
     * if by invoking the single-argument `FileObject` constructor on the given
     * `child` pathname string.
     *
     * Otherwise the `parent` pathname string is taken to denote
     * a directory, and the `child` pathname string is taken to
     * denote either a directory or a file.
     *
     * If the `child` pathname string is absolute then it is converted into a
     * relative pathname in a system-dependent way.
     *
     * If `parent` is the empty string then the new `FileObject` instance is
     * created by converting `child` into an abstract pathname and resolving
     * the result against a system-dependent default directory.
     *
     * Otherwise each pathname string is converted into an abstract
     * pathname and the child abstract pathname is resolved against the
     * parent.
     * @param   parent  The parent pathname string
     * @param   child   The child pathname string
     */
    constructor(parent: string, child: string);

    /**
     * Creates a new `FileObject` instance from a parent pathname string
     * and a child pathname string.
     *
     * If `parent` is `null` then the new `FileObject` instance is created as
     * if by invoking the single-argument `FileObject` constructor on the
     * given `child` pathname string.
     *
     * Otherwise the `parent` pathname string is taken to denote a directory,
     * and the `child` pathname string is taken to denote either a directory
     * or a file.
     *
     * If the `child` pathname string is absolute then it is converted into a
     * relative pathname in a system-dependent way.
     *
     * If `parent` is the empty string then the new `FileObject` instance is
     * created by converting `child` into an abstract pathname and resolving
     * the result against a system-dependent default directory.
     *
     * Otherwise each pathname string is converted into an abstract
     * pathname and the child abstract pathname is resolved against the
     * parent.
     * @param   parent  The parent pathname string
     * @param   child The child pathname string
     * @throws  ReferenceError If `child` is `null`
     */
    constructor(parent: FileObject, child: string);

    /**
     * Creates a new `FileObject` instance by converting the given
     * `file:` URI into an abstract pathname.
     *
     * The exact form of a `file:` URI is system-dependent, hence
     * the transformation performed by this constructor is also
     * system-dependent.
     * @param  uri
     *         An absolute, hierarchical `URL` with a scheme equal to
     *         `"file"`, a non-empty path component, and undefined
     *         authority, query, and fragment components
     */
    constructor(uri: URL);

    /**
     * Constructs a new `FileObject` instance.
     *
     * @param filePath A string representing the file path, a `FileObject`
     * instance, or a `URL`.
     * @param child An optional string representing the child path.
     * @throws URIError If the constructor arguments are invalid.
     */
    constructor(filePath: string | FileObject | URL, child?: string) {
        super();
        if (typeof filePath === 'string' && typeof child === 'undefined') {
            this.filePath = resolve(filePath);
        } else if (typeof filePath === 'string' && typeof child === 'string') {
            this.filePath = resolve(filePath, child);
        } else if (filePath instanceof FileObject && typeof child === 'string') {
            this.filePath = resolve(filePath.toPath(), child);
        } else if (filePath instanceof URL) {
            if (filePath.protocol !== 'file:') {
                throw new URIError('URL must use the file protocol');
            }
            this.filePath = resolve(filePath.pathname);
        } else {
            throw new URIError('Invalid constructor arguments');
        }
        this.fileStats = FileStats.get(this.filePath);
    }

    /**
     * List the available filesystem roots.
     *
     * Each file system has a `root` directory from which all other
     * files in that file system can be reached.
     *
     * Windows platforms, for example, have a root directory for each active
     * drive; UNIX platforms have a single root directory,
     * namely `"/"`.
     *
     * The set of available filesystem roots is affected by various system-level
     * operations such as the insertion or ejection of removable media and
     * the disconnecting or unmounting of physical or virtual disk drives.
     *
     * This method returns an array of `FileObject` objects that
     * denote the root directories of the available filesystem roots.
     *
     * It is guaranteed that the canonical pathname of any file physically
     * present on the local machine will begin with one of the roots returned
     * by this method.
     *
     * The canonical pathname of a file that resides on some other machine
     * and is accessed via a remote-filesystem protocol such as SMB or NFS
     * may or may not begin with one of the roots returned by this method.
     *
     * If the pathname of a remote file is syntactically indistinguishable from
     * the pathname of a local file then it will begin with one of the roots
     * returned by this method.
     *
     * Thus, for example, `FileObject` objects denoting the root
     * directories of the mapped network drives of a Windows platform will
     * be returned by this method, while `FileObject` objects
     * containing UNC path names will not be returned by this method.
     *
     * Unlike most methods in this class, this method does not throw
     * security exceptions.
     * @return  An array of `FileObject` objects denoting the available
     *          filesystem roots, or `null` if the set of roots could not
     *          be determined.
     *          The array will be empty if there are no filesystem roots.
     */
    public static get listRoots(): Array<FileObject> {
        const rootPaths: Array<string> =
            readdirSync(FileObject.pathSeparator)
                .map((name: string) => resolve(FileObject.pathSeparator, name));
        return rootPaths.map((path: string) => new FileObject(path));
    }

    /**
     * The system-dependent path-separator character, represented as a
     * string for convenience.
     *
     * This string contains a single character, namely {@link pathSeparatorChar}.
     */
    public static get pathSeparator(): string {
        return delimiter;
    }

    /**
     * The system-dependent path-separator character.
     *
     * This field is initialized to contain the first character of the value of
     * the system property `separator`.
     *
     * This character is used to separate filenames in a sequence of files
     * given as a `path list`.
     *
     * On UNIX systems, this character is `':'`; on Microsoft Windows
     * systems it is `';'`.
     */
    public static get pathSeparatorChar(): number {
        return delimiter.charCodeAt(0);
    }

    /**
     * The system-dependent default name-separator character,
     * represented as a string for convenience.
     *
     * This string contains a single character, namely {@link separatorChar}.
     */
    public static get separator(): string {
        return sep;
    }

    /**
     * The system-dependent default name-separator character.
     *
     * This field is initialized to contain the first character of the value of
     * the system property `separator`.
     *
     * On UNIX systems the value of this field is `'/'`; on Microsoft Windows
     * systems it is <code>'\\'</code>.
     */
    public static get separatorChar(): number {
        return sep.charCodeAt(0);
    }

    /**
     * Returns the absolute form of this abstract pathname.
     *
     * Equivalent to {@link absolutePath}.
     * @return  The absolute abstract pathname denoting the same file or
     *          directory as this abstract pathname
     *  @see FileObject
     */
    public get absoluteFile(): FileObject {
        return new FileObject(this.absolutePath);
    }

    /**
     * Returns the absolute pathname string of this abstract pathname.
     *
     * If this abstract pathname is already absolute, then the pathname
     * string is simply returned as if by the {@link path} method.
     *
     * If this abstract pathname is the empty abstract pathname then the
     * pathname string of the current user directory, which is named by the
     * system property `app.dir`, is returned.
     *
     * Otherwise this pathname is resolved in a system-dependent way.
     *
     * On UNIX systems, a relative pathname is made absolute by resolving
     * it against the current user directory.
     *
     * On Microsoft Windows systems, a relative pathname is made absolute
     * by resolving it against the current directory of the drive named by the
     * pathname, if any; if not, it is resolved against the current user
     * directory.
     *
     * @return  The absolute pathname string denoting the same file or
     *          directory as this abstract pathname
     * @see isAbsolute
     */
    public get absolutePath(): string {
        return resolve(this.filePath);
    }

    /**
     * Tests whether the application can execute the file denoted by this
     * abstract pathname.
     *
     * @return  <code>true</code> if and only if the abstract pathname exists
     *          <em>and</em> the application is allowed to execute the file
     */
    public get canExecute(): boolean {
        try {
            accessSync(this.filePath, constants.X_OK);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Returns the canonical form of this abstract pathname.
     *
     * Equivalent to {@link canonicalPath}.
     * @return  The canonical pathname string denoting the same file or
     *          directory as this abstract pathname
     */
    public get canonicalFile(): FileObject {
        return new FileObject(this.canonicalPath);
    }

    /**
     * Returns the canonical pathname string of this abstract pathname.
     *
     * A canonical pathname is both absolute and unique.
     *
     * The precise definition of canonical form is system-dependent.
     *
     * This method first converts this pathname to absolute form if
     * necessary, as if by invoking the {@link absolutePath} method, and
     * then maps it to its unique form in a system-dependent way.
     *
     * This typically involves removing redundant names such as `"."` and
     * `".."` from the pathname, resolving symbolic links (on UNIX platforms),
     * and converting drive letters to a standard case (on Microsoft Windows
     * platforms).
     *
     * Every pathname that denotes an existing file or directory has a
     * unique canonical form.
     *
     * Every pathname that denotes a nonexistent file or directory also has
     * a unique canonical form.
     *
     * The canonical form of the pathname of a nonexistent file or directory
     * may be different from the canonical form of the same pathname after
     * the file or directory is created.
     *
     * Similarly, the canonical form of the pathname of an existing file or
     * directory may be different from the canonical form of the same
     * pathname after the file or directory is deleted.
     *
     * @return  The canonical pathname string denoting the same file or
     *          directory as this abstract pathname.
     */
    public get canonicalPath(): string {
        return realpathSync(this.filePath);
    }

    /**
     * Tests whether the application can read the file denoted by this
     * abstract pathname.
     *
     * @return  <code>true</code> if and only if the file specified by this
     *          abstract pathname exists <em>and</em> can be read by the
     *          application; <code>false</code> otherwise
     */
    public get canRead(): boolean {
        try {
            accessSync(this.filePath, constants.R_OK);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Tests whether the application can modify the file denoted by this
     * abstract pathname.
     *
     * @return  <code>true</code> if and only if the file system actually
     *          contains a file denoted by this abstract pathname <em>and</em>
     *          the application is allowed to write to the file;
     *          <code>false</code> otherwise.
     */
    public get canWrite(): boolean {
        try {
            accessSync(this.filePath, constants.W_OK);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Tests whether the file or directory denoted by this abstract pathname
     * exists.
     *
     * @return  <code>true</code> if and only if the file or directory denoted
     *          by this abstract pathname exists; <code>false</code> otherwise
     */
    public get exists(): boolean {
        return existsSync(this.filePath);
    }

    /**
     * Returns the name of the file or directory denoted by this path as a
     * {@code Path} object.
     *
     * The file name is the <em>farthest</em> element from
     * the root in the directory hierarchy.
     *
     * @return  a path representing the name of the file or directory, or
     *          {@code null} if this path has zero elements
     */
    public get fileName(): Path | null {
        return this;
    }

    /**
     * Returns the number of unallocated bytes in the partition by this
     * abstract path name.
     *
     * The returned number of unallocated bytes is a hint, but not
     * a guarantee, that it is possible to use most or any of these
     * bytes.
     *
     * The number of unallocated bytes is most likely to be
     * accurate immediately after this call.
     *
     * @return  The number of unallocated bytes on the partition <tt>0L</tt>
     *          if the abstract pathname does not name a partition.  This
     *          value will be less than or equal to the total file system size
     *          returned by {@link totalSpace}.
     */
    public get freeSpace(): number {
        const command: string =
            process.platform === 'win32' ?
                'wmic logicaldisk get size,freespace,caption' :
                'df -k';
        const output: string = execSync(command).toString();
        if (process.platform === 'win32') {
            const lines: Array<string> = output.trim().split('\n');
            for (const line of lines) {
                const parts: Array<string> = line.trim().split(/\s+/);
                if (parts[0] === this.filePath[0].toUpperCase() + ':') {
                    return parseInt(parts[1], 10);
                }
            }
        } else {
            const lines: Array<string> = output.trim().split('\n');
            for (const line of lines) {
                const parts: Array<string> = line.trim().split(/\s+/);
                if (parts[5] === this.filePath) {
                    return parseInt(parts[3], 10) * 1024;
                }
            }
        }
        throw new RangeError('Unable to determine free space');
    }

    /**
     * Tests whether this abstract pathname is absolute.
     *
     * The definition of absolute pathname is system dependent.
     *
     * On UNIX systems, a pathname is absolute if its prefix is `"/"`.
     *
     * On Microsoft Windows systems, a pathname is absolute if its prefix
     * is a drive specifier followed by `"\\"`, or if its prefix is `"\\\\"`.
     * @return  `true` if this abstract pathname is absolute,
     *          <code>false</code> otherwise
     */
    public get isAbsolute(): boolean {
        return isAbsolute(this.filePath);
    }

    /**
     * Tests whether the file denoted by this abstract pathname is a
     * directory.
     *
     * @return <code>true</code> if and only if the file denoted by this
     *          abstract pathname exists <em>and</em> is a directory;
     *          <code>false</code> otherwise
     */
    public get isDirectory(): boolean {
        return this.fileStats.isDirectory();
    }

    /**
     * Tests whether the file denoted by this abstract pathname is a normal
     * file.
     *
     * A file is <em>normal</em> if it is not a directory and, in addition,
     * satisfies other system-dependent criteria.
     *
     * Any non-directory file created by a Java application is guaranteed
     * to be a normal file.
     *
     * @return  <code>true</code> if and only if the file denoted by this
     *          abstract pathname exists <em>and</em> is a normal file;
     *          <code>false</code> otherwise
     */
    public get isFile(): boolean {
        return this.fileStats.isFile();
    }

    /**
     * Tests whether the file named by this abstract pathname is a hidden
     * file.
     *
     * The exact definition of <em>hidden</em> is system-dependent.
     *
     * On UNIX systems, a file is considered to be hidden if its name begins with
     * a period character (<code>'.'</code>).
     *
     * On Microsoft Windows systems, a file is considered to be hidden if
     * it has been marked as such in the filesystem.
     *
     * @return  <code>true</code> if and only if the file denoted by this
     *          abstract pathname is hidden according to the conventions of the
     *          underlying platform
     */
    public get isHidden(): boolean {
        return basename(this.filePath).startsWith('.');
    }

    /**
     * Returns the time that the file denoted by this abstract pathname was
     * last modified.
     *
     * Where it is required to distinguish an I/O exception from the case
     * where {@code 0L} is returned, or where several attributes of the
     * same file are required at the same time, or where the time of last
     * access or the creation time are required.
     * @return  A value representing the time the file was
     *          last modified, measured in milliseconds since the epoch
     *          (00:00:00 GMT, January 1, 1970)
     */
    public get lastModified(): number {
        return this.fileStats.mtimeMs;
    }

    public set lastModified(time: number) {
        this.setLastModified(time);
    }

    /**
     * Returns the length of the file denoted by this abstract pathname.
     * The return value is unspecified if this pathname denotes a directory.
     *
     * @return  The length, in bytes, of the file denoted by this abstract
     *          pathname, or <code>0</code> if the file does not exist.
     */
    public get length(): number {
        return this.fileStats.size;
    }

    /**
     * Returns the name of the file or directory denoted by this abstract
     * pathname.
     *
     * This is just the last name in the path name's name
     * sequence.
     *
     * If the path name's name sequence is empty, then the empty
     * string is returned.
     * @return  The name of the file or directory denoted by this abstract
     *          pathname, or the empty string if this path name's name sequence
     *          is empty
     */
    public get name(): string {
        return basename(this.filePath);
    }

    /**
     * Returns the number of name elements in the path.
     *
     * @return  the number of elements in the path, or {@code 0} if this path
     *          only represents a root component
     */
    public get nameCount(): number {
        return this.filePath.split(sep).filter(Boolean).length;
    }

    /**
     * Returns the pathname string of this abstract path name's `parent`, or
     * `null` if this pathname does not name a `parent` directory.
     *
     * The `parent` of an abstract pathname consists of the path name's
     * prefix, if any, and each name in the path name's name sequence
     * except for the last.
     *
     * If the name sequence is empty then the pathname does not name a
     * `parent` directory.
     *
     * @return  The pathname string of the `parent` directory named by this
     *          abstract pathname, or `null` if this pathname does not name a
     *          parent
     */
    public get parent(): string | null {
        const parentPath: string = dirname(this.filePath);
        return parentPath === this.filePath ? null : parentPath;
    }

    /**
     * Returns the abstract pathname of this abstract path name's `parent`,
     * or `null` if this pathname does not name a `parent` directory.
     *
     * The `parent` of an abstract pathname consists of the path name's
     * prefix, if any, and each name in the path name's name sequence
     * except for the last.
     *
     * If the name sequence is empty then the pathname does not name a
     * `parent` directory.
     * @return  The abstract pathname of the `parent` directory named
     *          by this abstract pathname, or `null` if this pathname does not
     *          name a `parent`
     */
    public get parentFile(): FileObject | null {
        const parentPath: string | null = this.parent;
        return parentPath ? new FileObject(parentPath) : null;
    }

    /**
     * Returns the parent path, or if this path does not have a parent.
     */
    public get parentPath(): Path | null {
        const parentPath: string | null = this.parent;
        return parentPath ? new FileObject(parentPath) : null;
    }

    /**
     * Converts this abstract pathname into a pathname string.
     *
     * The resulting string uses the {@link separator} default name-separator
     * character to separate the names in the name sequence.
     */
    public get path(): string {
        return this.filePath;
    }

    /**
     * Returns the root component of this path as a {@code Path} object,
     * or {@code null} if this path does not have a root component.
     *
     * @return  a path representing the root component of this path,
     *          or {@code null}
     */
    public get root(): Path | null {
        const rootPath: string = this.filePath.split(sep)[0];
        return rootPath ? new FileObject(rootPath) : null;
    }

    /**
     * Returns the size of the partition by this abstract pathname.
     *
     * @return  The size, in bytes, of the partition or <tt>0L</tt> if this
     *          abstract pathname does not name a partition
     */
    public get totalSpace(): number {
        const stats: FileStats<number> = this.fileStats;
        return stats.blksize * stats.blocks;
    }

    /**
     * Constructs a `file:` URI that represents this abstract pathname.
     *
     * The exact form of the URI is system-dependent.
     *
     * If it can be determined that the file denoted by this abstract pathname
     * is a directory, then the resulting URI will end with a slash.
     * @return  An absolute, hierarchical URI with a scheme equal to
     *          <tt>"file"</tt>, a path representing this abstract pathname,
     *          and undefined authority, query, and fragment components
     */
    public get uri(): URL {
        const f: FileObject = this.absoluteFile;
        let sp: string = FileObject.slashify(f.path, f.isDirectory);
        if (sp.startsWith("//")) {
            sp = "//" + sp;
        }
        return new URL(`file:${sp}`);
    }

    /**
     * Converts this abstract pathname into a `file:` URL.
     *
     * The exact form of the `URL` is system-dependent.
     *
     * If it can be determined that the file denoted by this abstract pathname
     * is a directory, then the resulting `URL` will end with a slash.
     *
     * @return  A `URL` object representing the equivalent file `URL`
     * @deprecated This method does not automatically escape characters that
     * are illegal in URLs.
     */
    public get url(): URL {
        return new URL(`file://${FileObject.slashify(this.absolutePath, this.isDirectory)}`);
    }

    /**
     * Returns the number of bytes available to this program on the
     * partition by this abstract pathname.
     *
     * When possible, this method checks for write permissions and other operating
     * system restrictions and will therefore usually provide a more accurate
     * estimate of how much new data can actually be written than {@link freeSpace}.
     *
     * The returned number of available bytes is a hint, but not a
     * guarantee, that it is possible to use most or any of these bytes.
     *
     * The number of unallocated bytes is most likely to be accurate immediately
     * after this call.
     *
     * @return  The number of available bytes on the partition or <tt>0L</tt>
     *          if the abstract pathname does not name a partition.  On
     *          systems where this information is not available, this method
     *          will be equivalent to a call to {@link freeSpace}.
     */
    public get usableSpace(): number {
        const command: string =
            process.platform === 'win32' ?
                'wmic logicaldisk get size,freespace,caption' :
                'df -k';
        const output: string = execSync(command).toString();
        if (process.platform === 'win32') {
            const lines: Array<string> = output.trim().split('\n');
            for (const line of lines) {
                const parts: Array<string> = line.trim().split(/\s+/);
                if (parts[0] === this.filePath[0].toUpperCase() + ':') {
                    return parseInt(parts[2], 10);
                }
            }
        } else {
            const lines: Array<string> = output.trim().split('\n');
            for (const line of lines) {
                const parts: Array<string> = line.trim().split(/\s+/);
                if (parts[5] === this.filePath) {
                    return parseInt(parts[3], 10) * 1024;
                }
            }
        }
        throw new RangeError('Unable to determine usable space');
    }

    /**
     * Creates a temporary file with the given prefix and suffix in the
     * specified directory.
     *
     * @param prefix The prefix of the temporary file name.
     * @param suffix The suffix of the temporary file name.
     * @param directory The directory in which to create the temporary file.
     * If not specified, the system's default temporary directory is used.
     * @returns A `FileObject` representing the created temporary file.
     * @see FileObject
     */
    public static createTempFile(
        prefix: string, suffix: string, directory?: FileObject
    ): FileObject {
        const tempDir: string = directory ? directory.toPath() : mkdtempSync(join(tmpdir(), prefix));
        const tempFilePath: string = join(tempDir, `${prefix}${Date.now()}${suffix}`);
        writeFileSync(tempFilePath, '');
        return new FileObject(tempFilePath);
    }

    /**
     * Converts a given path to a slash-separated format.
     *
     * @param path The path to be converted.
     * @param isDirectory A boolean indicating if the path is a directory.
     * @returns The slash-separated path.
     */
    public static slashify(path: string, isDirectory: boolean): string {
        let p: string = path;
        if (sep !== '/') {
            p = p.split(sep).join('/');
        }
        if (!p.startsWith('/')) {
            p = '/' + p;
        }
        if (!p.endsWith('/') && isDirectory) {
            p = p + '/';
        }
        return p;
    }

    /**
     * Compares two abstract path names lexicographically.
     *
     * The ordering defined by this method depends upon the underlying system.
     *
     * On UNIX systems, alphabetic case is significant in comparing path names;
     * on Microsoft Windows systems it is not.
     *
     * @param   pathname  The abstract pathname to be compared to this abstract
     *                    pathname
     *
     * @return  Zero if the argument is equal to this abstract pathname, a
     *          value less than zero if this abstract pathname is
     *          lexicographically less than the argument, or a value greater
     *          than zero if this abstract pathname is lexicographically
     *          greater than the argument
     */
    public compareTo(pathname: FileObject): number {
        return this.filePath.localeCompare(pathname.filePath);
    }

    /**
     * Atomically creates a new, empty file named by this abstract pathname if
     * and only if a file with this name does not yet exist.
     *
     * The check for the existence of the file and the creation of the file if
     * it does not exist are a single operation that is atomic with respect to
     * all other filesystem activities that might affect the file.
     *
     * @return  <code>true</code> if the named file does not exist and was
     *          successfully created; <code>false</code> if the named file
     *          already exists
     */
    public createNewFile(): boolean {
        if (this.exists) {
            return false;
        }
        writeFileSync(this.filePath, '');
        return true;
    }

    /**
     * Deletes the file or directory denoted by this abstract pathname.  If
     * this pathname denotes a directory, then the directory must be empty in
     * order to be deleted.
     *
     * @return  <code>true</code> if and only if the file or directory is
     *          successfully deleted; <code>false</code> otherwise
     */
    public delete(): boolean {
        if (!this.exists) return false;
        unlinkSync(this.filePath);
        return true;
    }

    /**
     * Requests that the file or directory denoted by this abstract
     * pathname be deleted when the program terminates.
     *
     * Files (or directories) are deleted in the reverse order that
     * they are registered.
     *
     * Invoking this method to delete a file or directory that is already
     * registered for deletion has no effect.
     *
     * Once deletion has been requested, it is not possible to cancel the
     * request.
     *
     * This method should therefore be used with care.
     * @see delete
     */
    public deleteOnExit(): void {
        process.on('exit', () => {
            if (this.exists) {
                unlinkSync(this.filePath);
            }
        });
    }

    /**
     * @inheritDoc
     */
    public endsWith(other: Path | string): boolean {
        const otherPath: string = typeof other === 'string' ? other : other.valueOf();
        return this.filePath.endsWith(otherPath);
    }

    /**
     * Tests this abstract pathname for equality with the given object.
     * Returns `true` if and only if the argument is not `null` and is an
     * abstract pathname that denotes the same file or directory as this
     * abstract pathname.
     *
     * Whether or not two abstract path names are equal depends upon
     * the underlying system.
     *
     * On UNIX systems, alphabetic case is significant in comparing path
     * names; on Microsoft Windows systems it is not.
     *
     * @param   other   The object to be compared with this abstract pathname
     * @return  <code>true</code> if and only if the objects are the same;
     *          <code>false</code> otherwise
     */
    public equals(other: FileObject): boolean {
        return this.filePath === other.filePath;
    }

    /**
     * @inheritDoc
     */
    public getName(index: number): Path {
        const names: Array<string> = this.filePath.split(sep).filter(Boolean);
        if (index < 0 || index >= names.length) {
            throw new RangeError('Index out of range');
        }
        return new FileObject(names[index]);
    }

    /**
     * Computes a hash code for this abstract pathname.
     *
     * Because equality of abstract path names is inherently system-dependent,
     * so is the computation of their hash codes.
     *
     * On UNIX systems, the hash code of an abstract path name is equal
     * to the exclusive <em>or</em> of the hash code of its pathname string
     * and the decimal value <code>1234321</code>.
     *
     * On Microsoft Windows systems, the hash code is equal to the exclusive
     * <em>or</em> of the hash code of its pathname string converted to
     * lower case and the decimal value <code>1234321</code>.
     *
     * Locale is not taken into account on lowercasing the pathname string.
     *
     * @return  A hash code for this abstract pathname
     */
    public hashCode(): number {
        return this.filePath.toLowerCase().split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 1234321);
    }

    /**
     * Returns an array of strings naming the files and directories in the
     * directory denoted by this abstract pathname.
     *
     * If this abstract pathname does not denote a directory, then this
     * method returns `null`.
     *
     * Otherwise an array of strings is returned, one for each file or directory
     * in the directory.
     *
     * Names denoting the directory itself and the directory's parent directory
     * are not included in the result.
     *
     * Each string is a file name rather than a complete path.
     *
     * There is no guarantee that the name strings in the resulting array
     * will appear in any specific order; they are not, in particular,
     * guaranteed to appear in alphabetical order.
     *
     * @param  filter A filename filter
     * @return  An array of strings naming the files and directories in the
     *          directory denoted by this abstract pathname.
     * @see FileFilter
     */
    public list(filter?: FileFilter): Array<string> | null {
        if (!this.isDirectory) {
            return null;
        }
        try {
            const names: Array<string> = readdirSync(this.filePath);
            if (!names || !filter) {
                return names;
            }
            const filteredNames: Array<string> = [];
            for (const name of names) {
                if (filter.accept(new FileObject(this.filePath, name))) {
                    filteredNames.push(name);
                }
            }
            return filteredNames;
        } catch (err: any) {
            return null;
        }
    }

    /**
     * Returns an array of abstract path names denoting the files in the
     * directory denoted by this abstract pathname.
     *
     * If this abstract pathname does not denote a directory, then this
     * method returns {@code null}.
     *
     * Otherwise an array of {@code FileObject} objects is returned, one
     * for each file or directory in the directory.
     *
     * Path names denoting the directory itself and the directory's parent
     * directory are not included in the result.
     *
     * Each resulting abstract pathname is constructed from this abstract
     * pathname constructor.
     *
     * Therefore if this pathname is absolute then each resulting pathname
     * is absolute; if this pathname is relative then each resulting pathname
     * will be relative to the same directory.
     *
     * There is no guarantee that the name strings in the resulting array
     * will appear in any specific order; they are not, in particular,
     * guaranteed to appear in alphabetical order.
     *
     * If the given {@code filter} is {@code null} then all path names are
     * accepted.
     *
     * Otherwise, a pathname satisfies the filter if and only if the value
     * {@code true} results when the {@link FileFilter.accept} method of the
     * filter is invoked on the pathname.
     *
     * @param  filter A file filter
     * @return  An array of abstract path names denoting the files and
     *          directories in the directory denoted by this abstract pathname.
     *          The array will be empty if the directory is empty.
     *          Returns `null` if this abstract pathname does not denote a
     *          directory.
     * @see FileFilter
     */
    public listFiles(filter?: FileFilter): Array<FileObject> | null {
        const ss: Array<string> | null = this.list();
        if (ss === null) {
            return null;
        }
        const fs: Array<FileObject> = [];
        for (const name of ss) {
            const fileObject = new FileObject(this, name);
            if (!filter || filter.accept(fileObject)) {
                fs.push(fileObject);
            }
        }
        return fs;
    }

    /**
     * Creates the directory named by this abstract pathname.
     *
     * @return `true` if and only if the directory was created; `false`
     * otherwise
     */
    public mkdir(): boolean {
        if (this.exists) return false;
        mkdirSync(this.filePath);
        return true;
    }

    /**
     * Creates the directory named by this abstract pathname, including
     * any necessary but nonexistent parent directories.
     *
     * Note that if this operation fails it may have succeeded in creating
     * some of the necessary parent directories.
     *
     * @return `true` if and only if the directory was created, along with
     * all necessary parent directories; `false` otherwise
     */
    public mkdirs(): boolean {
        if (this.exists) return false;
        mkdirSync(this.filePath, {recursive: true});
        return true;
    }

    /**
     * @inheritDoc
     */
    public normalize(): Path {
        const parts: Array<string> = this.filePath.split(sep);
        const stack: Array<string> = [];

        for (const part of parts) {
            if (part === '.' || part === '') {
                continue;
            }
            if (part === '..') {
                if (stack.length > 0) {
                    stack.pop();
                }
            } else {
                stack.push(part);
            }
        }
        const normalizedPath: string = stack.join(sep);
        return new FileObject(normalizedPath);
    }

    /**
     * @inheritDoc
     */
    public relativize(other: Path | string): Path {
        const otherPath: string = typeof other === 'string' ? other : other.valueOf();
        const fromParts: Array<string> = this.filePath.split(sep);
        const toParts: Array<string> = otherPath.split(sep);
        // Remove common parts
        while (fromParts.length && toParts.length && fromParts[0] === toParts[0]) {
            fromParts.shift();
            toParts.shift();
        }
        // Add '..' for each remaining part in fromParts
        const relativeParts: Array<string> =
            fromParts.map(() => '..').concat(toParts);
        const relativePath: string = relativeParts.join(sep);
        return new FileObject(relativePath);
    }

    /**
     * Reads data from the file denoted by this abstract pathname.
     *
     * The method returns a `ReadStream` object that can be used to
     * monitor the read operation.
     *
     * @returns A `ReadStream` object that can be used to monitor the
     * read operation.
     * @see ReadStream
     */
    public read(): ReadStream {
        const readable: ReadStream = createReadStream(this.filePath);
        readable.on('data', this.onData.bind(this));
        readable.on('end', this.onEnd.bind(this));
        readable.on('error', this.onError.bind(this));
        return readable;
    }

    /**
     * Renames the file denoted by this abstract pathname.
     *
     * Many aspects of the behavior of this method are inherently
     * platform-dependent:
     *
     * The rename operation might not be able to move a file from one
     * filesystem to another, it might not be atomic, and it might not
     * succeed if a file with the destination abstract pathname
     * already exists.
     *
     * The return value should always be checked to make sure
     * that the rename operation was successful.
     *
     * @param  dest  The new abstract pathname for the named file
     * @return  <code>true</code> if and only if the renaming succeeded;
     *          <code>false</code> otherwise
     */
    public renameTo(dest: FileObject): boolean {
        try {
            renameSync(this.filePath, dest.toPath());
            this.filePath = dest.toPath();
            return true;
        } catch {
            return false;
        }
    }

    /**
     * @inheritDoc
     */
    public resolve(other: Path | string): Path {
        const otherPath: string = typeof other === 'string' ? other : other.valueOf();
        const resolvedPath: string = resolve(this.filePath, otherPath);
        return new FileObject(resolvedPath);
    }

    /**
     * @inheritDoc
     */
    public resolveSibling(other: Path | string): Path {
        const parentPath: string | null = this.parent;
        if (parentPath === null) {
            throw new ReferenceError('Cannot resolve sibling for a path with no parent');
        }
        const otherPath: string = typeof other === 'string' ? other : other.valueOf();
        const resolvedPath: string = resolve(parentPath, otherPath);
        return new FileObject(resolvedPath);
    }

    /**
     * Sets the owner's or everybody's execute permission for this abstract
     * pathname.
     *
     * @param   executable
     *          If <code>true</code>, sets the access permission to allow execute
     *          operations; if <code>false</code> to disallow execute operations
     * @param   ownerOnly
     *          If <code>true</code>, the execute permission applies only to the
     *          owner's execute permission; otherwise, it applies to everybody.
     *          If the underlying file system can not distinguish the owner's
     *          execute permission from that of others, then the permission will
     *          apply to everybody, regardless of this value.
     * @return  <code>true</code> if and only if the operation succeeded.  The
     *          operation will fail if the user does not have permission to
     *          change the access permissions of this abstract pathname.
     *          If <code>executable</code> is <code>false</code> and the
     *          underlying file system does not implement an execute permission,
     *          then the operation will fail.
     */
    public setExecutable(executable: boolean, ownerOnly: boolean = true): boolean {
        try {
            const mode: number = executable ? (ownerOnly ? 0o100 : 0o111) : (ownerOnly ? 0o200 : 0o222);
            chmodSync(this.filePath, mode);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Sets the last-modified time of the file or directory named by this
     * abstract pathname.
     *
     * All platforms support file-modification times to the nearest second,
     * but some provide more precision.
     *
     * The argument will be truncated to fit the supported precision.
     *
     * If the operation succeeds and no intervening operations on the file
     * take place, then the next invocation of the {@link lastModified}
     * method will return the (possibly truncated) `time` argument that
     * was passed to this method.
     *
     * @param  time  The new last-modified time, measured in milliseconds since
     *               the epoch (00:00:00 GMT, January 1, 1970)
     *
     * @return <code>true</code> if and only if the operation succeeded;
     *          <code>false</code> otherwise
     */
    public setLastModified(time: number): boolean {
        try {
            utimesSync(this.filePath, new Date(), new Date(time));
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Sets the owner's or everybody's read permission for this abstract
     * pathname.
     *
     * @param readable - If `true`, sets the access permission to allow
     * read operations; if `false` to disallow read operations.
     * @param ownerOnly - If `true`, the read permission applies only to
     * the owner's read permission; otherwise, it applies to everybody.
     *                    If the underlying file system cannot distinguish the
     *                    owner's read permission from that of others, then the
     *                    permission will apply to everybody, regardless of this value.
     * @returns `true` if and only if the operation succeeded.
     * The operation will fail if the user does not have permission to
     * change the access permissions of this abstract pathname.
     */
    public setReadable(readable: boolean, ownerOnly: boolean = true): boolean {
        try {
            const mode: number = readable ? (ownerOnly ? 0o400 : 0o444) : (ownerOnly ? 0o200 : 0o222);
            chmodSync(this.filePath, mode);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Marks the file or directory named by this abstract pathname so that
     * only read operations are allowed.
     *
     * After invoking this method the file or directory is guaranteed not to
     * change until it is either deleted or marked to allow write access.
     *
     * Whether or not a read-only file or directory may be deleted depends
     * upon the underlying system.
     *
     * @return <code>true</code> if and only if the operation succeeded;
     *          <code>false</code> otherwise
     */
    public setReadOnly(): boolean {
        try {
            chmodSync(this.filePath, 0o444);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Sets the owner's or everybody's write permission for this abstract
     * pathname.
     *
     * @param   writable
     *          If <code>true</code>, sets the access permission to allow write
     *          operations; if <code>false</code> to disallow write operations
     * @param   ownerOnly
     *          If <code>true</code>, the write permission applies only to the
     *          owner's write permission; otherwise, it applies to everybody.
     *
     *          If the underlying file system can not distinguish the owner's write
     *          permission from that of others, then the permission will apply to
     *          everybody, regardless of this value.
     * @return  <code>true</code> if and only if the operation succeeded.
     *          The operation will fail if the user does not have permission to
     *          change the access permissions of this abstract pathname.
     */
    public setWritable(writable: boolean, ownerOnly: boolean = true): boolean {
        try {
            const mode: number = writable ?
                (ownerOnly ? 0o200 : 0o222) :
                (ownerOnly ? 0o400 : 0o444);
            chmodSync(this.filePath, mode);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * @inheritDoc
     */
    public startsWith(other: Path | string): boolean {
        const otherPath: string = typeof other === 'string' ? other : other.valueOf();
        return this.filePath.startsWith(otherPath);
    }


    /**
     * @inheritDoc
     */
    public subpath(beginIndex: number = 0, endIndex: number = -1): Path {
        const names: Array<string> = this.filePath.split(sep).filter(Boolean);
        if (endIndex === -1) {
            endIndex = names.length;
        }
        if (beginIndex < 0 || endIndex > names.length || beginIndex >= endIndex) {
            throw new RangeError('Invalid subpath indices');
        }
        const subpath: string = names.slice(beginIndex, endIndex).join(sep);
        return new FileObject(subpath);
    }

    /**
     * Synchronizes the file statistics for the current file path.
     *
     * This method updates the `fileStats` property with the latest
     * statistics of the file denoted by the current file path.
     */
    public sync(): void {
        this.fileStats = FileStats.get(this.filePath);
    }

    /**
     * @inheritDoc
     */
    public toAbsolutePath(): Path {
        if (this.isAbsolute) {
            return this;
        }
        const absolutePath: string = resolve(this.filePath);
        return new FileObject(absolutePath);
    }

    /**
     * @inheritDoc
     */
    public toRealPath(options?: EncodingOption): Path {
        const realPath: string = realpathSync(this.filePath, options);
        return new FileObject(realPath);
    }

    /**
     * Returns a path object constructed from the abstract path.
     *
     * If this abstract pathname is the empty abstract pathname then this
     * method returns a path that may be used to access the current
     * user directory.
     *
     * @return  a path constructed from this abstract path
     */
    public toPath(): string {
        return this.path;
    }

    /**
     * Returns the pathname string of this abstract pathname.
     *
     * This is just the string returned by the {@link path} method.
     *
     * @return  The string form of this abstract pathname
     */
    public toString(): string {
        return this.filePath;
    }

    /**
     * @inheritDoc
     */
    public valueOf(): string {
        return this.filePath;
    }

    /**
     * Watches for changes on the file or directory denoted by this abstract pathname.
     *
     * The callback function is invoked with the event type and the filename when a change is detected.
     * The filename parameter can be `null` if the filename is not provided by the underlying system.
     *
     * @param callback - A function to be called when a change is detected. The function receives two arguments:
     *                   - `eventType`: A string indicating the type of change (`"rename"` or `"change"`).
     *                   - `filename`: A string representing the name of the file that changed, or `null` if not provided.
     * @returns An `FSWatcher` object that can be used to stop watching for changes.
     * @see WatchHandler
     * @see FSWatcher
     */
    public watch(callback: WatchHandler): FSWatcher {
        const watcher: FSWatcher = watch(
            this.filePath, (eventType: WatchEventType, filename: string | null) => {
                if (filename !== null) {
                    this.onWatch(callback, eventType, filename);
                } else {
                    callback(eventType, null);
                }
            }
        );
        return watcher;
    }

    /**
     * Writes data to the file denoted by this abstract pathname.
     *
     * The data can be either a `Buffer` or a `string`.
     * The method returns a `WriteStream` object that can be used to
     * monitor the write operation.
     *
     * @param data - The data to be written to the file. It can be a `Buffer` or a `string`.
     * @returns A `WriteStream` object that can be used to monitor the
     * write operation.
     * @see Buffer
     * @see WriteStream
     */
    public write(data: Buffer | string): WriteStream {
        const writable: WriteStream = createWriteStream(this.filePath);
        writable.write(data);
        writable.on('finish', this.onFinish.bind(this));
        writable.on('error', this.onError.bind(this));
        return writable;
    }

    protected onData(chunk: Buffer): void {
        this.emit('data', chunk);
    }

    protected onEnd(): void {
        this.emit('end');
    }

    protected onError(err: Error): void {
        this.emit('error', err);
    }

    protected onFinish(): void {
        this.emit('finish');
    }

    protected onWatch(callback: (eventType: string, filename: string) => void, eventType: string, filename: string): void {
        this.emit('watch', eventType, filename);
        callback(eventType, filename);
    }
}
