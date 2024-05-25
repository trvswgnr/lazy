# Lazy

This is a TypeScript library designed to facilitate lazy evaluation in both functional and object-oriented programming styles. This library provides tools to defer computations until their results are needed, enhancing performance and resource utilization for heavy or infrequently accessed operations.

## Features

-   **Lazy Evaluation**: Defer the computation of values until they are actually required.
-   **Functional and OOP Styles**: Supports both functional programming (FP) and object-oriented programming (OOP) paradigms.
-   **Error Handling**: Gracefully handles exceptions, allowing computations to throw errors only when they are evaluated.
-   **Memoization**: Automatically caches results of computations, ensuring that each deferred computation is only performed once.

## Modules

### LazyFP.ts (Functional Programming)

-   **Lazy<T> Type**: Represents a deferred computation that can produce a value of type T.
-   **Lazy.force**: Forces the evaluation of a lazy computation.
-   **Lazy.map**: Transforms the result of a lazy computation using a provided function, without immediately triggering computation.
-   **Lazy.fromVal**: Creates an already-evaluated lazy computation from a value.

### LazyOOP.ts (Object-Oriented Programming)

-   **Lazy Class**: Encapsulates a deferred computation in an object-oriented manner.
-   **force Method**: Forces the evaluation of the lazy computation encapsulated by a Lazy object.
-   **map Method**: Similar to LazyFP's map, but as an instance method.
-   **mapVal Method**: Applies a function to a forced Lazy object's value, or defers the application until evaluation.

## Installation

To use this library, include it in your TypeScript project:

```bash
npm install @travvy/lazy
```

## Usage

```ts
import { Lazy } from "@travvy/lazy/fp";

const lazyValue = Lazy(() => s10);
const result = Lazy.force(lazyValue);
```

or

```ts
import { Lazy } from "@travvy/lazy/oop";

const lazyValue = Lazy.from(() => 10);
const result = lazyValue.force();
```
