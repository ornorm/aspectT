import { ClassDeclaration, MethodDeclarationStructure, ConstructorDeclarationStructure, PropertyDeclarationStructure } from 'ts-morph';
/**
 * Type alias for an abstract method form.
 * Represents an abstract method that takes a value of type T and returns a value of type R.
 *
 * @template T - The type of the input value.
 * @template R - The type of the return value.
 */
export type AbstractMethodForm<T = any, R = any> = abstract new (value: T) => R;
/**
 * Type alias for a constructor form.
 * Represents a constructor that takes a variable number of arguments of type T and returns an instance of type T.
 *
 * @template T - The type of the constructor arguments and the return value.
 */
export type ConstructorForm<T = any> = new (...args: T[]) => T;
/**
 * Type alias for a method form.
 * Represents a method that takes a value of type T and returns a value of type R.
 *
 * @template T - The type of the input value.
 * @template R - The type of the return value.
 */
export type MethodForm<T = any, R = any> = (value: T) => R;
/**
 * Type alias for a property form.
 * Represents a property of type T.
 *
 * @template T - The type of the property.
 */
export type PropertyForm<T = any> = T;
/**
 * Type alias for an array of member declarations.
 * Represents an array that can contain method, constructor, or property declarations.
 * @see MethodDeclarationStructure
 * @see ConstructorDeclarationStructure
 * @see PropertyDeclarationStructure
 */
export type MemberDeclarationsArray = Array<MethodDeclarationStructure | ConstructorDeclarationStructure | PropertyDeclarationStructure>;
/**
 * Declares that the `superclass` of a given class is another `class`.
 *
 * @param aspectClass - The `aspect` class.
 * @param className - The name of the `class` whose `superclass` is
 * being declared.
 * @param superClassName - The name of the `superclass`.
 *
 * @example
 * declareParentsExtends(aspectClass, 'C', 'D');
 * @throws ReferenceError if the class or superclass is not found.
 * @see ClassDeclaration
 */
export declare function declareParentsExtends(aspectClass: ClassDeclaration, className: string, superClassName: string): void;
/**
 * Checks if the inheritance is legal according to `AspectJ` specifications.
 *
 * @param aspectClass - The `aspect` class.
 * @param className - The name of the `class`.
 * @param superClassName - The name of the `superclass`.
 * @returns  Returns true if the inheritance is legal, false otherwise.
 * @throws ReferenceError if the class or superclass is not found.
 * @see ClassDeclaration
 */
export declare function isLegalInheritance(aspectClass: ClassDeclaration, className: string, superClassName: string): boolean;
/**
 * Declares that a given `class` implements one or more interfaces.
 *
 * @param aspectClass - The `aspect` class.
 * @param className - The name of the `class.
 * @param interfaces - The interfaces that the `class` implements.
 *
 * @example
 * declareParentsImplements(aspectClass, 'C', ['I', 'J']);
 * @see ClassDeclaration
 */
export declare function declareParentsImplements(aspectClass: ClassDeclaration, className: string, interfaces: Array<string>): void;
/**
 * Checks if the `class` implements the given interfaces.
 *
 * @param aspectClass - The `aspect` class.
 * @param className The name of the `class`.
 * @param interfaces The interfaces that the `class` should implement.
 * @returns  Returns true if the class implements the interfaces, false
 * otherwise.
 * @throws ReferenceError if the class is not found.
 * @see ClassDeclaration
 */
export declare function areInterfacesImplemented(aspectClass: ClassDeclaration, className: string, interfaces: Array<string>): boolean;
/**
 * Declares a compiler `warning` for a specified `pointcut`.
 *
 * @param aspectClass - The `aspect` class.
 * @param pointcut - The `pointcut` at which the `warning` should be
 * issued.
 * @param message - The `warning` message.
 *
 * @example
 * declareWarning(aspectClass, 'set(* Point.*) && !within(Point)', 'bad set');
 */
