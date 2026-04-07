import { afterEach, describe, expect, it, vi } from "vitest";
import { consumeGen, consumeStringGen, getCallStack, createRecurringTask, fetchAdvanced, getListLength, pauseFor, pureObj, scheduleExit, setImmediateInterval, setImmediateTimeoutLoop, getterifyObj } from "../misc.ts";
import { softExpect } from "./softExpect.ts";

//#region pauseFor
describe("misc/pauseFor", () => {
  it("Pauses for the correct time and can be aborted", async () => {
    const startTs = Date.now();
    await pauseFor(100);

    expect(Date.now() - startTs).toBeGreaterThanOrEqual(80);

    const ac = new AbortController();
    const startTs2 = Date.now();

    setTimeout(() => ac.abort(), 20);
    await pauseFor(100, ac.signal);

    expect(Date.now() - startTs2).toBeLessThan(100);
  });
});

//#region fetchAdvanced
describe("misc/fetchAdvanced", () => {
  it("Fetches a resource correctly", async () => {
    try {
      const res = await fetchAdvanced("https://jsonplaceholder.typicode.com/todos/1");
      const json = await res.json();

      expect(json?.id).toBe(1);
    }
    catch(e) {
      expect(e).toBeUndefined();
    }
  });

  it("Throws error on invalid resource", async () => {
    try {
      const res = await fetchAdvanced("invalid-url");
    }
    catch(e) {
      expect(e).toBeInstanceOf(Error);
    }
  });
});

//#region consumeGen
describe("misc/consumeGen", () => {
  it("Consumes a ValueGen properly", async () => {
    expect(await consumeGen(() => 1)).toBe(1);
    expect(await consumeGen(() => Promise.resolve(1))).toBe(1);
    expect(await consumeGen(1)).toBe(1);

    expect(await consumeGen(() => true)).toBe(true);
    expect(await consumeGen(async () => false)).toBe(false);

    // @ts-expect-error
    expect(await consumeGen()).toThrow(TypeError);
  });

  it("Passes args to a parametrized ValueGen function", async () => {
    expect(await consumeGen((n: number) => n * 2, 21)).toBe(42);
    expect(await consumeGen(async (a: number, b: number) => a + b, 20, 22)).toBe(42);
    expect(await consumeGen((s: string) => s.toUpperCase(), "hello")).toBe("HELLO");
  });
});

//#region consumeStringGen
describe("misc/consumeStringGen", () => {
  it("Consumes a StringGen properly", async () => {
    expect(await consumeStringGen("a")).toBe("a");
    expect(await consumeStringGen(() => "b")).toBe("b");
    expect(await consumeStringGen(() => Promise.resolve("c"))).toBe("c");
    expect(await consumeStringGen({ toString: () => "d" })).toBe("d");
  });

  it("Passes args to a parametrized StringGen function", async () => {
    expect(await consumeStringGen((n: number) => String(n * 2), 21)).toBe("42");
    expect(await consumeStringGen(async (s: string) => s.toUpperCase(), "hello")).toBe("HELLO");
    expect(await consumeStringGen((a: string, b: string) => `${a}-${b}`, "foo", "bar")).toBe("foo-bar");
  });
});

//#region getListLength
describe("misc/getListLength", () => {
  it("Resolves all types of ListLike", () => {
    const cont = document.createElement("div");
    for(let i = 0; i < 3; i++) {
      const span = document.createElement("span");
      cont.append(span);
    }
    expect(getListLength(cont.querySelectorAll("span"))).toBe(3);
    expect(getListLength([1, 2, 3])).toBe(3);
    expect(getListLength({ length: 3 })).toBe(3);
    expect(getListLength({ size: 3 })).toBe(3);
    expect(getListLength({ count: 3 })).toBe(3);

    // @ts-expect-error
    expect(getListLength({}, true)).toBe(0);
    // @ts-expect-error
    expect(getListLength({}, false)).toBe(NaN);
  });
});

//#region pureObj
describe("misc/pureObj", () => {
  it("Removes the prototype chain of a passed object", () => {
    const obj = { a: 1, b: 2 };
    const pure = pureObj(obj);

    // @ts-expect-error sanity check
    expect(obj.__proto__).toBeDefined();
    // @ts-expect-error the pure object should have no prototype
    expect(pure.__proto__).toBeUndefined();

    expect(pure.a).toBe(1);
    expect(pure.b).toBe(2);
  });

  it("Prevents prototype pollution", () => {
    const obj = {
      __proto__: { isPolluted: true },
    };

    // @ts-expect-error ensure there's no side effects
    expect({}.isPolluted).toBeUndefined();

    const impure = Object.create(obj);
    expect(impure.isPolluted).toBe(true);

    const pure = pureObj(obj);
    // @ts-expect-error ensure the prototype chain is removed
    expect(pure.isPolluted).toBeUndefined();
  });
});

