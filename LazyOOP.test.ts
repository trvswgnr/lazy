import { Lazy } from "./LazyOOP";
import { describe, test, expect } from "bun:test";

const logger = () => {
    const logs: string[] = [];
    return [
        (v: string): void => void logs.push(v),
        <T>(value: T) => [...logs, value] as const,
    ] as const;
};

describe("Lazy OOP", () => {
    test("map lazily evaluates the mapped function", () => {
        const [log, show_log] = logger();
        const x = Lazy.from(() => {
            log("x");
            return 69;
        });
        log("map");
        const y = x.map((n) => {
            log("y");
            return n + 1;
        });
        log("force y");
        const result = show_log(y.force());
        expect(result).toEqual(["map", "force y", "x", "y", 70]);
    });

    test("mapVal does not immediately evaluate the mapped function", () => {
        const [log, show_log] = logger();
        const x = Lazy.from(() => {
            log("x");
            return 69;
        });
        log("mapVal");
        const y = x.mapVal((n) => {
            log("y");
            return n + 1;
        });
        expect(y.isVal()).not.toBe(true);
        log("force y");
        const result = show_log(y.force());
        expect(result).toEqual(["mapVal", "force y", "x", "y", 70]);
    });

    test("mapVal memoizes the result after the first evaluation", () => {
        const [log, show_log] = logger();
        const x = Lazy.from(() => {
            log("x");
            return 69;
        });
        log("force x");
        void x.force();
        log("mapVal");
        const y = x.mapVal((n) => {
            log("y");
            return n + 1;
        });
        expect(y.isVal()).toBe(true);
        log("y is val");
        const result = show_log(y.force());
        expect(result).toEqual(["force x", "x", "mapVal", "y", "y is val", 70]);
    });

    test("force returns the same value for multiple invocations", () => {
        const [log, show_log] = logger();
        const x = Lazy.from(() => {
            log("evaluated");
            return 70;
        });
        expect(x.force()).toBe(70);
        expect(x.force()).toBe(70);
        expect(show_log(x.force())).toEqual(["evaluated", 70]);
    });

    test("force throws the same exception for multiple invocations", () => {
        const x = Lazy.from(() => {
            throw new Error("test");
        });
        expect(() => x.force()).toThrowError("test");
        expect(() => x.force()).toThrowError("test");
    });

    test("isVal returns true for a forced value", () => {
        const x = Lazy.from(() => 70);
        expect(x.isVal()).toBe(false);
        x.force();
        expect(x.isVal()).toBe(true);
    });

    test("fromVal creates an already-forced suspension", () => {
        const x = Lazy.fromVal(70);
        expect(x.isVal()).toBe(true);
        expect(x.force()).toBe(70);
    });

    test("mapVal applies the function immediately for a forced value", () => {
        const x = Lazy.fromVal(69);
        const y = x.mapVal((n) => n + 1);
        expect(y.isVal()).toBe(true);
        expect(y.force()).toBe(70);
    });

    test("mapVal propagates exceptions immediately only for a forced value", () => {
        // forced val should throw
        const x = Lazy.fromVal(70);
        expect(() => {
            return x.mapVal(() => {
                throw new Error("test");
            });
        }).toThrowError("test");

        // lazy val should not throw
        const y = Lazy.from(() => 69);
        expect(() => {
            return y.mapVal(() => {
                throw new Error("test");
            });
        }).not.toThrowError("test");

        // since y has now been forced, it should throw immediately
        const val = y.force();
        expect(val).toBe(69);
        expect(() => {
            return y.mapVal(() => {
                throw new Error("test");
            });
        }).toThrowError("test");
    });

    test("isVal(mapVal(f, x))` is equal to `isVal(x)`", () => {
        const x = Lazy.from(() => 70);
        expect(x.mapVal((n) => n + 1).isVal()).toBe(x.isVal());
    });
});
