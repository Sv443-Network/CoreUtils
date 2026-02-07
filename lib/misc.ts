/**
 * @module misc
 * This module contains miscellaneous functions that don't fit in another category - [see the documentation for more info](https://github.com/Sv443-Network/UserUtils/blob/main/docs.md#misc)
 */

import { CustomError, NetworkError, ScriptContextError } from "./Errors.ts";
import type { ListLike, Prettify, Stringifiable } from "./types.ts";

/**
 * A ValueGen value is either its type, a promise that resolves to its type, or a function that returns its type, either synchronous or asynchronous.  
 * ValueGen allows for the utmost flexibility when applied to any type, as long as {@linkcode consumeGen()} is used to get the final value.
 * @template TValueType The type of the value that the ValueGen should yield
 */
export type ValueGen<TValueType> = TValueType | Promise<TValueType> | (() => TValueType | Promise<TValueType>);

/**
 * Turns a {@linkcode ValueGen} into its final value.  
 * @template TValueType The type of the value that the ValueGen should yield
 */
export async function consumeGen<TValueType>(valGen: ValueGen<TValueType>): Promise<TValueType> {
  return await (typeof valGen === "function"
    ? (valGen as (() => Promise<TValueType> | TValueType))()
    : valGen
  ) as TValueType;
}

/**
 * A StringGen value is either a string, anything that can be converted to a string, or a function that returns one of the previous two, either synchronous or asynchronous, or a promise that returns a string.  
 * StringGen allows for the utmost flexibility when dealing with strings, as long as {@linkcode consumeStringGen()} is used to get the final string.
 */
export type StringGen = ValueGen<Stringifiable>;

/**
 * Turns a {@linkcode StringGen} into its final string value.  
 * @template TStrUnion The union of strings that the StringGen should yield - this allows for finer type control compared to {@linkcode consumeGen()}
 */
export async function consumeStringGen<TStrUnion extends string>(strGen: StringGen): Promise<TStrUnion> {
  return (
    typeof strGen === "string"
      ? strGen
      : String(
        typeof strGen === "function"
          ? await strGen()
          : strGen
      )
  ) as TStrUnion;
}

/** Options for the `fetchAdvanced()` function */
export type FetchAdvancedOpts = Prettify<
  Partial<{
    /** Timeout in milliseconds after which the fetch call will be canceled with an AbortController signal */
    timeout: number;
  }> & RequestInit
>;

/** Calls the fetch API with special options like a timeout */
export async function fetchAdvanced(input: string | RequestInfo | URL, options: FetchAdvancedOpts = {}): Promise<Response> {
  const { timeout = 10000 } = options;
  const ctl = new AbortController();

  const { signal, ...restOpts } = options;

  signal?.addEventListener("abort", () => ctl.abort());

  let sigOpts: Partial<RequestInit> = {},
    id: ReturnType<typeof setTimeout> | undefined = undefined;

  if(timeout >= 0) {
    id = setTimeout(() => ctl.abort(), timeout);
    sigOpts = { signal: ctl.signal };
  }

  try {
    const res = await fetch(input, {
      ...restOpts,
      ...sigOpts,
    });
    typeof id !== "undefined" && clearTimeout(id);
    return res;
  }
  catch(err) {
    typeof id !== "undefined" && clearTimeout(id);
    throw new NetworkError("Error while calling fetch", { cause: err });
  }
}

/**
 * Returns the length of the given list-like object (anything with a numeric `length`, `size` or `count` property, like an array, Map or NodeList).  
 * If the object doesn't have any of these properties, it will return 0 by default.  
 * Set {@linkcode zeroOnInvalid} to false to return NaN instead of 0 if the object doesn't have any of the properties.
 */
export function getListLength(listLike: ListLike, zeroOnInvalid = true): number {
  // will I go to ternary hell for this?
  return "length" in listLike
    ? listLike.length
    : "size" in listLike
      ? listLike.size
      : "count" in listLike
        ? listLike.count
        : zeroOnInvalid
          ? 0
          : NaN;
}

/**
 * Pauses async execution for the specified time in ms.  
 * If an `AbortSignal` is passed, the pause will be aborted when the signal is triggered.  
 * By default, this will resolve the promise, but you can set {@linkcode rejectOnAbort} to true to reject it instead.
 */
