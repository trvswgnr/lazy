<h1 aria-label="Lazy TypeScript Library"><img src="https://github.com/trvswgnr/lazy/assets/8974888/d193debb-4fc8-4af3-924d-cbfc41727190" alt="Lazy TypeScript Library Banner - Illustration of a sloth lounging in an ornate wooden chair, wearing an oversized orange hoodie and matching pants. The background is blurred with cool blue and green tones, suggesting an overgrown indoor setting with columns or tall structures. Large, white, block letters at the bottom spell 'LAZY.' The sloth has a relaxed, almost regal posture, with its legs spread out and arms resting on the chair's armrests. Its expression appears content and unbothered."></h1>


[![JSR](https://jsr.io/badges/@trav/lazy)](https://jsr.io/@trav/lazy) [![JSR
Score](https://jsr.io/badges/@trav/lazy/score)](https://jsr.io/@trav/lazy)

Lazy is a TypeScript/JavaScript library that makes it easy to work with lazy
values. This is particularly useful for optimizing performance by deferring
expensive computations until their results are needed, and only computing them
once. Lazy provides both functional and object-oriented APIs—both of which have
been tested extensively—so that you can integrate it into your project easily.

## Features

-   **Deferred Computations**: Create and manage deferred computations.
-   **Value Caching**: Cache the results of computations to avoid redundant
    executions.
-   **Flexible Mapping**: Map functions over lazy values to transform their
    results.
-   **Functional and Object-Oriented APIs**: Use your preference between the
    functional API or the object-oriented API to work with lazy values.

## Installation

Install the library using your preferred package manager:

```bash
# bun
bunx jsr add @trav/lazy

# npm
npx jsr add @trav/lazy

# deno
deno add @trav/lazy

# pnpm
pnpm dlx jsr add @trav/lazy

#yarn
yarn dlx jsr add @trav/lazy
```

## Usage

### Functional API (default)

#### Creating a Lazy Value

```ts
import { Lazy } from "@trav/lazy";

const x = Lazy(() => {
    // some expensive computation
    // this will only execute once
    return 69;
});
```

#### Forcing a Lazy Value

```ts
const result = Lazy.force(x);
console.log(result); // 69
```

#### Mapping a Function Over a Lazy Value

```ts
const mappedValue = Lazy.map((v) => v * 2, x);
const result = Lazy.force(mappedValue);
console.log(result); // 138
```

You can also use `Lazy.mapVal` to map a function over a lazy value, which can be
more efficient if `x` is already forced.

```ts
const mappedValue = Lazy.mapVal((v) => v * 2, x);
const result = Lazy.force(mappedValue);
console.log(result); // 138
```

#### Check if a Lazy value has already been forced

```ts
const hasBeenForced = Lazy.isValue(x);
console.log(hasBeenForced); // true
```

#### Create a Lazy value from a regular value

```ts
const lazyFromValue = Lazy.fromValue(69);
const hasBeenForced = Lazy.isValue(lazyFromValue);
console.log(hasBeenForced); // true
```

### Object-Oriented API

#### Creating a Lazy Instance

```ts
import { Lazy } from "@trav/lazy/oop";

const x = new Lazy(() => {
    // some expensive computation
    return 69;
});
```

#### Forcing a Lazy Instance

```ts
const result = x.force();
console.log(result); // 69
```

#### Mapping a Function Over a Lazy Instance

```ts
const mappedInstance = x.map((x: number) => x * 2);
const result = mappedInstance.force();
console.log(result); // 138
```

You can also use `Lazy.prototype.mapVal` to map a function over a lazy value,
which can be more efficient if the current instance is already forced.

```ts
const mappedInstance = x.mapVal((v) => v * 2);
const result = mappedInstance.force();
console.log(result); // 138
```

#### Create a Lazy Instance from a regular value

```ts
const lazyFromValue = Lazy.fromVal(69);
const hasBeenForced = Lazy.isValue(lazyFromValue);
console.log(hasBeenForced); // true
```

### Handling Exceptions

If a function throws an error, the same error is thrown when forcing the lazy
value. This is the same in both the functional and object-oriented APIs.

```ts
const faulty = Lazy(() => {
    throw new Error("Something went wrong");
});

try {
    Lazy.force(faulty);
} catch (e) {
    console.error(e); // Error: Something went wrong
}
```

## Contributing

Contributions are welcome! Please [open an
issue](https://github.com/trvswgnr/lazy/issues) or [submit a pull
request](https://github.com/trvswgnr/lazy/pulls).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file
for details.

## Contact

For any questions or suggestions, please [open an
issue](https://github.com/trvswgnr/lazy/issues), or [reach out to me on
Twitter](https://twitter.com/techsavvytravvy).

---

Feel free to explore the source code and improve upon it.