export declare function declareWarning(aspectClass: ClassDeclaration, pointcut: string, message: string): void;
/**
 * Declares a compiler `error` for a specified `pointcut`.
 *
 * @param aspectClass - The `aspect` class.
 * @param pointcut - The `pointcut` at which the error should be issued.
 * @param message - The `error` message.
 *
 * @example
 * declareError(aspectClass, 'call(Singleton.new(..))', 'bad construction');
 */
export declare function declareError(aspectClass: ClassDeclaration, pointcut: string, message: string): void;
/**
 * Declares that any exceptions of a specified type thrown from a pointcut
 * should be wrapped in a soft exception.
 *
 * @param exceptionType - The type of exception.
 * @param pointcut - The pointcut at which the exception should be wrapped.
 *
 * @example
 * declareSoft(aspectClass, 'IOException', 'execution(Foo.new(..))');
 */
export declare function declareSoft(aspectClass: ClassDeclaration, exceptionType: string, pointcut: string): void;
/**
 * Declares the precedence of aspects at each join point.
 *
 * @param aspects - The list of aspects in order of precedence.
 *
 * @example
 * declarePrecedence(['Security', 'Logging', '*']);
 */
export declare function declarePrecedence(aspectClass: ClassDeclaration, aspects: string[]): void;
/**
 * Declares an annotation on a specified type.
 *
 * @param type - The type to be annotated.
 * @param annotation - The annotation to be declared.
 *
 * @example
 * declareTypeAnnotation('C', '@SomeAnnotation');
 */
export declare function declareTypeAnnotation(aspectClass: ClassDeclaration, type: string, annotation: string): void;
/**
 * Declares an annotation on all methods matching a specified pattern.
 *
 * @param methodPattern - The method pattern to be annotated.
 * @param annotation - The annotation to be declared.
 *
 * @example
 * declareMethodAnnotation('* C.foo*(..)', '@SomeAnnotation');
 */
export declare function declareMethodAnnotation(aspectClass: ClassDeclaration, methodPattern: string, annotation: string): void;
/**
 * Declares an annotation on all constructors matching a specified pattern.
 *
 * @param constructorPattern - The constructor pattern to be annotated.
 * @param annotation - The annotation to be declared.
 *
 * @example
 * declareConstructorAnnotation('C.new(..)', '@SomeAnnotation');
 */
export declare function declareConstructorAnnotation(aspectClass: ClassDeclaration, constructorPattern: string, annotation: string): void;
/**
 * Declares an annotation on all fields matching a specified pattern.
 *
 * @param fieldPattern - The field pattern to be annotated.
 * @param annotation - The annotation to be declared.
 *
 * @example
 * declareFieldAnnotation('* C.*', '@SomeAnnotation');
 */
export declare function declareFieldAnnotation(aspectClass: ClassDeclaration, fieldPattern: string, annotation: string): void;
/**
 * Validates and adds general `inter-type` forms to the aspect class.
 * @param aspectClass - The aspect class to which the `inter-type`
 * forms are added.
 * @param members - The array of member declarations (methods,
 * constructors, and fields) to add to the aspect.
 * @see MemberDeclarationsArray
 */
export declare function addInterTypeMember(aspectClass: ClassDeclaration, members: MemberDeclarationsArray): void;
/**
 * Creates an aspect class with the specified properties and `inter-type`
 * member declarations.
 * @param name - The name of the aspect class.
 * @param isPrivileged - Indicates if the aspect is privileged (can access
 * private fields and methods).
 * @param extendsClass - The class that this aspect extends (if any).
 * @param implementsInterfaces - The interfaces that this aspect
 * implements (if any).
 * @param perClause - The PerClause definition for the aspect (if any).
 * @param members - The array of member declarations (methods,
 * constructors, and fields) to add to the aspect.
 * @returns The created aspect class.
 * @see ClassDeclaration
 * @see MemberDeclarationsArray
 */
export declare function createAspectClass(name: string, isPrivileged: boolean, extendsClass?: string, implementsInterfaces?: Array<string>, perClause?: string, members?: MemberDeclarationsArray): ClassDeclaration;
