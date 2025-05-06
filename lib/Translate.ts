/**
 * @module Translate
 * This module contains a sophisticated but still lightweight, JSON-based translation system - [see the documentation for more info](https://github.com/Sv443-Network/CoreUtils/blob/main/docs.md#class-translate)
 */

import type { Stringifiable } from "./types.js";

//#region tr system

/**
 * Translation object to pass to {@linkcode tr.addTranslations()}  
 * Can be a flat object of identifier keys and the translation text as the value, or an infinitely nestable object containing the same.  
 *   
 * @example
 * // Flat object:
 * const tr_en: TrObject = {
 *   hello: "Hello, %1!",
 *   foo: "Foo",
 * };
 * 
 * // Nested object:
 * const tr_de: TrObject = {
 *   hello: "Hallo, %1!",
 *   foo: {
 *     bar: "Foo bar",
 *   },
 * };
 */
export interface TrObject {
 [key: string]: string | TrObject;
}

/** Properties for the transform function that transforms a matched translation string into something else */
export type TransformFnProps<TTrKey extends string = string> = {
  /** The currently set language - empty string if not set yet */
  language: string;
  /** The matches as returned by `RegExp.exec()` */
  matches: RegExpExecArray[];
  /** The translation key */
  trKey: TTrKey;
  /** Translation value before any transformations */
  trValue: string;
  /** Current value, possibly in-between transformations */
  currentValue: string;
  /** Arguments passed to the translation function */
  trArgs: (Stringifiable | Record<string, Stringifiable>)[];
};

/** Function that transforms a matched translation string into another string */
export type TransformFn<TTrKey extends string = string> = (props: TransformFnProps<TTrKey>) => Stringifiable;

/**
 * Pass a nested or flat translation object to this generic type to recursively get all keys in the object.  
 * @example ```ts
 * type Keys = TrKeys<{ a: { b: { c: "bar" }, d: "foo" }, e: "baz" }>;
 * //    ^? type Keys = "a.b.c" | "a.d" | "e"
 * ```
 */
export type TrKeys<TTrObj, P extends string = ""> = {
  [K in keyof TTrObj]: K extends string | number | boolean | null | undefined
    ? TTrObj[K] extends object
      ? TrKeys<TTrObj[K], `${P}${K}.`>
      : `${P}${K}`
    : never
}[keyof TTrObj];

/** Options for the {@linkcode Translate} class */
export type TranslateOptions = {};

//#region Translate class

// TODO:
/**
 * Class that manages translations, provides many utility functions, handles fallbacks and allows you to specify custom transforms to insert values or modify the translation string in pretty much any way imaginable.
 */
export class Translate {
  public readonly options: TranslateOptions;

  /** All translations loaded into memory */
  protected translations: Record<string, TrObject> = {};

  constructor(options: TranslateOptions) {
    this.options = options;
  }
}



//#region old code:

// /** All translations loaded into memory */
// const trans: {
//  [language: string]: TrObject;
// } = {};

// /** All registered value transformers */
// const valTransforms: Array<{
//  regex: RegExp;
//  fn: TransformFn;
// }> = [];

// /** Currently set language */
// let curLang = "";
// /** Fallback language - if undefined, the trKey itself will be returned if the translation is not found */
// let fallbackLang: string | undefined;

// /** Common function to resolve the translation text in a specific language and apply transform functions. */
// function translate<TTrKey extends string = string>(language: string, key: TTrKey, ...trArgs: (Stringifiable | Record<string, Stringifiable>)[]): string {
//   if(typeof language !== "string")
//     language = curLang ?? "";

//   const trObj = trans[language];

//   if(typeof language !== "string" || language.length === 0 || typeof trObj !== "object" || trObj === null)
//     return fallbackLang ? translate(fallbackLang, key, ...trArgs) : key;

//   const transformTrVal = (trKey: TTrKey, trValue: string): string => {
//     const tfs = valTransforms.filter(({ regex }) => new RegExp(regex).test(trValue));

//     if(tfs.length === 0)
//       return trValue;

//     let retStr = String(trValue);

//     for(const tf of tfs) {
//       const re = new RegExp(tf.regex);

//       const matches: RegExpExecArray[] = [];
//       let execRes: RegExpExecArray | null;
//       while((execRes = re.exec(trValue)) !== null) {
//         if(matches.some(m => m[0] === execRes?.[0]))
//           break;
//         matches.push(execRes);
//       }

//       retStr = String(tf.fn({
//         language,
//         trValue,
//         currentValue: retStr,
//         matches,
//         trKey,
//         trArgs,
//       }));
//     }

//     return retStr;
//   };

