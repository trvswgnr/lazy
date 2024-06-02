const Suspension = Symbol("Suspension");
type Suspension<T> = { [Suspension]: () => T };
const Val = Symbol("Val");
type Val<T> = { [Val]: T };
const Exception = Symbol("Exception");
type Exception = { [Exception]: Error };

/**
 * A value of type 'Lazy<T> is a deferred computation, called a suspension, that
 * has a result of type T. Calling `Lazy<Expr>(() => Expr)` makes a suspension
 * of the computation of `Expr`, without computing `Expr` itself yet. "Forcing"
 * the suspension will then compute `Expr` and return its result.
 */
export type Lazy<T> = Suspension<T> | Val<T> | Exception;

/**
 * Creates a new suspension of the computation `f`.
 */
export function Lazy<T>(f: () => T): Lazy<T> {
    return { [Suspension]: f };
}

/**
 * Deferred computations.
 *
 * @note Lazy.force is not concurrency-safe. If you use this module with
 * multiple fibers, systhreads or domains, then you will need to add some locks.
 * The module however ensures memory-safety, and hence, concurrently accessing
 * this module will not lead to a crash but the behaviour is unspecified.
 */
export module Lazy {
    /**
     * Thrown when forcing a suspension concurrently from multiple fibers,
     * systhreads or domains, or when the suspension tries to force itself
     * recursively.
     */
    export class Undefined extends Error {
        constructor(message: string) {
            super(message);
            this.name = "Lazy.Undefined";
        }
    }

    /**
     * Forces the computation and returns its result. If the computation has
     * already been forced, the same value is returned again without recomputing
     * it. If it threw an error, the same error is thrown again.
     */
    export function force<T>(x: Lazy<T>): T {
        if (isVal<T>(x)) return x[Val];
        if (Exception in x) throw x[Exception];
        const a = x as any;
        if (Suspension in a) {
            try {
                a[Val] = a[Suspension]();
            } catch (e) {
                a[Exception] = e;
            }
            delete a[Suspension];
            if (Exception in a) throw a[Exception];
            return a[Val];
        }
        a[Exception] = new Lazy.Undefined(
            "expected computation, but got a value",
        );
        throw a[Exception];
    }

    /**
     * Returns a suspension that, when forced, forces `x` and applies `f` to its
     * value.
     *
     * It is equivalent to `Lazy(() => f(force(x)))`.
     */
    export function map<A, B>(f: (x: A) => B, x: Lazy<A>): Lazy<B> {
        return Lazy(() => f(force(x)));
    }

    /**
     * Returns `true` if the suspension has already been forced and did not
     * throw an error.
     */
    export function isVal<T>(x: Lazy<T>): x is Val<T> {
        return Val in x;
    }

    /**
     * Evaluates `v` first (as any function would) and returns an already-forced
     * suspension of its result. It is the same as `const x = v; Lazy(() => x)`.
     */
    export function fromVal<T>(v: T): Lazy<T> {
        return { [Val]: v };
    }

    /**
     * Applies `f` directly if `x` is already forced, otherwise it behaves as
     * `map(f, x)`.
     *
     * When `x` is already forced, this behavior saves the construction of a
     * suspension, but on the other hand it performs more work eagerly that may
     * not be useful if you never force the function result.
     *
     * If `f` raises an exception, it will be raised immediately when
     * `isVal(x)`, or raised only when forcing the thunk otherwise.
     *
     * If `mapVal(f, x)` does not raise an exception, then `isVal(mapVal(f, x))`
     * is equal to `isVal(x)`.
     */
    export function mapVal<T, U>(f: (x: T) => U, x: Lazy<T>): Lazy<U> {
        if (isVal(x)) {
            return fromVal(f(x[Val]));
        }
        return Lazy(() => f(force(x)));
    }
}
