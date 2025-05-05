/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * @module types
 * This module contains various utility types - [see the documentation for more info](https://github.com/Sv443-Network/CoreUtils/blob/main/docs.md#types)
 */

/** Any value that is list-like, i.e. has a quantifiable length, count or size property */
export type ListLike = unknown[] | { length: number } | { count: number } | { size: number };

/**
 * A type that offers autocomplete for the passed union but also allows any arbitrary value of the same type to be passed.  
 * Supports unions of strings, numbers and objects.
 */
export type LooseUnion<TUnion extends string | number | object> =
  | (TUnion)
  | (
    TUnion extends string
      ? (string & {})
      : (
        TUnion extends number
          ? (number & {})
          : (
            TUnion extends Record<keyof any, unknown>
              ? (object & {})
              : never
          )
      )
  );

/** Any class reference that can be instantiated with `new` */
export type Newable<T> = new (...args: any[]) => T;

/**
 * A type that allows all strings except for empty ones
 * @example
 * function foo<T extends string>(bar: NonEmptyString<T>) {
 *   console.log(bar);
 * }
 */
export type NonEmptyString<TString extends string> = TString extends "" ? never : TString;

/** String constant that decides which set of number formatting options to use */
export type NumberFormat = "short" | "long";

/**
 * Makes the structure of a type more readable by expanding it.  
 * This can be useful for debugging or for improving the readability of complex types.
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

/** Any value that can be serialized to JSON */
export type SerializableVal = string | number | boolean | null | SerializableVal[] | { [key: string]: SerializableVal };

/** Any value that can be implicitly converted to a string with `String(val)`, `val.toString()` or \``${val}`\` */
export type Stringifiable = string | number | boolean | null | undefined | { toString(): string } | Stringifiable[];