//   // try to resolve via traversal (e.g. `trObj["key"]["parts"]`)
//   const keyParts = key.split(".");
//   let value: string | TrObject | undefined = trObj;
//   for(const part of keyParts) {
//     if(typeof value !== "object" || value === null)
//       break;
//     value = value?.[part];
//   }
//   if(typeof value === "string")
//     return transformTrVal(key, value);

//   // try falling back to `trObj["key.parts"]`
//   value = trObj?.[key];
//   if(typeof value === "string")
//     return transformTrVal(key, value);

//   // default to en-US or translation key
//   return fallbackLang ? translate(fallbackLang, key, ...trArgs) : key;
// }

// /**
//  * Returns the translated text for the specified key in the specified language.  
//  * If the key is not found in the specified previously registered translation, the key itself is returned.  
//  *   
//  * ⚠️ Remember to register a language with {@linkcode tr.addTranslations()} before using this function, otherwise it will always return the key itself.
//  * @param language Language code or name to use for the translation
//  * @param key Key of the translation to return
//  * @param args Optional arguments to be passed to the translated text. They will replace placeholders in the format `%n`, where `n` is the 1-indexed argument number
//  */
// function trFor<TTrKey extends string = string>(language: string, key: TTrKey, ...args: (Stringifiable | Record<string, Stringifiable>)[]): string {
//   const txt = translate(language, key, ...args);
//   if(txt === key)
//     return translate(defaultLocale, key, ...args);
//   return txt;
// }

// /**
//  * Prepares a translation function for a specific language.
//  * @example ```ts
//  * tr.addTranslations("en", {
//  *   hello: "Hello, %1!",
//  * });
//  * const t = tr.useTr("en");
//  * t("hello", "John"); // "Hello, John!"
//  * ```
//  */
// function useTr<TTrKey extends string = string>(language: string) {
//   return (key: TTrKey, ...args: (Stringifiable | Record<string, Stringifiable>)[]) =>
//     translate<TTrKey>(language, key, ...args);
// }

// /**
//  * Registers a new language and its translations - if the language already exists, it will be overwritten.  
//  * The translations are a key-value pair where the key is the translation key and the value is the translated text.  
//  *   
//  * The translations can contain placeholders in the format `%n`, where `n` is the 1-indexed argument number.  
//  * These placeholders will be replaced by the arguments passed to the translation functions.  
//  * @param language Language code or name to register
//  * @param translations Translations for the specified language
//  * @example ```ts
//  * tr.addTranslations("en", {
//  *   hello: "Hello, %1!",
//  *   foo: {
//  *     bar: "Foo bar",
//  *   },
//  * });
//  * ```
//  */
// function addTranslations(language: string, translations: TrObject): void {
//   trans[language] = JSON.parse(JSON.stringify(translations));
// }

// /**
//  * Returns the translation object for the specified language or currently active one.  
//  * If the language is not registered with {@linkcode tr.addTranslations()}, this function will return `undefined`.  
//  * @param language Language code or name to get translations for - defaults to the currently active language (set by {@linkcode tr.setLanguage()})
//  * @returns Translations for the specified language
//  */
// function getTranslations(language = curLang): TrObject | undefined {
//   return trans[language];
// }

// /**
//  * Deletes the translations for the specified language from memory.  
//  * @param language Language code or name to delete
//  */
// const deleteTranslations = (language: string): void => {
//   delete trans[language];
// };

// /**
//  * Sets the active language for the translation functions.  
//  * This language will be used by the {@linkcode tr()} function to return the translated text.  
//  * If the language is not registered with {@linkcode tr.addTranslations()}, the translation functions will always return the key itself or fall back to the previously set fallback language.  
//  * By default, the language will be set to an empty string.
//  * @param language Language code or name to set as active
//  */
// function setLanguage(language: string): void {
//   curLang = language;
// };

// /**
//  * Returns the active language set by {@linkcode tr.setLanguage()}  
//  * By default, the language will be set to an empty string.
//  * @returns Active language code or name, else empty string
//  */
// function getLanguage(): string {
//   return curLang;
// }

// /** The fallback language to use when a translation key is not found in the currently active language - undefined to disable fallbacks and just return the translation key */
// function setFallbackLanguage(fallbackLanguage?: string): void {
//   fallbackLang = fallbackLanguage;
// };

// /** Returns the fallback language set by {@linkcode tr.setFallbackLanguage()} */
// function getFallbackLanguage(): string | undefined {
//   return fallbackLang;
// }

