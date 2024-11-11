/**
 * This TypeScript code is a port of the FileFilter interface originally written in Java.
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

import {FileStats} from '@ornorm/aspectT';

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
     * This result is only meaningful when returned from the
     * {@link FileVisitor.preVisitDirectory} method; otherwise
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

/**
 * A visitor of files.
 *
 * An implementation of this interface is provided to the {@link Files.walkFileTree}
 */
export interface FileVisitor<T = number> {
    /**
     * Invoked for a directory before entries in the directory are visited.
     *
     * Unless overridden, this method returns
     * {@link FileVisitResult.CONTINUE}.
     * @see FileVisitResult
     */
    preVisitDirectory(dir: T, attrs: FileStats<any>): FileVisitResult;

    /**
     * Invoked for a file in a directory.
     *
     * Unless overridden, this method returns {@link FileVisitResult.CONTINUE}.
     * @see FileVisitResult
     */
    visitFile(file: T, attrs: FileStats<any>): FileVisitResult;

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
     * Unless overridden, this method returns
     * {@link FileVisitResult.CONTINUE}
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
    public preVisitDirectory(dir: T, attrs: FileStats<T>): FileVisitResult {
        if (!dir || !attrs) throw new Error('Arguments cannot be null');
        return FileVisitResult.CONTINUE;
    }

    /**
     * @inheritDoc
     */
    public visitFile(file: T, attrs: FileStats<T>): FileVisitResult {
        if (!file || !attrs) {
            throw new ReferenceError('Arguments cannot be null');
        }
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


