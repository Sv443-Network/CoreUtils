/**
 * @module crypto
 * This module contains various cryptographic functions, like compression and Uint8Array encoding - [see the documentation for more info](https://github.com/Sv443-Network/CoreUtils/blob/main/docs.md#crypto)
 */

import { mapRange, randRange } from "./math.ts";
import type { Stringifiable } from "./types.ts";

/** Converts an Uint8Array to a base64-encoded (ASCII) string */
export function abtoa(buf: Uint8Array): string {
  return btoa(
    new Uint8Array(buf)
      .reduce((data, byte) => data + String.fromCharCode(byte), ""),
  );
}

/** Converts a base64-encoded (ASCII) string to an Uint8Array representation of its bytes */
export function atoab(str: string): Uint8Array {
  return Uint8Array.from(atob(str), c => c.charCodeAt(0));
}

/** Compresses a string or an Uint8Array using the provided {@linkcode compressionFormat} and returns it as a base64 string */
export async function compress(input: Stringifiable | Uint8Array, compressionFormat: CompressionFormat, outputType?: "string"): Promise<string>
/** Compresses a string or an Uint8Array using the provided {@linkcode compressionFormat} and returns it as an Uint8Array */
export async function compress(input: Stringifiable | Uint8Array, compressionFormat: CompressionFormat, outputType: "arrayBuffer"): Promise<Uint8Array>
/** Compresses a string or an Uint8Array using the provided {@linkcode compressionFormat} and returns it as a base64 string or Uint8Array, depending on what {@linkcode outputType} is set to */
export async function compress(input: Stringifiable | Uint8Array, compressionFormat: CompressionFormat, outputType: "string" | "arrayBuffer" = "string"): Promise<Uint8Array | string> {
  const byteArray = input instanceof Uint8Array
    ? input
    : new TextEncoder().encode(input?.toString() ?? String(input));
  const comp = new CompressionStream(compressionFormat);
  const writer = comp.writable.getWriter();
  // @ts-ignore in some envs Uint8Array<ArrayBufferLike> and ArrayBufferView<ArrayBuffer> don't sufficiently overlap
  writer.write(byteArray);
  writer.close();
  const uintArr = new Uint8Array(await (new Response(comp.readable).arrayBuffer()));
  return outputType === "arrayBuffer"
    ? uintArr
    : abtoa(uintArr);
}

/** Decompresses a previously compressed base64 string or Uint8Array, with the format passed by {@linkcode compressionFormat}, converted to a string */
export async function decompress(input: Stringifiable | Uint8Array, compressionFormat: CompressionFormat, outputType?: "string"): Promise<string>
/** Decompresses a previously compressed base64 string or Uint8Array, with the format passed by {@linkcode compressionFormat}, converted to an Uint8Array */
export async function decompress(input: Stringifiable | Uint8Array, compressionFormat: CompressionFormat, outputType: "arrayBuffer"): Promise<Uint8Array>
/** Decompresses a previously compressed base64 string or Uint8Array, with the format passed by {@linkcode compressionFormat}, converted to a string or Uint8Array, depending on what {@linkcode outputType} is set to */
export async function decompress(input: Stringifiable | Uint8Array, compressionFormat: CompressionFormat, outputType: "string" | "arrayBuffer" = "string"): Promise<Uint8Array | string> {
  const byteArray = input instanceof Uint8Array
    ? input
    : atoab(input?.toString() ?? String(input));
  const decomp = new DecompressionStream(compressionFormat);
  const writer = decomp.writable.getWriter();
  // @ts-ignore in some envs Uint8Array<ArrayBufferLike> and ArrayBufferView<ArrayBuffer> don't sufficiently overlap
  writer.write(byteArray);
  writer.close();
  const uintArr = new Uint8Array(await (new Response(decomp.readable).arrayBuffer()));
  return outputType === "arrayBuffer"
    ? uintArr
    : new TextDecoder().decode(uintArr);
}

/**
 * Creates a hash / checksum of the given {@linkcode input} string or Uint8Array using the specified {@linkcode algorithm} ("SHA-256" by default).  
 *   
 * - ⚠️ Uses the SubtleCrypto API so it needs to run in a secure context (HTTPS).  
 * - ⚠️ If you use this for cryptography, make sure to use a secure algorithm (under no circumstances use SHA-1) and to [salt](https://en.wikipedia.org/wiki/Salt_(cryptography)) your input data.
 */
export async function computeHash(input: string | Uint8Array, algorithm = "SHA-256"): Promise<string> {
  let data: Uint8Array;
  if(typeof input === "string") {
    const encoder = new TextEncoder();
    data = encoder.encode(input);
  }
  else
    data = input;

  // @ts-ignore in some envs SharedArrayBuffer and ArrayBuffer don't sufficiently overlap
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("");

  return hashHex;
}

/**
 * Generates a random ID with the specified length and radix (16 characters and hexadecimal by default)  
 *   
 * - ⚠️ Not suitable for generating anything related to cryptography! Use [SubtleCrypto's `generateKey()`](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey) for that instead.
 * @param length The length of the ID to generate (defaults to 16)
 * @param radix The [radix](https://en.wikipedia.org/wiki/Radix) of each digit (defaults to 16 which is hexadecimal. Use 2 for binary, 10 for decimal, 36 for alphanumeric, etc.)
 * @param enhancedEntropy If set to true, uses [`crypto.getRandomValues()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues) for better cryptographic randomness (this also makes it take longer to generate)  
 * @param randomCase If set to false, the generated ID will be lowercase only - also makes use of the `enhancedEntropy` parameter unless the output doesn't contain letters
 */
export function randomId(length = 16, radix = 16, enhancedEntropy = false, randomCase = true): string {
  if(length < 1)
    throw new RangeError("The length argument must be at least 1");

  if(radix < 2 || radix > 36)
    throw new RangeError("The radix argument must be between 2 and 36");

  let arr: string[] = [];
  const caseArr = randomCase ? [0, 1] : [0];

  if(enhancedEntropy) {
    const uintArr = new Uint8Array(length);
    crypto.getRandomValues(uintArr);
    arr = Array.from(
      uintArr,
      (v) => mapRange(v, 0, 255, 0, radix).toString(radix).substring(0, 1),
    );
  }
  else {
    arr = Array.from(
      { length },
      () => Math.floor(Math.random() * radix).toString(radix),
    );
  }

  if(!arr.some((v) => /[a-zA-Z]/.test(v)))
    return arr.join("");

  return arr.map((v) => caseArr[randRange(0, caseArr.length - 1, enhancedEntropy)] === 1 ? v.toUpperCase() : v).join("");
}
