/**
 * @module lib/misc
 * This module contains miscellaneous functions that don't fit in another category - [see the documentation for more info](https://github.com/Sv443-Network/UserUtils/blob/main/docs.md#misc)
 */

import type { ListLike, Prettify } from "./types.js";

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
      rejectOnAbort ? rej(new Error("The pause was aborted")) : res();
    });
  });
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
    throw new Error("Error while calling fetch", { cause: err });
  }
}

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
 * Turns the passed object into a "pure" object without a prototype chain, meaning it won't have any default properties like `toString`, `__proto__`, `__defineGetter__`, etc.  
 * This makes the object immune to prototype pollution attacks and allows for cleaner object literals, at the cost of being harder to work with in some cases.  
 * It also effectively transforms a `Stringifiable` value into one that will throw a TypeError when stringified instead of defaulting to `[object Object]`  
 * If no object is passed, it will return an empty object without prototype chain.
 */
export function pureObj<TObj extends object>(obj?: TObj): TObj {
  return Object.assign(Object.create(null), obj ?? {}) as TObj;
}
