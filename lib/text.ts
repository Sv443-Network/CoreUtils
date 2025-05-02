import type { ValueGen } from "./misc.js";
import type { ListLike, Prettify, Stringifiable } from "./types.js";

/**
 * Automatically pluralizes the given string an `-s` or `-ies` to the passed {@linkcode term}, if {@linkcode num} is not equal to 1.  
 * By default, words ending in `-y` will have it replaced with `-ies`, and all other words will simply have `-s` appended.  
 * If {@linkcode num} resolves to NaN or the {@linkcode pluralType} is wrong, it defaults to the {@linkcode pluralType} `auto` and sets {@linkcode num} to 2.
 * @param term The term, written in singular form, to auto-convert to plural form
 * @param num A number, or list-like value that has either a `length`, `count` or `size` property, like an array, Map or discord.js Collection - does not support iterables, they need to be converted to an array first
 * @param pluralType Which plural form to use when auto-pluralizing. Defaults to `"auto"`, which removes the last char and uses `-ies` for words ending in `y` and simply appends `-s` for all other words
 */
export function autoPlural(term: Stringifiable, num: number | ListLike, pluralType: "auto" | "-s" | "-ies" = "auto"): string {
  if(typeof num !== "number") {
    if("length" in num)
      num = num.length;
    else if("size" in num)
      num = num.size;
    else if("count" in num)
      num = num.count;
  }

  if(!["-s", "-ies"].includes(pluralType))
    pluralType = "auto";

  if(isNaN(num))
    num = 2;

  const pType: "-s" | "-ies" = pluralType === "auto"
    ? String(term).endsWith("y") ? "-ies" : "-s"
    : pluralType;

  switch(pType) {
  case "-s":
    return `${term}${num === 1 ? "" : "s"}`;
  case "-ies":
    return `${String(term).slice(0, -1)}${num === 1 ? "y" : "ies"}`;
  default:
    return String(term);
  }
}

/** Capitalizes the first letter of a string */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
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

/** The default progress bar characters used by {@linkcode createProgressBar()} */
export const defaultPbChars = {
  100: "█",
  75: "▓",
  50: "▒",
  25: "░",
  0: "─",
} as const;

/** Progress bar characters used by {@linkcode createProgressBar()} */
export type ProgressBarChars = Prettify<Record<keyof typeof defaultPbChars, string>>;

/**
 * Generates a progress bar with the given percentage and max length.  
 * Uses opaque, dithered unicode block characters by default for extra detail.  
 * Use {@linkcode chars} to override the default characters (for example, use emojis via `<:emoji:ID>` or `😃`)
 */
export function createProgressBar(percentage: number, barLength: number, chars: ProgressBarChars = defaultPbChars): string {
  if(percentage === 100)
    return chars[100].repeat(barLength);

  const filledLength = Math.floor((percentage / 100) * barLength);
  const remainingPercentage = percentage / 10 * barLength - filledLength;

  let lastBlock = "";
  if(remainingPercentage >= 0.75)
    lastBlock = chars[75];
  else if(remainingPercentage >= 0.5)
    lastBlock = chars[50];
  else if (remainingPercentage >= 0.25)
    lastBlock = chars[25];

  const filledBar = chars[100].repeat(filledLength);
  const emptyBar = chars[0].repeat(barLength - filledLength - (lastBlock ? 1 : 0));

  return `${filledBar}${lastBlock}${emptyBar}`;
}

/**
 * Inserts the passed values into a string at the respective placeholders.  
 * The placeholder format is `%n`, where `n` is the 1-indexed argument number.
 * @param input The string to insert the values into
 * @param values The values to insert, in order, starting at `%1`
 */
export function insertValues(input: string, ...values: Stringifiable[]): string {
  return input.replace(/%\d/gm, (match) => {
    const argIndex = Number(match.substring(1)) - 1;
    return (values[argIndex] ?? match)?.toString();
  });
}

/** Joins an array of strings with a separator and a last separator - defaults to `,` & `and` */
export function joinArrayReadable(array: unknown[], separators = ", ", lastSeparator = " and "): string {
  const arr = [...array];
  if(arr.length === 0)
    return "";
  else if(arr.length === 1)
    return String(arr[0]);
  else if(arr.length === 2)
    return arr.join(lastSeparator);

  const lastItm = lastSeparator + arr[arr.length - 1];
  arr.pop();
  return arr.join(separators) + lastItm;
}

/** Converts seconds into the timestamp format `(hh:)mm:ss`, with intelligent zero-padding */
export function secsToTimeStr(seconds: number): string {
  if(seconds < 0)
    throw new TypeError("Seconds must be a positive number");

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return [
    hours ? hours + ":" : "",
    String(minutes).padStart(minutes > 0 || hours > 0 ? 2 : 1, "0"),
    ":",
    String(secs).padStart(secs > 0 || minutes > 0 || hours > 0 ? 2 : 1, "0")
  ].join("");
}

/** Truncates a string if it exceeds `length` and inserts `endStr` at the end (empty string to disable) */
export function truncStr(input: Stringifiable, length: number, endStr = "..."): string {
  const str = input?.toString() ?? String(input);
  return str.length > length ? str.substring(0, length) + endStr : str;
}
