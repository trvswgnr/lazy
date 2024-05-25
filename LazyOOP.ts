const Suspension = Symbol("Suspension");
type Suspension<T> = { [Suspension]: () => T };
const Val = Symbol("Val");
type Val<T> = { [Val]: T };
const Exception = Symbol("Exception");
type Exception = { [Exception]: Error };

class Lazy<T> {
    private [Suspension]?: () => T;
    private [Val]?: T;
    private [Exception]?: Error;

    constructor(sus: () => T) {
        this[Suspension] = sus;
    }

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
            x[Suspension] = undefined;
            if (x.isException()) throw x[Exception];
            return x[Val];
        }
        this[Exception] = new Lazy.Undefined(
            "expected computation, but got a value",
        );
        throw this[Exception];
    }

    public map<B>(f: (x: T) => B): Lazy<B> {
        return new Lazy(() => f(this.force()));
    }

    public isVal<T>(): this is Val<T> {
        return Val in this && this[Val] !== undefined;
    }

    public static fromVal<V>(v: V): Lazy<V> {
        const x = new Lazy<V>(() => void 0 as any) as any;
        x[Val] = v;
        x[Suspension] = undefined;
        x[Exception] = undefined;
        return x;
    }

    public static from<T>(f: () => T): Lazy<T> {
        return new Lazy(f);
    }

    mapVal<U>(f: (x: T) => U): Lazy<U> {
        if (this.isVal<T>()) {
            return Lazy.fromVal(f(this[Val]));
        }
        return new Lazy(() => f(this.force()));
    }

    private isSuspension<T>(): this is Suspension<T> {
        return Suspension in this && this[Suspension] !== undefined;
    }

    private isException(): this is Exception {
        return Exception in this && this[Exception] !== undefined;
    }
}

namespace Lazy {
    export class Undefined extends Error {
        constructor(message: string) {
            super(message);
        }
    }
}

function errorFrom(e: unknown) {
    if (e instanceof Error) return e;
    return new Error(String(e));
}

export default Lazy;