// /**
//  * Adds a transform function that gets called after resolving a translation for any language.  
//  * Use it to enable dynamic values in translations, for example to insert custom global values from the application or to denote a section that could be encapsulated by rich text.  
//  * Each function will receive the RegExpMatchArray [see MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match) and the current language as arguments.  
//  * After all %n-formatted values have been injected, the transform functions will be called sequentially in the order they were added.
//  * @example
//  * ```ts
//  * tr.addTranslations("en", {
//  *    "greeting": {
//  *      "with_username": "Hello, ${USERNAME}",
//  *      "headline_html": "Hello, ${USERNAME}<br><c=red>You have ${UNREAD_NOTIFS} unread notifications.</c>"
//  *    }
//  * });
//  * 
//  * // replace ${PATTERN}
//  * tr.addTransform(/<\$([A-Z_]+)>/g, ({ matches }) => {
//  *   switch(matches?.[1]) {
//  *     default: return "<UNKNOWN_PATTERN>";
//  *     // these would be grabbed from elsewhere in the application:
//  *     case "USERNAME": return "JohnDoe45";
//  *     case "UNREAD_NOTIFS": return 5;
//  *   }
//  * });
//  * 
//  * // replace <c=red>...</c> with <span class="color red">...</span>
//  * tr.addTransform(/<c=([a-z]+)>(.*?)<\/c>/g, ({ matches }) => {
//  *   const color = matches?.[1];
//  *   const content = matches?.[2];
//  * 
//  *   return "<span class=\"color " + color + "\">" + content + "</span>";
//  * });
//  * 
//  * tr.setLanguage("en");
//  * 
//  * tr("greeting.with_username"); // "Hello, JohnDoe45"
//  * tr("greeting.headline"); // "<b>Hello, JohnDoe45</b>\nYou have 5 unread notifications."
//  * ```
//  * @param pattern Regular expression or string (passed to `new RegExp(pattern, "gm")`) that should match the entire pattern that calls the transform function
//  * @param fn Function that transforms the matched pattern into something else
//  */
// function addTransform(pattern: RegExp | string, fn: TransformFn): void {
//   valTransforms.push({ fn: fn as TransformFn, regex: typeof pattern === "string" ? new RegExp(pattern, "gm") : pattern });
// };

// /**
//  * Deletes the first transform function from the list of registered transform functions.  
//  * @param patternOrFn A reference to the regular expression of the transform function, a string matching the original pattern, or a reference to the transform function to delete
//  */
// function deleteTransform(patternOrFn: RegExp | string | TransformFn): void {
//   const idx = valTransforms.findIndex((t) =>
//     (t.fn === patternOrFn as unknown as () => void)
//     || (t.regex === (typeof patternOrFn === "string" ? new RegExp(patternOrFn, "gm") : patternOrFn))
//   );
//   idx !== -1 && valTransforms.splice(idx, 1);
// };

// /**
//  * Checks if a translation exists given its {@linkcode key} in the specified {@linkcode language} or else the currently active one.  
//  * If the language is not registered with {@linkcode tr.addTranslations()}, this function will return `false`.  
//  * @param key Key of the translation to check for
//  * @param language Language code or name to check in - defaults to the currently active language (set by {@linkcode tr.setLanguage()})
//  * @returns Whether the translation key exists in the specified language - always returns `false` if no language is given and no active language was set
//  */
// function hasKey<TTrKey extends string = string>(key: TTrKey, language = curLang): boolean {
//   return tr.for(language, key as TrKeyEn) !== key;
// };

// const tr = {
//   for: (...params: Parameters<typeof trFor<TrKeyEn>>) => trFor<TrKeyEn>(...params as Parameters<typeof trFor<TrKeyEn>>),
//   use: (...params: Parameters<typeof useTr<TrKeyEn>>) => useTr<TrKeyEn>(...params as Parameters<typeof useTr<TrKeyEn>>),
//   addTranslations,
//   getTranslations,
//   deleteTranslations,
//   setLanguage,
//   getLanguage,
//   setFallbackLanguage,
//   getFallbackLanguage,
//   addTransform,
//   deleteTransform,
//   hasKey: (key: TrKeyEn, language?: string) => hasKey<TrKeyEn>(key, language),
// };

// export { tr };

// //#region custom stuff

// /** All translation keys from the file `@assets/translations/en-US.json` */
// export type TrKeyEn = TrKeys<typeof trEn> | "_";

// /** The default and fallback locale */
// export const defaultLocale = "en-US";

// /** Array of tuples containing the regular expression and the transformation function */
// const transforms = [
//   // replace placeholders in the format `${name}` with the value of the key `name` in the passed object or use positional mapping with the passed spread arguments
//   [
//     /\$\{([a-zA-Z0-9$_-]+)\}/gm,
//     ({ matches, trArgs, trValue }) => {
//       const patternStart = "${",
//         patternEnd = "}",
//         patternRegex = /\$\{.+\}/m;