export function pauseFor(time: number, signal?: AbortSignal, rejectOnAbort = false): Promise<void> {
  return new Promise<void>((res, rej) => {
    const timeout = setTimeout(() => res(), time);
    signal?.addEventListener("abort", () => {
      clearTimeout(timeout);
      rejectOnAbort ? rej(new CustomError("AbortError", "The pause was aborted")) : res();
    });
  });
}

/**
 * Turns the passed object into a "pure" object without a prototype chain, meaning it won't have any default properties like `toString`, `__proto__`, `__defineGetter__`, etc.  
 * This makes the object immune to prototype pollution attacks and allows for cleaner object literals, at the cost of being harder to work with in some cases.  
 * It also effectively transforms a `Stringifiable` value into one that will throw a TypeError when stringified instead of defaulting to `[object Object]`  
 * If no object is passed, it will return an empty object without prototype chain.
 */
export function pureObj<TObj extends object>(obj?: TObj): TObj {
  return Object.assign(Object.create(null), obj ?? {}) as TObj;
}

/**
 * Works similarly to `setInterval()`, but the callback is also called immediately and can be aborted with an `AbortSignal`.  
 * Uses `setInterval()` internally, which might cause overlapping calls if the callback's synchronous execution takes longer than the given interval time.  
 * This function will prevent skewing the interval time, contrary to {@linkcode setImmediateTimeoutLoop()}.  
 * Returns a cleanup function that will stop the interval if called.
 */
export function setImmediateInterval(
  callback: () => void | unknown,
  interval: number,
  signal?: AbortSignal,
): void {
  // eslint-disable-next-line prefer-const
  let intervalId: ReturnType<typeof setInterval> | undefined;

  const cleanup = (): void => clearInterval(intervalId);

  const loop = (): void => {
    if(signal?.aborted)
      return cleanup();
    callback();
  };

  signal?.addEventListener("abort", cleanup);
  loop();
  intervalId = setInterval(loop, interval);
}

/**
 * Works similarly to `setInterval()`, but the callback is also called immediately and can be aborted with an `AbortSignal`.  
 * Uses `setTimeout()` internally to avoid overlapping calls, though this will skew the given interval time by however long the callback takes to execute synchronously.  
 * Returns a cleanup function that will stop the interval if called.
 */
export function setImmediateTimeoutLoop(
  callback: () => void | unknown | Promise<void | unknown>,
  interval: number,
  signal?: AbortSignal,
): void {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  const cleanup = (): void => clearTimeout(timeout);

  const loop = async (): Promise<void> => {
    if(signal?.aborted)
      return cleanup();
    await callback();
    timeout = setTimeout(loop, interval);
  };

  signal?.addEventListener("abort", cleanup);
  loop();
}

/**
 * Schedules an exit of the current process after the next event loop tick, in order to allow any pending operations like IO writes to complete.  
 * Works on both Node.js and Deno, but will not work in browser environments.
 * @param code The exit code to use, defaults to 0 (success)
 * @param timeout The time in milliseconds to wait before exiting, defaults to 0 (exit on the next event loop tick)
 * @throws An error if no exit method is available (e.g. in browser environments)
 */
export function scheduleExit(code: number = 0, timeout = 0): void {
  if(timeout < 0)
    throw new TypeError("Timeout must be a non-negative number");

  let exit: (() => void) | undefined;
  if(typeof process !== "undefined" && "exit" in process && typeof process.exit === "function")
    exit = () => process.exit(code);
  else if(typeof Deno !== "undefined" && "exit" in Deno && typeof Deno.exit === "function")
    exit = () => Deno.exit(code);
  else
    throw new ScriptContextError("Cannot exit the process, no exit method available");

  setTimeout(exit, timeout);
}

/**
 * Returns the current call stack, starting at the caller of this function.
 * @param asArray Whether to return the stack as an array of strings or a single string. Defaults to true.
 * @param lines The number of lines to return from the stack. Defaults to Infinity (all of them).
 */
export function getCallStack<TAsArray extends boolean = true>(asArray?: TAsArray, lines = Infinity): TAsArray extends true ? string[] : string {
  if(typeof lines !== "number" || isNaN(lines) || lines < 0)
    throw new TypeError("lines parameter must be a non-negative number");

  try {
    throw new Error("This is to capture a stack trace with CoreUtils.getCallStack(). (If you see this somewhere, you can safely ignore it.)");
  }
  catch(err) {
    const stack = ((err as Error).stack ?? "")
      .split("\n").map((line) => line.trim())
      .slice(2, lines + 2);

    // @ts-expect-error
    return asArray !== false ? stack : stack.join("\n");
  }
}
