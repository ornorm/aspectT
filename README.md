# Spectral

![GitHub package.json version](https://img.shields.io/github/package-json/v/YourUsername/spectral)
![GitHub](https://img.shields.io/github/license/YourUsername/spectral)
![GitHub issues](https://img.shields.io/github/issues/YourUsername/spectral)
![GitHub pull requests](https://img.shields.io/github/issues-pr/YourUsername/spectral)

## Description

Spectral is a powerful and flexible Aspect-Oriented Programming (AOP) library for TypeScript. It allows you to modularize cross-cutting concerns, such as logging, security, and transaction management, by separating them from the business logic.

## Installation

To install Spectral, use npm:

```bash
npm install spectral
```

## Usage

### Creating an Aspect Class

You can create an aspect class using the `createAspectClass` function. This function allows you to define properties, methods, and inter-type member declarations for the aspect.

```typescript
import { createAspectClass, MemberDeclarationsArray } from 'spectral';

const members: MemberDeclarationsArray = [
{ kind: StructureKind.Method, name: 'exampleMethod', returnType: 'void', parameters: [] },
{ kind: StructureKind.Constructor, parameters: [] },
{ kind: StructureKind.Property, name: 'exampleProperty', type: 'string', initializer: `'example'` }
];

const aspectClass = createAspectClass('ExampleAspectClass', true, 'SuperClass', ['Interface1', 'Interface2'], 'perthis(call(void Foo.m()))', members);
```

### Declaring Annotations

Spectral provides functions to declare annotations on types, methods, constructors, and fields.

#### Type Annotation

```typescript
declareTypeAnnotation(aspectClass, 'C', '@SomeAnnotation');
```

#### Method Annotation

```typescript
declareMethodAnnotation(aspectClass, '* C.foo*(..)', '@SomeAnnotation');
```

#### Constructor Annotation

```typescript
declareConstructorAnnotation(aspectClass, 'C.new(..)', '@SomeAnnotation');
```

#### Field Annotation

```typescript
declareFieldAnnotation(aspectClass, '* C.*', '@SomeAnnotation');
```

### Adding Inter-Type Members

You can add inter-type members (methods, constructors, and fields) to an aspect class using the `addInterTypeMember` function.

```typescript
const members: MemberDeclarationsArray = [
{ kind: StructureKind.Method, name: 'exampleMethod', returnType: 'void', parameters: [] },
{ kind: StructureKind.Constructor, parameters: [] },
{ kind: StructureKind.Property, name: 'exampleProperty', type: 'string', initializer: `'example'` }
];

addInterTypeMember(aspectClass, members);
```

## Example

Here is a complete example of creating an aspect class and declaring various annotations:

```typescript
import { Project, StructureKind, ClassDeclaration } from 'ts-morph';
import { createAspectClass, declareTypeAnnotation, declareMethodAnnotation, declareConstructorAnnotation, declareFieldAnnotation, addInterTypeMember } from 'spectral';

const project = new Project();
const sourceFile = project.createSourceFile('Aspects.ts', '', { overwrite: true });

const exampleClass: ClassDeclaration = sourceFile.addClass({
name: 'ExampleAspect',
isAbstract: false,
kind: StructureKind.Class
});

declareTypeAnnotation(exampleClass, 'C', '@SomeAnnotation');
declareMethodAnnotation(exampleClass, '* C.foo*(..)', '@SomeAnnotation');
declareConstructorAnnotation(exampleClass, 'C.new(..)', '@SomeAnnotation');
declareFieldAnnotation(exampleClass, '* C.*', '@SomeAnnotation');

const members: MemberDeclarationsArray = [
{ kind: StructureKind.Method, name: 'exampleMethod', returnType: 'void', parameters: [] },
{ kind: StructureKind.Constructor, parameters: [] },
{ kind: StructureKind.Property, name: 'exampleProperty', type: 'string', initializer: `'example'` }
];

addInterTypeMember(exampleClass, members);

createAspectClass('ExampleAspectClass', true, 'SuperClass', ['Interface1', 'Interface2'], 'perthis(call(void Foo.m()))', members);

project.save().then(() => {
console.log('Aspects.ts has been updated with new functions and examples');
});
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
