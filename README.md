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

The default functional API is at `@travvy/lazy`.

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

The object-oriented API is available at `@travvy/lazy/oop`.

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

<table>
  <thead>
    <tr>
      <th>Function</th>
      <th>Description</th>
      <th>Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>Lazy&lt;T&gt;(sus: () => T): Lazy&lt;T&gt;</code></td>
      <td>Creates a new lazy value.</td>
      <td>
        <pre lang="ts">
import Lazy from '@travvy/lazy/fp';

const lazyValue = Lazy(() => {
  // Some expensive computation
  return 42;
});
        </pre>
      </td>
    </tr>
    <tr>
      <td><code>Lazy.force&lt;T&gt;(x: Lazy&lt;T&gt;): T</code></td>
      <td>Forces the computation and returns its result.</td>
      <td>
        <pre lang="ts">
const result = Lazy.force(lazyValue);
console.log(result); // 42
        </pre>
      </td>
    </tr>
    <tr>
      <td><code>Lazy.map&lt;A, B&gt;(f: (x: A) => B, x: Lazy&lt;A&gt;): Lazy&lt;B&gt;</code></td>
      <td>Maps a function over a lazy value.</td>
      <td>
        <pre lang="ts">
const mappedValue = Lazy.map((x: number) => x * 2, lazyValue);
const result = Lazy.force(mappedValue);
console.log(result); // 84
        </pre>
      </td>
    </tr>
    <tr>
      <td><code>Lazy.isVal&lt;T&gt;(x: Lazy&lt;T&gt;): x is Val&lt;T&gt;</code></td>
      <td>Checks if a lazy value has been evaluated.</td>
      <td>
        <pre lang="ts">
if (Lazy.isVal(lazyValue)) {
  console.log('Value is already evaluated');
}
        </pre>
      </td>
    </tr>
    <tr>
      <td><code>Lazy.fromVal&lt;T&gt;(v: T): Lazy&lt;T&gt;</code></td>
      <td>Creates a lazy value from an already-evaluated value.</td>
      <td>
        <pre lang="ts">
const eagerValue = Lazy.fromVal(42);
        </pre>
      </td>
    </tr>
    <tr>
      <td><code>Lazy.mapVal&lt;T, U&gt;(f: (x: T) => U, x: Lazy&lt;T&gt;): Lazy&lt;U&gt;</code></td>
      <td>Maps a function over a lazy value if it has been evaluated.</td>
      <td>
        <pre lang="ts">
const mappedVal = Lazy.mapVal((x: number) => x * 2, lazyValue);
const result = Lazy.force(mappedVal);
console.log(result); // 84
        </pre>
      </td>
    </tr>
  </tbody>
</table>

### Object-Oriented API

<table>
  <thead>
    <tr>
      <th>Function</th>
      <th>Description</th>
      <th>Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>new Lazy&lt;T&gt;(sus: () => T)</code></td>
      <td>Creates a new lazy instance.</td>
      <td>
        <pre lang="ts">
import Lazy from '@travvy/lazy/oop';

const lazyInstance = new Lazy(() => {
  // Some expensive computation
  return 42;
});
        </pre>
      </td>
    </tr>
    <tr>
      <td><code>Lazy.prototype.force(): T</code></td>
      <td>Forces the computation and returns its result.</td>
      <td>
        <pre lang="ts">
const result = lazyInstance.force();
console.log(result); // 42
        </pre>
      </td>
    </tr>
    <tr>
      <td><code>Lazy.prototype.map&lt;B&gt;(f: (x: T) => B): Lazy&lt;B&gt;</code></td>
      <td>Maps a function over a lazy instance.</td>
      <td>
        <pre lang="ts">
const mappedInstance = lazyInstance.map((x: number) => x * 2);
const result = mappedInstance.force();
console.log(result); // 84
        </pre>
      </td>
    </tr>
    <tr>
      <td><code>Lazy.fromVal&lt;T&gt;(v: T): Lazy&lt;T&gt;</code></td>
      <td>Creates a lazy instance from an already-evaluated value.</td>
      <td>
        <pre lang="ts">
const eagerInstance = Lazy.fromVal(42);
        </pre>
      </td>
    </tr>
    <tr>
      <td><code>Lazy.from&lt;T&gt;(f: () => T): Lazy&lt;T&gt;</code></td>
      <td>Creates a lazy instance from a function.</td>
      <td>
        <pre lang="ts">
const lazyInstanceFromFunc = Lazy.from(() => {
  // Some expensive computation
  return 42;
});
        </pre>
      </td>
    </tr>
    <tr>
      <td><code>Lazy.prototype.mapVal&lt;U&gt;(f: (x: T) => U): Lazy&lt;U&gt;</code></td>
      <td>Maps a function over a lazy instance if it has been evaluated.</td>
      <td>
        <pre lang="ts">
const mappedInstanceVal = lazyInstance.mapVal((x: number) => x * 2);
const result = mappedInstanceVal.force();
console.log(result); // 84
        </pre>
      </td>
    </tr>
  </tbody>
</table>

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or suggestions, please [open an issue](https://github.com/trvswgnr/lazy/issues).

---

Feel free to explore the source code and improve upon it.