//#region getterifyObj
describe("misc/getterifyObj", () => {
  it("Transforms properties into getters", () => {
    const obj = { a: 1, b: 2 };
    const getterified = getterifyObj(obj);

    expect(getterified.a).toBe(1);
    expect(getterified.b).toBe(2);

    // when reassigned, getters should reflect the new value
    obj.a = 42;
    expect(getterified.a).toBe(42);
  });

  it("Returns a copy when asCopy is true", () => {
    const obj = { x: 10 };
    const getterifiedCopy = getterifyObj(obj, true);

    expect(getterifiedCopy.x).toBe(10);

    // when reassigned, the copy should not reflect the new value
    obj.x = 20;
    expect(getterifiedCopy.x).toBe(10);
  });
});

//#region setImmediateInterval
describe("misc/setImmediateInterval", () => {
  it("Calls the callback immediately and then at the specified interval", async () => {
    const controller = new AbortController();

    let startTs = Date.now();
    const times: number[] = [];

    setImmediateInterval(() => {
      times.push(Date.now() - startTs);
    }, 30, controller.signal);

    await new Promise(resolve => setTimeout(resolve, 200)); // wait for 200 ms
    controller.abort();

    const len = times.length;
    expect(len).toBeLessThanOrEqual(7);
    expect(len).toBeGreaterThanOrEqual(6);

    softExpect(times.every(t => t <= 202 && t >= 0), (e) => e.toBe(true), "All times should be within expected range");

    await new Promise(resolve => setTimeout(resolve, 100)); // wait for another 100 ms to ensure no more calls
    expect(times.length).toEqual(len);
  });
});

//#region setImmediateTimeoutLoop
describe("misc/setImmediateTimeoutLoop", () => {
  it("Calls the callback immediately and then with the specified timeout", async () => {
    const controller = new AbortController();

    let startTs = Date.now();
    const times: number[] = [];

    setImmediateTimeoutLoop(async () => {
      await pauseFor(80, controller.signal);
      times.push(Date.now() - startTs);
    }, 30, controller.signal);

    await new Promise(resolve => setTimeout(resolve, 200));
    controller.abort();

    expect(times.length).toBeLessThanOrEqual(3);
    expect(times.length).toBeGreaterThanOrEqual(1);

    softExpect(times.every(t => t <= 200 && t >= 0), (e) => e.toBe(true), "All times should be within expected range");
  });
});

//#region scheduleExit
describe("misc/scheduleExit", () => {
  it("Schedules an exit (Node.js)", async () => {
    const exitSpy = vi.spyOn(process, "exit").mockImplementation((code?: string | number | null) => void code as never);

    scheduleExit(0);
    await pauseFor(1);
    expect(exitSpy).toHaveBeenCalledWith(0);

    scheduleExit(1);
    await pauseFor(1);
    expect(exitSpy).toHaveBeenCalledWith(1);

    exitSpy.mockRestore();
  });

  it("Schedules an exit (Deno mock)", async () => {
    const originalExit = globalThis.process.exit;
    // @ts-ignore
    delete globalThis.process.exit;

    // @ts-ignore Deno can't be loaded due to namespace conflicts
    const originalDeno = globalThis.Deno; // @ts-ignore see above
    globalThis.Deno = {
      exit: (code: number) => void code,
    };

    // @ts-expect-error
    const denoExitSpy = vi.spyOn(globalThis.Deno, "exit").mockImplementation((code: number) => void code as never);

    scheduleExit(0);
    await pauseFor(1);
    expect(denoExitSpy).toHaveBeenCalledWith(0);

    scheduleExit(1);
    await pauseFor(1);
    expect(denoExitSpy).toHaveBeenCalledWith(1);

    denoExitSpy.mockRestore();
    // @ts-ignore
    globalThis.Deno = originalDeno;
    // @ts-ignore
    globalThis.process.exit = originalExit;
  });

  it("Throws ScriptContextError if no exit method is available", () => {
    const originalProcess = globalThis.process;
    // @ts-ignore
    delete globalThis.process;

    expect(() => scheduleExit(0)).toThrowError("Cannot exit the process, no exit method available");

    // @ts-ignore
    globalThis.process = originalProcess;
  });
});

