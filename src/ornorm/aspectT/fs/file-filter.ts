import {Fileobject} from '@ornorm/aspectT';

/**
 * A filter for abstract path names.
 *
 * Instances of this interface may be passed to the `listFiles`
 * method of the `FileObject` class.
 *
 * @see Fileobject
 */
export interface FileFilter {
    /**
     * Tests whether or not the specified abstract pathname should be
     * included in a pathname list.
     *
     * @param  pathname  The abstract pathname to be tested
     * @return  <code>true</code> if and only if <code>pathname</code>
     *          should be included
     * @see Fileobject
     */
    accept(pathname: Fileobject): boolean;
}
