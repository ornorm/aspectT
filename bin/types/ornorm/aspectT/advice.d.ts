import { MethodDeclarationStructure } from 'ts-morph';
/**
 * Creates an advice method.
 * @param name - The name of the advice.
 * @param type - The type of the advice (before, after, around).
 * @param formals - The formal parameters of the advice.
 * @param pointcut - The pointcut expression.
 * @param body - The body of the advice.
 * @returns The created advice method.
 */
export declare function createAdvice(name: string, type: 'before' | 'after' | 'around', formals: string, pointcut: string, body: string): MethodDeclarationStructure;