//#region getCallStack
describe("misc/getCallStack", () => {
  it("Returns the current call stack as an array", () => {
    function level1() {
      return level2();
    }
    function level2() {
      return level3();
    }
    function level3() {
      return getCallStack();
    }

    const stack = level1();
    expect(Array.isArray(stack)).toBe(true);
    expect(stack.length).toBeGreaterThanOrEqual(3);
    expect(stack[0]).toMatch(/at level3/);
    expect(stack[1]).toMatch(/at level2/);
    expect(stack[2]).toMatch(/at level1/);
  });

  it("Returns the current call stack as a string", () => {
    function levelA() {
      return levelB();
    }
    function levelB() {
      return levelC();
    }
    function levelC() {
      return getCallStack(false);
    }

    const stackStr = levelA();
    expect(typeof stackStr).toBe("string");
    const stackLines = stackStr.split("\n");
    expect(stackLines.length).toBeGreaterThanOrEqual(3);
    expect(stackLines[0]).toMatch(/at levelC/);
    expect(stackLines[1]).toMatch(/at levelB/);
    expect(stackLines[2]).toMatch(/at levelA/);
  });

  it("Limits the number of lines returned", () => {
    function first() {
      return second();
    }
    function second() {
      return third();
    }
    function third() {
      return getCallStack(true, 2);
    }

    const limitedStack = first();
    expect(limitedStack.length).toBe(2);
    expect(limitedStack[0]).toMatch(/at third/);
    expect(limitedStack[1]).toMatch(/at second/);
  });
});

