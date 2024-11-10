import {FileObject, FileStats} from '@ornorm/aspectT';

/**
 * Defines the file tree traversal options.
 */
export enum FileVisitOption {
    /**
     * Follow symbolic links.
     */
    FOLLOW_LINKS,
}

/**
 * The result type of a {@link FileVisitor}.
 */
export enum FileVisitResult {
    /**
     * Continue.
     * When returned from a {@link FileVisitor.preVisitDirectory}
     * method then the entries in the directory should also be visited.
     */
    CONTINUE,
    /**
     * Terminate.
     */
    TERMINATE,
    /**
     * Continue without visiting the entries in this directory.
     *
     * This result is only meaningful when returned from the {@link
     * FileVisitor.preVisitDirectory} method; otherwise
     * this result type is the same as returning {@link CONTINUE}.
     */
    SKIP_SUBTREE,
    /**
     * Continue without visiting the `siblings` of this file or directory.
     *
     * If returned from the {@link FileVisitor.preVisitDirectory} method then
     * the entries in the directory are also skipped and the
     * {@link FileVisitor.postVisitDirectory} method is not invoked.
     */
    SKIP_SIBLINGS,
}

export interface FileVisitor<T = number> {
    /**
     * Invoked for a directory before entries in the directory are visited.
     *
     * Unless overridden, this method returns {@link FileVisitResult.CONTINUE}.
     * @see FileVisitResult
     */
    preVisitDirectory(dir: T, attrs: FileStats): FileVisitResult;

    /**
     * Invoked for a file in a directory.
     *
     * Unless overridden, this method returns {@link FileVisitResult.CONTINUE}.
     * @see FileVisitResult
     */
    visitFile(file: T, attrs: FileStats): FileVisitResult;

    /**
     * Invoked for a file that could not be visited.
     *
     * Unless overridden, this method re-throws the I/O exception that
     * prevented the file from being visited.
     * @see FileVisitResult
     */
    visitFileFailed(file: T, exc?: Error): FileVisitResult;

    /**
     * Invoked for a directory after entries in the directory, and all of their
     * descendants, have been visited.
     *
     * Unless overridden, this method returns {@link FileVisitResult.CONTINUE}
     * if the directory iteration completes without an I/O exception;
     * otherwise this method re-throws the I/O exception that caused the
     * iteration of the directory to terminate prematurely.
     * @see FileVisitResult
     */
    postVisitDirectory(dir: T, attrs?: Error): FileVisitResult;
}

/**
 * A simple visitor of files with default behavior to visit all files and to
 * re-throw I/O errors.
 *
 * Methods in this class may be overridden subject to their general
 * contract.
 * @param   <T>     The type of reference to the files
 * @see FileVisitor
 */
export class SimpleFileVisitor<T = string> implements FileVisitor<T> {
    /**
     * @inheritDoc
     */
    public preVisitDirectory(dir: T, attrs: FileStats): FileVisitResult {
        if (!dir || !attrs) throw new Error('Arguments cannot be null');
        return FileVisitResult.CONTINUE;
    }

    /**
     * @inheritDoc
     */
    public visitFile(file: T, attrs: FileStats): FileVisitResult {
        if (!file || !attrs) throw new Error('Arguments cannot be null');
        return FileVisitResult.CONTINUE;
    }

    /**
     * @inheritDoc
     */
    public visitFileFailed(file: T, exc?: Error): FileVisitResult {
        if (!file) {
            throw new ReferenceError('File argument cannot be null');
        }
        throw exc;
    }

    /**
     * @inheritDoc
     */
    public postVisitDirectory(dir: T, exc?: Error): FileVisitResult {
        if (!dir) {
            throw new ReferenceError('Directory argument cannot be null');
        }
        if (exc) {
            throw exc;
        }
        return FileVisitResult.CONTINUE;
    }
}

export class FileTreeWalker {
    private followLinks: boolean;
    private linkOptions: Array<LinkOption>;
    private visitor: FileVisitor<FileObject>;
    private maxDepth: number;
    private fileCache: Map<string, FileObject> = new Map<string, FileObject>();

    constructor(
        options: Set<FileVisitOption>,
        visitor: FileVisitor<FileObject>,
        maxDepth: number
    ) {
        this.followLinks = options.has(FileVisitOption.FOLLOW_LINKS);
        this.linkOptions = this.followLinks ? [] : [LinkOption.NOFOLLOW_LINKS];
        this.visitor = visitor;
        this.maxDepth = maxDepth;
    }

    public walk(start: FileObject): void {
        const result: FileVisitResult | null = this.walkInternal(start, 0, []);
        if (result === null) {
            throw new TypeError("FileVisitor returned null");
        }
    }

    private walkInternal(file: FileObject, depth: number, ancestors: Array<FileObject>): FileVisitResult {
        let attrs: FileStats | null = null;
        let exc: Error | null = null;
        if (depth > 0) {
            const cached: FileObject | undefined = this.fileCache.get(file.toString());
            if (!this.followLinks || !cached?.isSymbolicLink) {
                attrs = cached;
            }
        }

        if (attrs === null) {
            try {
                attrs = FileObject.readAttributes(file, BasicFileAttributes, ...this.linkOptions);
            } catch (x1) {
                if (this.followLinks) {
                    try {
                        attrs = FileObject.readAttributes(file, BasicFileAttributes, LinkOption.NOFOLLOW_LINKS);
                    } catch (x2) {
                        exc = x2;
                    }
                } else {
                    exc = x1;
                }
            }
        }

        if (exc !== null) {
            return this.visitor.visitFileFailed(file, exc);
        }

        if (depth >= this.maxDepth || !attrs.isDirectory()) {
            return this.visitor.visitFile(file, attrs);
        }

        if (this.followLinks) {
            const key = attrs.fileKey();
            for (const ancestor of ancestors) {
                const ancestorKey = ancestor.fileKey();
                if (key !== null && ancestorKey !== null) {
                    if (key.equals(ancestorKey)) {
                        return this.visitor.visitFileFailed(file, new FileSystemLoopException(file.toString()));
                    }
                } else {
                    let isSameFile = false;
                    try {
                        isSameFile = FileObject.isSameFile(file, ancestor.file());
                    } catch {
                        // ignore
                    }
                    if (isSameFile) {
                        return this.visitor.visitFileFailed(file, new FileSystemLoopException(file.toString()));
                    }
                }
            }
            ancestors.push(new AncestorDirectory(file, key));
        }

        let result: FileVisitResult;
        let stream: DirectoryStream<Path> | null = null;
        let ioe: IOException | null = null;

        try {
            stream = FileObject.newDirectoryStream(file);
        } catch (x) {
            return this.visitor.visitFileFailed(file, x);
        }

        try {
            result = this.visitor.preVisitDirectory(file, attrs);
            if (result !== FileVisitResult.CONTINUE) {
                return result;
            }

            try {
                for (const entry of stream) {
                    result = this.walkInternal(entry, depth + 1, ancestors);
                    if (result === null || result === FileVisitResult.TERMINATE) {
                        return result;
                    }
                    if (result === FileVisitResult.SKIP_SIBLINGS) {
                        break;
                    }
                }
            } catch (e) {
                if (e instanceof DirectoryIteratorException) {
                    ioe = e.getCause();
                }
            }
        } finally {
            try {
                stream.close();
            } catch (e) {
                if (ioe === null) {
                    ioe = e;
                }
            }
        }

        return this.visitor.postVisitDirectory(file, ioe);
    }
}
