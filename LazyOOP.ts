/**
 * Deferred computations.
 *
 * Heavily inspired by OCaml's Lazy module, this module provides a way to defer
 * computations until their result is needed, and then compute and return their
 * result. This is useful when you want to avoid computing a computation unless
 * its result is actually needed, or when you want to compute a computation in a
 * different context.
 *
 * This is the OOP version of the module, for the FP version see `LazyFP.ts`.
 *
 * @note `Lazy.prototype.force` is not concurrency-safe. If you use this module
 * with multiple fibers, systhreads or domains, then you will need to add some
 * locks. The module however ensures memory-safety, and hence, concurrently
 * accessing this module will not lead to a crash but the behaviour is
 * unspecified.
 * @module
 */

const Suspension = Symbol("Suspension");
type Suspension<T> = { [Suspension]: () => T };
const Val = Symbol("Val");
type Val<T> = { [Val]: T };
const Exception = Symbol("Exception");
type Exception = { [Exception]: Error };
const None = Symbol("None");
type None = typeof None;

class Undefined extends Error {
    constructor(message: string) {
        super(message);
    }
}

class _Lazy<T> implements Lazy<T> {
    private [Suspension]: (() => T) | None = None;
    private [Val]: T | None = None;
    private [Exception]: Error | None = None;

    constructor(f: () => T) {
        this[Suspension] = f;
    }

    public static Undefined = Undefined;

    public force(): T {
        if (this.isVal<T>()) return this[Val];
        if (this.isException()) throw this[Exception];
        if (this.isSuspension<T>()) {
            const x = this as any;
            try {
                x[Val] = x[Suspension]();
            } catch (e) {
                x[Exception] = errorFrom(e);
            }
            x[Suspension] = None;
            if (x.isException()) throw x[Exception];
            return x[Val];
        }
        this[Exception] = new _Lazy.Undefined(
            "expected computation, but got a value",
        );
        throw this[Exception];
    }

    public map<B>(f: (x: T) => B): Lazy<B> {
        return new _Lazy(() => f(this.force()));
    }

    public isVal<T>(): this is Val<T> {
        return this[Val] !== None;
    }

    private isSuspension<T>(): this is Suspension<T> {
        return this[Suspension] !== None;
    }

    private isException(): this is Exception {
        return this[Exception] !== None;
    }

    public static fromVal<V>(v: V): Lazy<V> {
        const x = new _Lazy<V>(() => void 0 as any) as any;
        x[Val] = v;
        x[Suspension] = None;
        x[Exception] = None;
        return x;
    }

    public static from<T>(f: () => T): Lazy<T> {
        return new _Lazy(f);
    }

    mapVal<U>(f: (x: T) => U): Lazy<U> {
        if (this.isVal<T>()) {
            return _Lazy.fromVal(f(this[Val]));
        }
        return new _Lazy(() => f(this.force()));
    }
}

/**
 * A value of type 'Lazy<T> is a deferred computation, called a suspension, that
 * has a result of type T. Calling `new Lazy<Expr>(() => Expr)` makes a suspension
 * of the computation of `Expr`, without computing `Expr` itself yet. "Forcing"
 * the suspension will then compute `Expr` and return its result.
 */
export interface Lazy<T> {
    /**
     * Forces the computation and returns its result. If the computation has
     * already been forced, the same value is returned again without recomputing
     * it. If it threw an error, the same error is thrown again.
     */
    force(): T;
    /**
     * Returns a suspension that, when forced, forces this suspension and
     * applies `f` to its value.
     *
     * It is equivalent to `Lazy.from(() => f(this.force()))`.
     */
    map<B>(f: (x: T) => B): Lazy<B>;
    /**
     * Returns `true` if the suspension has already been forced and did not
     * throw an error.
     */
    isVal<T>(): this is Val<T>;
    /**
     * Applies `f` directly if this suspension is already forced, otherwise it
     * behaves as `this.map(f)`.
     *
     * When this suspension is already forced, this behavior saves the
     * construction of a suspension, but on the other hand it performs more work
     * eagerly that may not be useful if you never force the function result.
     *
     * If `f` raises an exception, it will be raised immediately when
     * `this.isVal()`, or raised only when forcing the thunk otherwise.
     *
     * If `this.mapVal(f)` does not raise an exception, then
     * `this.isVal(this.mapVal(f))` is equal to `this.isVal()`.
     */
    mapVal<U>(f: (x: T) => U): Lazy<U>;
}

export interface LazyConstructor {
    /**
     * Constructs a new suspension of the computation `f`.
     * @constructor
     */
    new <T>(f: () => T): Lazy<T>;
    /**
     * Evaluates `v` first (as any function would) and returns an already-forced
     * suspension of its result. It is the same as `const x = v; Lazy.from(() =>
     * x)`.
     */
    fromVal<V>(v: V): Lazy<V>;
    /**
     * Constructs a new suspension of the computation `f`.
     */
    from<T>(f: () => T): Lazy<T>;
    /**
     * Thrown when forcing a suspension concurrently from multiple fibers,
     * systhreads or domains, or when the suspension tries to force itself
     * recursively.
     */
    Undefined: typeof Undefined;
}

export const Lazy: LazyConstructor = _Lazy;

function errorFrom(e: unknown) {
    if (e instanceof Error) return e;
    return new Error(String(e));
}