//#region createRecurringTask
describe("misc/createRecurringTask", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("Runs task immediately and calls onSuccess with return val", async () => {
    vi.useFakeTimers();
    const taskFn = vi.fn(() => 42);
    const onSuccess = vi.fn();

    createRecurringTask({
      timeout: 100,
      task: taskFn,
      onSuccess,
      maxIterations: 1,
    });

    await vi.advanceTimersByTimeAsync(0);
    expect(taskFn).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith(42, 0);
  });

  it("Skips first execution when immediate is false", async () => {
    vi.useFakeTimers();
    const taskFn = vi.fn(() => 42);

    createRecurringTask({
      timeout: 100,
      task: taskFn,
      immediate: false,
      maxIterations: 1,
    });

    await vi.advanceTimersByTimeAsync(0);
    expect(taskFn).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(100);
    expect(taskFn).toHaveBeenCalledTimes(1);
  });

  it("Runs task until maxIterations reached", async () => {
    vi.useFakeTimers();
    const taskFn = vi.fn(() => 42);

    createRecurringTask({
      timeout: 50,
      task: taskFn,
      maxIterations: 3,
    });

    await vi.advanceTimersByTimeAsync(0);
    expect(taskFn).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(50);
    expect(taskFn).toHaveBeenCalledTimes(2);

    await vi.advanceTimersByTimeAsync(50);
    expect(taskFn).toHaveBeenCalledTimes(3);

    // should stop after maxIterations
    await vi.advanceTimersByTimeAsync(50);
    expect(taskFn).toHaveBeenCalledTimes(3);
  });

  it("Calls async onSuccess callback", async () => {
    vi.useFakeTimers();
    let received: unknown;

    createRecurringTask({
      timeout: 50,
      task: () => 123,
      onSuccess: async (val) => { received = val; },
      maxIterations: 1,
    });

    await vi.advanceTimersByTimeAsync(0);
    expect(received).toBe(123);
  });

  it("Respects the condition function", async () => {
    vi.useFakeTimers();
    let condVal = true;
    const taskFn = vi.fn();

    createRecurringTask({
      timeout: 50,
      task: taskFn,
      condition: () => condVal,
      maxIterations: 3,
    });

    await vi.advanceTimersByTimeAsync(0);
    expect(taskFn).toHaveBeenCalledTimes(1);

    condVal = false;
    await vi.advanceTimersByTimeAsync(50);
    expect(taskFn).toHaveBeenCalledTimes(1); // skipped

    condVal = true;
    await vi.advanceTimersByTimeAsync(50);
    expect(taskFn).toHaveBeenCalledTimes(2);
  });

  it("Condition returning false counts toward maxIterations", async () => {
    vi.useFakeTimers();
    const taskFn = vi.fn();

    createRecurringTask({
      timeout: 50,
      task: taskFn,
      condition: () => false,
      maxIterations: 2,
    });

    // iteration 1: condition false, task skipped, but iteration counted
    await vi.advanceTimersByTimeAsync(0);
    expect(taskFn).not.toHaveBeenCalled();

    // iteration 2: condition still false, maxIterations reached
    await vi.advanceTimersByTimeAsync(50);
    expect(taskFn).not.toHaveBeenCalled();

    // should not schedule any further runs
    await vi.advanceTimersByTimeAsync(50);
    expect(taskFn).not.toHaveBeenCalled();
  });

  it("Supports async conditions", async () => {
    vi.useFakeTimers();
    const taskFn = vi.fn();

    createRecurringTask({
      timeout: 50,
      task: taskFn,
      condition: () => new Promise((r) => setTimeout(() => r(true), 2)),
      maxIterations: 1,
    });

    await vi.advanceTimersByTimeAsync(5);
    expect(taskFn).toHaveBeenCalledTimes(1);
  });

  it("Calls onError when task throws and continues by default", async () => {
    vi.useFakeTimers();
    const onError = vi.fn();
    const err = new Error("task error");
    let shouldThrow = true;

    createRecurringTask({
      timeout: 50,
      task: () => { if(shouldThrow) throw err; },
      onError,
      maxIterations: 2,
    });

    await vi.advanceTimersByTimeAsync(0);
    expect(onError).toHaveBeenCalledWith(err, 0);

    shouldThrow = false;
    await vi.advanceTimersByTimeAsync(50);
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it("Calls onError when condition throws", async () => {
    vi.useFakeTimers();
    const onError = vi.fn();
    const err = new Error("condition error");

    createRecurringTask({
      timeout: 50,
      task: () => {},
      condition: () => { throw err; },
      onError,
      abortOnError: true,
    });

    await vi.advanceTimersByTimeAsync(0);
    expect(onError).toHaveBeenCalledWith(err, 0);
  });

  it("Calls async onError callback", async () => {
    vi.useFakeTimers();
    let receivedErr: unknown;
    const err = new Error("async error");

    createRecurringTask({
      timeout: 50,
      task: () => { throw err; },
      onError: async (e) => { receivedErr = e; },
      abortOnError: true,
    });

    await vi.advanceTimersByTimeAsync(0);
    expect(receivedErr).toBe(err);
  });

  it("Re-throws errors when no onError or abortOnError is provided", async () => {
    vi.useFakeTimers();

    const promise = createRecurringTask({
      timeout: 50,
      task: () => { throw new Error("unhandled"); },
      maxIterations: 1,
    });

    await expect(promise).rejects.toThrow("unhandled");
  });

  it("Stops when abortOnError is true", async () => {
    vi.useFakeTimers();
    const taskFn = vi.fn(() => { throw new Error("fail"); });

    createRecurringTask({
      timeout: 50,
      task: taskFn,
      onError: () => {},
      abortOnError: true,
    });

    await vi.advanceTimersByTimeAsync(0);
    expect(taskFn).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(50);
    expect(taskFn).toHaveBeenCalledTimes(1); // stopped
  });

  it("Stops when signal is aborted", async () => {
    vi.useFakeTimers();
    const ac = new AbortController();
    const taskFn = vi.fn();

    createRecurringTask({
      timeout: 50,
      task: taskFn,
      signal: ac.signal,
    });

    await vi.advanceTimersByTimeAsync(0);
    expect(taskFn).toHaveBeenCalledTimes(1);

    ac.abort();

    await vi.advanceTimersByTimeAsync(50);
    expect(taskFn).toHaveBeenCalledTimes(1); // stopped
  });

  it("Handles async tasks", async () => {
    vi.useFakeTimers();
    const onSuccess = vi.fn();

    createRecurringTask({
      timeout: 50,
      task: async () => {
        await Promise.resolve();
        return "async-result";
      },
      onSuccess,
      maxIterations: 1,
    });

    await vi.advanceTimersByTimeAsync(0);
    expect(onSuccess).toHaveBeenCalledWith("async-result", 0);
  });

  it("Runs indefinitely without maxIterations until aborted", async () => {
    vi.useFakeTimers();
    const ac = new AbortController();
    const taskFn = vi.fn();

    createRecurringTask({
      timeout: 50,
      task: taskFn,
      signal: ac.signal,
    });

    await vi.advanceTimersByTimeAsync(0);
    for(let i = 0; i < 9; i++)
      await vi.advanceTimersByTimeAsync(50);

    expect(taskFn).toHaveBeenCalledTimes(10);

    ac.abort();
    await vi.advanceTimersByTimeAsync(50);
    expect(taskFn).toHaveBeenCalledTimes(10);
  });

  it("Handles async task rejection in onError", async () => {
    vi.useFakeTimers();
    const onError = vi.fn();

    createRecurringTask({
      timeout: 50,
      task: async () => { throw new Error("async fail"); },
      onError,
      maxIterations: 1,
    });

    await vi.advanceTimersByTimeAsync(0);
    expect(onError).toHaveBeenCalledTimes(1);
    expect((onError.mock.calls[0][0] as Error).message).toBe("async fail");
  });
});
