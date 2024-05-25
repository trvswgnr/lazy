import { describe, test, expect } from "bun:test";
import Lazy from "./Lazy";

const logger = () => {
    const logs: string[] = [];
    return [
        (v: string): void => void logs.push(v),
        <T>(value: T) => [...logs, value] as const,
    ] as const;
};

describe("Lazy", () => {
    test("map lazily evaluates the mapped function", () => {
        const [log, show_log] = logger();
        const x = Lazy(() => {
            log("x");
            return 69;
        });
        log("map");
        const y = Lazy.map((n) => {
            log("y");
            return n + 1;
        }, x);
        log("force y");
        const result = show_log(Lazy.force(y));
        expect(result).toEqual(["map", "force y", "x", "y", 70]);
    });

    test("map_val does not immediately evaluate the mapped function", () => {
        const [log, show_log] = logger();
        const x = Lazy(() => {
            log("x");
            return 69;
        });
        log("map_val");
        const y = Lazy.map_val((n) => {
            log("y");
            return n + 1;
        }, x);
        expect(Lazy.is_val(y)).not.toBe(true);
        log("force y");
        const result = show_log(Lazy.force(y));
        expect(result).toEqual(["map_val", "force y", "x", "y", 70]);
    });

    test("map_val memoizes the result after the first evaluation", () => {
        const [log, show_log] = logger();
        const x = Lazy(() => {
            log("x");
            return 69;
        });
        log("force x");
        void Lazy.force(x);
        log("map_val");
        const y = Lazy.map_val((n) => {
            log("y");
            return n + 1;
        }, x);
        expect(Lazy.is_val(y)).toBe(true);
        log("y is val");
        const result = show_log(Lazy.force(y));
        expect(result).toEqual([
            "force x",
            "x",
            "map_val",
            "y",
            "y is val",
            70,
        ]);
    });

    test("force returns the same value for multiple invocations", () => {
        const [log, show_log] = logger();
        const x = Lazy(() => {
            log("evaluated");
            return 70;
        });
        expect(Lazy.force(x)).toBe(70);
        expect(Lazy.force(x)).toBe(70);
        expect(show_log(Lazy.force(x))).toEqual(["evaluated", 70]);
    });

    test("force throws the same exception for multiple invocations", () => {
        const x = Lazy(() => {
            throw new Error("test");
        });
        expect(() => Lazy.force(x)).toThrowError("test");
        expect(() => Lazy.force(x)).toThrowError("test");
    });

    test("is_val returns true for a forced value", () => {
        const x = Lazy(() => 70);
        expect(Lazy.is_val(x)).toBe(false);
        Lazy.force(x);
        expect(Lazy.is_val(x)).toBe(true);
    });

    test("from_val creates an already-forced suspension", () => {
        const x = Lazy.from_val(70);
        expect(Lazy.is_val(x)).toBe(true);
        expect(Lazy.force(x)).toBe(70);
    });

    test("map_val applies the function immediately for a forced value", () => {
        const x = Lazy.from_val(69);
        const y = Lazy.map_val((n) => n + 1, x);
        expect(Lazy.is_val(y)).toBe(true);
        expect(Lazy.force(y)).toBe(70);
    });

    test("map_val propagates exceptions immediately only for a forced value", () => {
        // forced val should throw
        const x = Lazy.from_val(70);
        expect(() => {
            return Lazy.map_val(() => {
                throw new Error("test");
            }, x);
        }).toThrowError("test");

        // lazy val should not throw
        const y = Lazy(() => 69);
        expect(() => {
            return Lazy.map_val(() => {
                throw new Error("test");
            }, y);
        }).not.toThrowError("test");

        // since y has now been forced, it should throw immediately
        const val = Lazy.force(y);
        expect(val).toBe(69);
        expect(() => {
            return Lazy.map_val(() => {
                throw new Error("test");
            }, y);
        }).toThrowError("test");
    });

    test("is_val(map_val(f, x))` is equal to `is_val(x)`", () => {
        const x = Lazy(() => 70);
        expect(Lazy.is_val(Lazy.map_val((n) => n + 1, x))).toBe(Lazy.is_val(x));
    });
});