//       let str = String(trValue);

//       const eachKeyInTrString = (keys: string[]): boolean => keys.every((key) => trValue.includes(`${patternStart}${key}${patternEnd}`));

//       const namedMapping = (): void => {
//         if(!str.includes(patternStart) || typeof trArgs[0] === "undefined" || typeof trArgs[0] !== "object" || !eachKeyInTrString(Object.keys(trArgs[0] ?? {})))
//           return;
//         for(const match of matches) {
//           const repl = (trArgs[0] as Record<string, string>)[match[1]];
//           if(typeof repl !== "undefined")
//             str = str.replace(match[0], String(repl));
//         }
//       };

//       const positionalMapping = (): void => {
//         if(!(patternRegex.test(str)) || !trArgs[0])
//           return;
//         let matchNum = -1;
//         for(const match of matches) {
//           matchNum++;
//           if(typeof trArgs[matchNum] !== "undefined")
//             str = str.replace(match[0], String(trArgs[matchNum]));
//         }
//       };

//       /** Whether the first args parameter is an object that doesn't implement a custom `toString` method */
//       const isArgsObject = trArgs[0] && typeof trArgs[0] === "object" && trArgs[0] !== null && String(trArgs[0]).startsWith("[object");

//       if(isArgsObject && eachKeyInTrString(Object.keys(trArgs[0]!)))
//         namedMapping();
//       else
//         positionalMapping();

//       return str;
//     },
//   ],
// ] as const satisfies [RegExp, TransformFn<TrKeyEn>][];

// /** Loads all translations from files in the folder at `src/assets/translations` and applies transformation functions */
// export async function initTranslations(): Promise<void> {
//   const files = await readdir("src/assets/translations");
//   let enName: string | undefined;

//   for(const file of files) {
//     try {
//       if(file.split(".").at(-1)! !== "json")
//         continue;

//       const langCode = file.split(".")[0];
//       const data = JSON.parse(await readFile(`src/assets/translations/${file}`, "utf-8")) as TrObject;

//       tr.addTranslations(langCode, data);

//       if(langCode.startsWith("en") && enName !== defaultLocale)
//         enName = langCode;
//     }
//     catch(err) {
//       console.error(styleText("red", `Error while loading translations from '${file}':\n`), err);
//     }
//   }

//   for(const [regex, fn] of transforms)
//     tr.addTransform(regex, fn as TransformFn);

//   tr.setLanguage(enName ?? defaultLocale);
//   tr.setFallbackLanguage(enName ?? defaultLocale);
// }

// /** Returns all registered translations */
// export function getRegisteredTranslations(): Set<string> {
//   return new Set(Object.keys(trans));
// }

// //#region getLocMap

// /** Returns a Discord API localization map for all locales where the given common translation key exists */
// export function getLocMap(trKey: TrKeyEn, prefix = ""): LocalizationMap {
//   const locMap = {} as LocalizationMap;

//   for(const [language, trObj] of Object.entries(trans)) {
//     const transform = (trValue: string): string => {
//       const tf = valTransforms.find((t) => t.regex.test(trValue));

//       if(!tf)
//         return trValue;

//       let retStr = String(trValue);
//       const re = new RegExp(tf.regex);

//       const matches: RegExpExecArray[] = [];
//       let execRes: RegExpExecArray | null;
//       while((execRes = re.exec(trValue)) !== null) {
//         if(matches.some(m => m[0] === execRes?.[0]))
//           break;
//         matches.push(execRes);
//       }

//       retStr = String(tf.fn({
//         language,
//         trValue,
//         currentValue: retStr,
//         matches,
//         trKey,
//         trArgs: [],
//       }));

//       return retStr;
//     };

//     // try to resolve via traversal (e.g. `trObj["key"]["parts"]`)
//     const keyParts = trKey.split(".");
//     let value: string | TrObject | undefined = trObj;
//     for(const part of keyParts) {
//       if(typeof value !== "object" || value === null)
//         break;
//       value = value?.[part];
//     }
//     if(typeof value === "string")
//       locMap[language as keyof LocalizationMap] = `${prefix}${transform(value)}`;

//     // try falling back to `trObj["key.parts"]`
//     value = trObj?.[trKey];
//     if(typeof value === "string")
//       locMap[language as keyof LocalizationMap] = `${prefix}${transform(value)}`;
//   }

//   return Object.keys(locMap).length === 0
//     ? { "en-US": trKey }
//     : locMap;
// }
