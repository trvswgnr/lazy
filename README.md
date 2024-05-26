# Lazy

Lazy is a TypeScript library for working with deferred computations, providing both functional and object-oriented APIs. This library is useful for optimizing performance by deferring expensive computations until their results are needed.

## Features

- **Deferred Computations**: Create and manage deferred computations.
- **Functional API**: Use functional constructs to work with lazy values.
- **OOP API**: Use object-oriented constructs to work with lazy values.
- **Exception Handling**: Safely handle exceptions that occur during deferred computations.
- **Value Caching**: Cache the results of computations to avoid redundant executions.
- **Flexible Mapping**: Map functions over lazy values to transform their results.

## Installation

Install the library using npm:

```bash
npm install @travvy/lazy
```

## Usage

### Functional API (default)

The functional API is at `@travvy/lazy`.

#### Creating a Lazy Value

```typescript
import Lazy from '@travvy/lazy';

const lazyValue = Lazy(() => {
  // some expensive computation
  return 69;
});
```

#### Forcing a Lazy Value

```typescript
const result = Lazy.force(lazyValue);
console.log(result); // 69
```

#### Mapping a Function Over a Lazy Value

```typescript
const mappedValue = Lazy.map((x: number) => x * 2, lazyValue);
const result = Lazy.force(mappedValue);
console.log(result); // 138
```

### Object-Oriented API

The object-oriented API is available in `@travvy/lazy/oop`.

#### Creating a Lazy Instance

```typescript
import Lazy from '@travvy/lazy/oop';

const lazyInstance = new Lazy(() => {
  // some expensive computation
  return 69;
});
```

#### Forcing a Lazy Instance

```typescript
const result = lazyInstance.force();
console.log(result); // 69
```

#### Mapping a Function Over a Lazy Instance

```typescript
const mappedInstance = lazyInstance.map((x: number) => x * 2);
const result = mappedInstance.force();
console.log(result); // 138
```

### Handling Exceptions

Both APIs handle exceptions that occur during deferred computations.

```typescript
const faultyLazy = Lazy(() => {
  throw new Error("Something went wrong");
});

try {
  Lazy.force(faultyLazy);
} catch (e) {
  console.error(e); // Error: Something went wrong
}
```

## API Reference

### Functional API

#### `Lazy<T>(sus: () => T): Lazy<T>`

Creates a new lazy value.

#### `Lazy.force<T>(x: Lazy<T>): T`

Forces the computation and returns its result.

#### `Lazy.map<A, B>(f: (x: A) => B, x: Lazy<A>): Lazy<B>`

Maps a function over a lazy value.

#### `Lazy.isVal<T>(x: Lazy<T>): x is Val<T>`

Checks if a lazy value has been evaluated.

#### `Lazy.fromVal<T>(v: T): Lazy<T>`

Creates a lazy value from an already-evaluated value.

#### `Lazy.mapVal<T, U>(f: (x: T) => U, x: Lazy<T>): Lazy<U>`

Maps a function over a lazy value if it has been evaluated.

### Object-Oriented API

#### `new Lazy<T>(sus: () => T)`

Creates a new lazy instance.

#### `Lazy.prototype.force(): T`

Forces the computation and returns its result.

#### `Lazy.prototype.map<B>(f: (x: T) => B): Lazy<B>`

Maps a function over a lazy instance.

#### `Lazy.fromVal<T>(v: T): Lazy<T>`

Creates a lazy instance from an already-evaluated value.

#### `Lazy.from<T>(f: () => T): Lazy<T>`

Creates a lazy instance from a function.

#### `Lazy.prototype.mapVal<U>(f: (x: T) => U): Lazy<U>`

Maps a function over a lazy instance if it has been evaluated.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or suggestions, please [open an issue](https://github.com/trvswgnr/lazy/issues).

---

Feel free to explore the source code and improve upon it.