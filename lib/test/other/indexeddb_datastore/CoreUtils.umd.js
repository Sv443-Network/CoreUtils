/* umd */
(function (g, f) {
      if ("object" == typeof exports && "object" == typeof module) {
        module.exports = f();
      } else if ("function" == typeof define && define.amd) {
        define("CoreUtils", [], f);
      } else if ("object" == typeof exports) {
        exports["CoreUtils"] = f();
      } else {
        g["CoreUtils"] = f();
      }
    }(this, () => {
  var exports = {};
  var module = { exports };




"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// lib/index.ts
var lib_exports = {};
__export(lib_exports, {
  BrowserStorageEngine: () => BrowserStorageEngine,
  ChecksumMismatchError: () => ChecksumMismatchError,
  CustomError: () => CustomError,
  DataStore: () => DataStore,
  DataStoreEngine: () => DataStoreEngine,
  DataStoreSerializer: () => DataStoreSerializer,
  DatedError: () => DatedError,
  Debouncer: () => Debouncer,
  FileStorageEngine: () => FileStorageEngine,
  IndexedDBStorageEngine: () => IndexedDBStorageEngine,
  MigrationError: () => MigrationError,
  NanoEmitter: () => NanoEmitter,
  NetworkError: () => NetworkError,
  PicoEmitter: () => PicoEmitter,
  ScriptContextError: () => ScriptContextError,
  ValidationError: () => ValidationError,
  abtoa: () => abtoa,
  atoab: () => atoab,
  autoPlural: () => autoPlural,
  bitSetHas: () => bitSetHas,
  capitalize: () => capitalize,
  clamp: () => clamp,
  compress: () => compress,
  computeHash: () => computeHash,
  consumeGen: () => consumeGen,
  consumeStringGen: () => consumeStringGen,
  createProgressBar: () => createProgressBar,
  createRecurringTask: () => createRecurringTask,
  createTable: () => createTable,
  darkenColor: () => darkenColor,
  debounce: () => debounce,
  decompress: () => decompress,
  defaultPbChars: () => defaultPbChars,
  defaultTableLineCharset: () => defaultTableLineCharset,
  digitCount: () => digitCount,
  fetchAdvanced: () => fetchAdvanced,
  formatNumber: () => formatNumber,
  getCallStack: () => getCallStack,
  getListLength: () => getListLength,
  getterifyObj: () => getterifyObj,
  hexToRgb: () => hexToRgb,
  insertValues: () => insertValues,
  joinArrayReadable: () => joinArrayReadable,
  lightenColor: () => lightenColor,
  mapRange: () => mapRange,
  overflowVal: () => overflowVal,
  pauseFor: () => pauseFor,
  pureObj: () => pureObj,
  randRange: () => randRange,
  randomId: () => randomId,
  randomItem: () => randomItem,
  randomItemIndex: () => randomItemIndex,
  randomizeArray: () => randomizeArray,
  rgbToHex: () => rgbToHex,
  roundFixed: () => roundFixed,
  scheduleExit: () => scheduleExit,
  secsToTimeStr: () => secsToTimeStr,
  setImmediateInterval: () => setImmediateInterval,
  setImmediateTimeoutLoop: () => setImmediateTimeoutLoop,
  takeRandomItem: () => takeRandomItem,
  takeRandomItemIndex: () => takeRandomItemIndex,
  truncStr: () => truncStr,
  valsWithin: () => valsWithin
});
module.exports = __toCommonJS(lib_exports);

// lib/math.ts
function bitSetHas(bitSet, checkVal) {
  return (bitSet & checkVal) === checkVal;
}
function clamp(value, min, max) {
  if (typeof max !== "number") {
    max = min;
    min = 0;
  }
  return Math.max(Math.min(value, max), min);
}
function digitCount(num, withDecimals = true) {
  num = Number(!["string", "number"].includes(typeof num) ? String(num) : num);
  if (typeof num === "number" && isNaN(num))
    return NaN;
  const [intPart, decPart] = num.toString().split(".");
  const intDigits = intPart === "0" ? 1 : Math.floor(Math.log10(Math.abs(Number(intPart))) + 1);
  const decDigits = withDecimals && decPart ? decPart.length : 0;
  return intDigits + decDigits;
}
function formatNumber(number, locale, format) {
  return number.toLocaleString(
    locale,
    format === "short" ? {
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: 1
    } : {
      style: "decimal",
      maximumFractionDigits: 0
    }
  );
}
function mapRange(value, range1min, range1max, range2min, range2max) {
  if (typeof range2min === "undefined" || typeof range2max === "undefined") {
    range2max = range1max;
    range1max = range1min;
    range2min = range1min = 0;
  }
  if (Number(range1min) === 0 && Number(range2min) === 0)
    return value * (range2max / range1max);
  return (value - range1min) * ((range2max - range2min) / (range1max - range1min)) + range2min;
}
function overflowVal(value, minOrMax, max) {
  const min = typeof max === "number" ? minOrMax : 0;
  max = typeof max === "number" ? max : minOrMax;
  if (min > max)
    throw new RangeError(`Parameter "min" can't be bigger than "max"`);
  if (isNaN(value) || isNaN(min) || isNaN(max) || !isFinite(value) || !isFinite(min) || !isFinite(max))
    return NaN;
  if (value >= min && value <= max)
    return value;
  const range = max - min + 1;
  const wrappedValue = ((value - min) % range + range) % range + min;
  return wrappedValue;
}
function randRange(...args) {
  let min, max, enhancedEntropy = false;
  if (typeof args[0] === "number" && typeof args[1] === "number")
    [min, max] = args;
  else if (typeof args[0] === "number" && typeof args[1] !== "number") {
    min = 0;
    [max] = args;
  } else
    throw new TypeError(`Wrong parameter(s) provided - expected (number, boolean|undefined) or (number, number, boolean|undefined) but got (${args.map((a) => typeof a).join(", ")}) instead`);
  if (typeof args[2] === "boolean")
    enhancedEntropy = args[2];
  else if (typeof args[1] === "boolean")
    enhancedEntropy = args[1];
  min = Number(min);
  max = Number(max);
  if (isNaN(min) || isNaN(max))
    return NaN;
  if (min > max)
    throw new TypeError(`Parameter "min" can't be bigger than "max"`);
  if (enhancedEntropy) {
    const uintArr = new Uint8Array(1);
    crypto.getRandomValues(uintArr);
    return Number(Array.from(
      uintArr,
      (v) => Math.round(mapRange(v, 0, 255, min, max)).toString(10)
    ).join(""));
  } else
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function roundFixed(num, fractionDigits) {
  const scale = 10 ** fractionDigits;
  return Math.round(num * scale) / scale;
}
function valsWithin(a, b, dec = 1, withinRange = 0.5) {
  return Math.abs(roundFixed(a, dec) - roundFixed(b, dec)) <= withinRange;
}

// lib/array.ts
function randomItem(array) {
  return randomItemIndex(array)[0];
}
function randomItemIndex(array) {
  if (array.length === 0)
    return [void 0, void 0];
  const idx = randRange(array.length - 1);
  return [array[idx], idx];
}
function randomizeArray(array) {
  const retArray = [...array];
  if (array.length === 0)
    return retArray;
  for (let i = retArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [retArray[i], retArray[j]] = [retArray[j], retArray[i]];
  }
  return retArray;
}
function takeRandomItem(arr) {
  var _a;
  return (_a = takeRandomItemIndex(arr)) == null ? void 0 : _a[0];
}
function takeRandomItemIndex(arr) {
  const [itm, idx] = randomItemIndex(arr);
  if (idx === void 0)
    return [void 0, void 0];
  arr.splice(idx, 1);
  return [itm, idx];
}

// lib/colors.ts
function darkenColor(color, percent, upperCase = false) {
  var _a;
  color = color.trim();
  const darkenRgb = (r2, g2, b2, percent2) => {
    r2 = Math.max(0, Math.min(255, r2 - r2 * percent2 / 100));
    g2 = Math.max(0, Math.min(255, g2 - g2 * percent2 / 100));
    b2 = Math.max(0, Math.min(255, b2 - b2 * percent2 / 100));
    return [r2, g2, b2];
  };
  let r, g, b, a;
  const isHexCol = color.match(/^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/);
  if (isHexCol)
    [r, g, b, a] = hexToRgb(color);
  else if (color.startsWith("rgb")) {
    const rgbValues = (_a = color.match(/\d+(\.\d+)?/g)) == null ? void 0 : _a.map(Number);
    if (!rgbValues)
      throw new TypeError("Invalid RGB/RGBA color format");
    [r, g, b, a] = rgbValues;
  } else
    throw new TypeError("Unsupported color format");
  [r, g, b] = darkenRgb(r, g, b, percent);
  if (isHexCol)
    return rgbToHex(r, g, b, a, color.startsWith("#"), upperCase);
  else if (color.startsWith("rgba"))
    return `rgba(${r}, ${g}, ${b}, ${a ?? NaN})`;
  else
    return `rgb(${r}, ${g}, ${b})`;
}
function hexToRgb(hex) {
  hex = (hex.startsWith("#") ? hex.slice(1) : hex).trim();
  const a = hex.length === 8 || hex.length === 4 ? parseInt(hex.slice(-(hex.length / 4)), 16) / (hex.length === 8 ? 255 : 15) : void 0;
  if (!isNaN(Number(a)))
    hex = hex.slice(0, -(hex.length / 4));
  if (hex.length === 3 || hex.length === 4)
    hex = hex.split("").map((c) => c + c).join("");
  const hexInt = parseInt(hex, 16);
  const r = hexInt >> 16 & 255;
  const g = hexInt >> 8 & 255;
  const b = hexInt & 255;
  return [clamp(r, 0, 255), clamp(g, 0, 255), clamp(b, 0, 255), typeof a === "number" ? clamp(a, 0, 1) : void 0];
}
function lightenColor(color, percent, upperCase = false) {
  return darkenColor(color, percent * -1, upperCase);
}
function rgbToHex(red, green, blue, alpha, withHash = true, upperCase = false) {
  const toHexVal = (n) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0")[upperCase ? "toUpperCase" : "toLowerCase"]();
  return `${withHash ? "#" : ""}${toHexVal(red)}${toHexVal(green)}${toHexVal(blue)}${alpha ? toHexVal(alpha * 255) : ""}`;
}

// lib/crypto.ts
function abtoa(buf) {
  return btoa(
    new Uint8Array(buf).reduce((data, byte) => data + String.fromCharCode(byte), "")
  );
}
function atoab(str) {
  return Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
}
async function compress(input, compressionFormat, outputType = "string") {
  const byteArray = input instanceof Uint8Array ? input : new TextEncoder().encode((input == null ? void 0 : input.toString()) ?? String(input));
  const comp = new CompressionStream(compressionFormat);
  const writer = comp.writable.getWriter();
  writer.write(byteArray);
  writer.close();
  const uintArr = new Uint8Array(await new Response(comp.readable).arrayBuffer());
  return outputType === "arrayBuffer" ? uintArr : abtoa(uintArr);
}
async function decompress(input, compressionFormat, outputType = "string") {
  const byteArray = input instanceof Uint8Array ? input : atoab((input == null ? void 0 : input.toString()) ?? String(input));
  const decomp = new DecompressionStream(compressionFormat);
  const writer = decomp.writable.getWriter();
  writer.write(byteArray);
  writer.close();
  const uintArr = new Uint8Array(await new Response(decomp.readable).arrayBuffer());
  return outputType === "arrayBuffer" ? uintArr : new TextDecoder().decode(uintArr);
}
async function computeHash(input, algorithm = "SHA-256") {
  let data;
  if (typeof input === "string") {
    const encoder = new TextEncoder();
    data = encoder.encode(input);
  } else
    data = input;
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return hashHex;
}
function randomId(length = 16, radix = 16, enhancedEntropy = false, randomCase = true) {
  if (length < 1)
    throw new RangeError("The length argument must be at least 1");
  if (radix < 2 || radix > 36)
    throw new RangeError("The radix argument must be between 2 and 36");
  let arr = [];
  const caseArr = randomCase ? [0, 1] : [0];
  if (enhancedEntropy) {
    const uintArr = new Uint8Array(length);
    crypto.getRandomValues(uintArr);
    arr = Array.from(
      uintArr,
      (v) => mapRange(v, 0, 255, 0, radix).toString(radix).substring(0, 1)
    );
  } else {
    arr = Array.from(
      { length },
      () => Math.floor(Math.random() * radix).toString(radix)
    );
  }
  if (!arr.some((v) => /[a-zA-Z]/.test(v)))
    return arr.join("");
  return arr.map((v) => caseArr[randRange(0, caseArr.length - 1, enhancedEntropy)] === 1 ? v.toUpperCase() : v).join("");
}

// lib/Errors.ts
var DatedError = class extends Error {
  date;
  constructor(message, options) {
    super(message, options);
    this.name = this.constructor.name;
    this.date = /* @__PURE__ */ new Date();
  }
};
var ChecksumMismatchError = class extends DatedError {
  constructor(message, options) {
    super(message, options);
    this.name = "ChecksumMismatchError";
  }
};
var CustomError = class extends DatedError {
  constructor(name, message, options) {
    super(message, options);
    this.name = name;
  }
};
var MigrationError = class extends DatedError {
  constructor(message, options) {
    super(message, options);
    this.name = "MigrationError";
  }
};
var ValidationError = class extends DatedError {
  constructor(message, options) {
    super(message, options);
    this.name = "ValidationError";
  }
};
var ScriptContextError = class extends DatedError {
  constructor(message, options) {
    super(message, options);
    this.name = "ScriptContextError";
  }
};
var NetworkError = class extends DatedError {
  constructor(message, options) {
    super(message, options);
    this.name = "NetworkError";
  }
};

// lib/misc.ts
async function consumeGen(valGen, ...args) {
  return await (typeof valGen === "function" ? valGen(...args) : valGen);
}
async function consumeStringGen(strGen, ...args) {
  return typeof strGen === "string" ? strGen : String(
    typeof strGen === "function" ? await strGen(...args) : strGen
  );
}
async function fetchAdvanced(input, options = {}) {
  const { timeout = 1e4, signal, ...restOpts } = options;
  const fetchOpts = { ...restOpts };
  if (signal)
    fetchOpts.signal = signal;
  let timeoutId;
  try {
    const fetchPromise = fetch(input, fetchOpts);
    if (timeout < 0)
      return await fetchPromise;
    const res = await Promise.race([
      fetchPromise,
      new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new DOMException("The operation timed out.", "TimeoutError")), timeout);
      })
    ]);
    clearTimeout(timeoutId);
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    throw new NetworkError("Error while calling fetch", { cause: err });
  }
}
function getListLength(listLike, zeroOnInvalid = true) {
  return "length" in listLike ? listLike.length : "size" in listLike ? listLike.size : "count" in listLike ? listLike.count : zeroOnInvalid ? 0 : NaN;
}
function pauseFor(time, signal, rejectOnAbort = false) {
  return new Promise((res, rej) => {
    const timeout = setTimeout(() => res(), time);
    signal == null ? void 0 : signal.addEventListener("abort", () => {
      clearTimeout(timeout);
      rejectOnAbort ? rej(new CustomError("AbortError", "The pause was aborted")) : res();
    });
  });
}
function pureObj(obj) {
  return Object.assign(/* @__PURE__ */ Object.create(null), obj ?? {});
}
function getterifyObj(obj, asCopy = false) {
  const newObj = {};
  for (const key in obj) {
    Object.defineProperty(newObj, key, {
      get: () => obj[key],
      enumerable: true,
      configurable: true
    });
  }
  return asCopy ? structuredClone(newObj) : newObj;
}
function setImmediateInterval(callback, interval, signal) {
  let intervalId;
  const cleanup = () => clearInterval(intervalId);
  const loop = () => {
    if (signal == null ? void 0 : signal.aborted)
      return cleanup();
    callback();
  };
  signal == null ? void 0 : signal.addEventListener("abort", cleanup);
  loop();
  intervalId = setInterval(loop, interval);
}
function setImmediateTimeoutLoop(callback, interval, signal) {
  let timeout;
  const cleanup = () => clearTimeout(timeout);
  const loop = async () => {
    if (signal == null ? void 0 : signal.aborted)
      return cleanup();
    await callback();
    timeout = setTimeout(loop, interval);
  };
  signal == null ? void 0 : signal.addEventListener("abort", cleanup);
  loop();
}
function scheduleExit(code = 0, timeout = 0) {
  if (timeout < 0)
    throw new TypeError("Timeout must be a non-negative number");
  let exit;
  if (typeof process !== "undefined" && "exit" in process && typeof process.exit === "function")
    exit = () => process.exit(code);
  else if (typeof Deno !== "undefined" && "exit" in Deno && typeof Deno.exit === "function")
    exit = () => Deno.exit(code);
  else
    throw new ScriptContextError("Cannot exit the process, no exit method available");
  setTimeout(exit, timeout);
}
function getCallStack(asArray, lines = Infinity) {
  if (typeof lines !== "number" || isNaN(lines) || lines < 0)
    throw new TypeError("lines parameter must be a non-negative number");
  try {
    throw new CustomError("GetCallStack", "Capturing a stack trace with CoreUtils.getCallStack(). If you see this anywhere, you can safely ignore it.");
  } catch (err) {
    const stack = (err.stack ?? "").split("\n").map((line) => line.trim()).slice(2, lines + 2);
    return asArray !== false ? stack : stack.join("\n");
  }
}
function createRecurringTask(options) {
  var _a;
  let iterations = 0;
  let aborted = false;
  (_a = options.signal) == null ? void 0 : _a.addEventListener("abort", () => {
    aborted = true;
  }, { once: true });
  const runRecurringTask = async (initial = false) => {
    var _a2;
    if (aborted)
      return;
    try {
      if ((options.immediate ?? true) || !initial) {
        iterations++;
        if (await ((_a2 = options.condition) == null ? void 0 : _a2.call(options, iterations - 1)) ?? true) {
          const val = await options.task(iterations - 1);
          if (options.onSuccess)
            await options.onSuccess(val, iterations - 1);
        }
      }
    } catch (err) {
      if (options.onError)
        await options.onError(err, iterations - 1);
      if (options.abortOnError)
        aborted = true;
      if (!options.onError && !options.abortOnError)
        throw err;
    }
    if (!aborted && (typeof options.maxIterations !== "number" || iterations < options.maxIterations))
      setTimeout(runRecurringTask, options.timeout);
  };
  return runRecurringTask(true);
}

// lib/text.ts
function autoPlural(term, num, pluralType = "auto") {
  if (typeof num !== "number") {
    if ("length" in num)
      num = num.length;
    else if ("size" in num)
      num = num.size;
    else if ("count" in num)
      num = num.count;
  }
  if (!["-s", "-ies"].includes(pluralType))
    pluralType = "auto";
  if (isNaN(num))
    num = 2;
  const pType = pluralType === "auto" ? String(term).endsWith("y") ? "-ies" : "-s" : pluralType;
  switch (pType) {
    case "-s":
      return `${term}${num === 1 ? "" : "s"}`;
    case "-ies":
      return `${String(term).slice(0, -1)}${num === 1 ? "y" : "ies"}`;
  }
}
function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
var defaultPbChars = {
  100: "\u2588",
  75: "\u2593",
  50: "\u2592",
  25: "\u2591",
  0: "\u2500"
};
function createProgressBar(percentage, barLength, chars = defaultPbChars) {
  if (percentage < 0 || percentage > 100)
    throw new RangeError(`Percentage must be between 0 and 100, got ${percentage}`);
  if (barLength < 0)
    throw new RangeError(`Bar length must be non-negative, got ${barLength}`);
  if (percentage === 100)
    return chars[100].repeat(barLength);
  const filledLength = Math.floor(percentage / 100 * barLength);
  const remainingPercentage = percentage / 100 * barLength - filledLength;
  let lastBlock = "";
  if (remainingPercentage >= 0.75)
    lastBlock = chars[75];
  else if (remainingPercentage >= 0.5)
    lastBlock = chars[50];
  else if (remainingPercentage >= 0.25)
    lastBlock = chars[25];
  const filledBar = chars[100].repeat(filledLength);
  const emptyBar = chars[0].repeat(barLength - filledLength - (lastBlock ? 1 : 0));
  return `${filledBar}${lastBlock}${emptyBar}`;
}
function insertValues(input, ...values) {
  return input.replace(/%\d/gm, (match) => {
    var _a;
    const argIndex = Number(match.substring(1)) - 1;
    return (_a = values[argIndex] ?? match) == null ? void 0 : _a.toString();
  });
}
function joinArrayReadable(array, separators = ", ", lastSeparator = " and ") {
  const arr = [...array];
  if (arr.length === 0)
    return "";
  else if (arr.length === 1)
    return String(arr[0]);
  else if (arr.length === 2)
    return arr.join(lastSeparator);
  const lastItm = lastSeparator + arr[arr.length - 1];
  arr.pop();
  return arr.join(separators) + lastItm;
}
function secsToTimeStr(seconds) {
  const isNegative = seconds < 0;
  const s = Math.abs(seconds);
  if (isNaN(s) || !isFinite(s))
    throw new TypeError("The seconds argument must be a valid number");
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor(s % 3600 / 60);
  const secs = Math.floor(s % 60);
  return (isNegative ? "-" : "") + [
    hrs ? hrs + ":" : "",
    String(mins).padStart(mins > 0 || hrs > 0 ? 2 : 1, "0"),
    ":",
    String(secs).padStart(secs > 0 || mins > 0 || hrs > 0 || seconds === 0 ? 2 : 1, "0")
  ].join("");
}
function truncStr(input, length, endStr = "...") {
  const str = (input == null ? void 0 : input.toString()) ?? String(input);
  const finalStr = str.length > length ? str.substring(0, length - endStr.length) + endStr : str;
  return finalStr.length > length ? finalStr.substring(0, length) : finalStr;
}
var defaultTableLineCharset = {
  single: {
    horizontal: "\u2500",
    vertical: "\u2502",
    topLeft: "\u250C",
    topRight: "\u2510",
    bottomLeft: "\u2514",
    bottomRight: "\u2518",
    leftT: "\u251C",
    rightT: "\u2524",
    topT: "\u252C",
    bottomT: "\u2534",
    cross: "\u253C"
  },
  double: {
    horizontal: "\u2550",
    vertical: "\u2551",
    topLeft: "\u2554",
    topRight: "\u2557",
    bottomLeft: "\u255A",
    bottomRight: "\u255D",
    leftT: "\u2560",
    rightT: "\u2563",
    topT: "\u2566",
    bottomT: "\u2569",
    cross: "\u256C"
  },
  none: {
    horizontal: " ",
    vertical: " ",
    topLeft: " ",
    topRight: " ",
    bottomLeft: " ",
    bottomRight: " ",
    leftT: " ",
    rightT: " ",
    topT: " ",
    bottomT: " ",
    cross: " "
  }
};
function createTable(rows, options) {
  var _a;
  const opts = {
    columnAlign: "left",
    truncateAbove: Infinity,
    truncEndStr: "\u2026",
    minPadding: 1,
    lineStyle: "single",
    applyCellStyle: () => void 0,
    applyLineStyle: () => void 0,
    lineCharset: defaultTableLineCharset,
    ...options ?? {}
  };
  const defRange = (val, min, max) => clamp(typeof val !== "number" || isNaN(Number(val)) ? min : val, min, max);
  opts.truncateAbove = defRange(opts.truncateAbove, 0, Infinity);
  opts.minPadding = defRange(opts.minPadding, 0, Infinity);
  const lnCh = opts.lineCharset[opts.lineStyle];
  const stripAnsi = (str) => str.replace(/\u001b\[[0-9;]*m/g, "");
  const stringRows = rows.map((row) => row.map((cell) => String(cell)));
  const colCount = ((_a = rows[0]) == null ? void 0 : _a.length) ?? 0;
  if (colCount === 0 || stringRows.length === 0)
    return "";
  if (isFinite(opts.truncateAbove)) {
    const truncAnsi = (str, maxVisible, endStr) => {
      const limit = maxVisible - endStr.length;
      if (limit <= 0)
        return endStr.slice(0, maxVisible);
      let visible = 0;
      let result = "";
      let i = 0;
      let hasAnsi = false;
      while (i < str.length) {
        if (str[i] === "\x1B" && str[i + 1] === "[") {
          const seqEnd = str.indexOf("m", i + 2);
          if (seqEnd !== -1) {
            result += str.slice(i, seqEnd + 1);
            hasAnsi = true;
            i = seqEnd + 1;
            continue;
          }
        }
        if (visible === limit) {
          result += endStr;
          if (hasAnsi)
            result += "\x1B[0m";
          return result;
        }
        result += str[i];
        visible++;
        i++;
      }
      return result;
    };
    for (const row of stringRows)
      for (let j = 0; j < row.length; j++)
        if (stripAnsi(row[j] ?? "").length > opts.truncateAbove)
          row[j] = truncAnsi(row[j] ?? "", opts.truncateAbove, opts.truncEndStr);
  }
  const colWidths = Array.from(
    { length: colCount },
    (_, j) => Math.max(0, ...stringRows.map((row) => stripAnsi(row[j] ?? "").length))
  );
  const applyLn = (i, j, ch) => {
    const [before = "", after = ""] = opts.applyLineStyle(i, j) ?? [];
    return `${before}${ch}${after}`;
  };
  const buildBorderRow = (lineIdx, leftCh, midCh, rightCh) => {
    let result = "";
    let j = 0;
    result += applyLn(lineIdx, j++, leftCh);
    for (let col = 0; col < colCount; col++) {
      const cellWidth = (colWidths[col] ?? 0) + opts.minPadding * 2;
      for (let ci = 0; ci < cellWidth; ci++)
        result += applyLn(lineIdx, j++, lnCh.horizontal);
      if (col < colCount - 1)
        result += applyLn(lineIdx, j++, midCh);
    }
    result += applyLn(lineIdx, j++, rightCh);
    return result;
  };
  const lines = [];
  for (let rowIdx = 0; rowIdx < stringRows.length; rowIdx++) {
    const row = stringRows[rowIdx] ?? [];
    const lineIdxBase = rowIdx * 3;
    if (opts.lineStyle !== "none") {
      lines.push(
        rowIdx === 0 ? buildBorderRow(lineIdxBase, lnCh.topLeft, lnCh.topT, lnCh.topRight) : buildBorderRow(lineIdxBase, lnCh.leftT, lnCh.cross, lnCh.rightT)
      );
    }
    let contentLine = "";
    let j = 0;
    contentLine += applyLn(lineIdxBase + 1, j++, lnCh.vertical);
    for (let colIdx = 0; colIdx < colCount; colIdx++) {
      const cell = row[colIdx] ?? "";
      const visLen = stripAnsi(cell).length;
      const extra = (colWidths[colIdx] ?? 0) - visLen;
      const align = (Array.isArray(opts.columnAlign) ? opts.columnAlign[colIdx] : opts.columnAlign) ?? "left";
      let leftPad;
      let rightPad;
      switch (align) {
        case "right":
          leftPad = opts.minPadding + extra;
          rightPad = opts.minPadding;
          break;
        case "centerLeft":
          leftPad = opts.minPadding + Math.floor(extra / 2);
          rightPad = opts.minPadding + Math.ceil(extra / 2);
          break;
        case "centerRight":
          leftPad = opts.minPadding + Math.ceil(extra / 2);
          rightPad = opts.minPadding + Math.floor(extra / 2);
          break;
        default:
          leftPad = opts.minPadding;
          rightPad = opts.minPadding + extra;
      }
      const [cellBefore = "", cellAfter = ""] = opts.applyCellStyle(rowIdx, colIdx) ?? [];
      contentLine += " ".repeat(leftPad) + cellBefore + cell + cellAfter + " ".repeat(rightPad);
      contentLine += applyLn(lineIdxBase + 1, j++, lnCh.vertical);
    }
    lines.push(contentLine);
    if (opts.lineStyle !== "none" && rowIdx === stringRows.length - 1)
      lines.push(buildBorderRow(lineIdxBase + 2, lnCh.bottomLeft, lnCh.bottomT, lnCh.bottomRight));
  }
  return lines.join("\n");
}

// node_modules/.pnpm/nanoevents@9.1.0/node_modules/nanoevents/index.js
var createNanoEvents = () => ({
  emit(event, ...args) {
    for (let callbacks = this.events[event] || [], i = 0, length = callbacks.length; i < length; i++) {
      callbacks[i](...args);
    }
  },
  events: {},
  on(event, cb) {
    ;
    (this.events[event] ||= []).push(cb);
    return () => {
      var _a;
      this.events[event] = (_a = this.events[event]) == null ? void 0 : _a.filter((i) => cb !== i);
    };
  }
});

// lib/PicoEmitter.ts
var PicoEmitter = class {
  /**
   * The nanoevents emitter instance used internally.  
   * ⚠️ You should use the protected method `emitEvent()` instead of emitting directly through this, as it updates the catch-up memory for any events listed in `catchUpEvents`. Only use `this.events.emit()` if you're not using `catchUpEvents` or are doing manual memory management.
   */
  events = createNanoEvents();
  eventUnsubscribes = [];
  emitterOptions;
  /** Stores the latest arguments for each emitted event that's listed in `catchUpEvents`. */
  catchUpMemory = /* @__PURE__ */ new Map();
  /**
   * ⚠️ You cannot instantiate `PicoEmitter` directly, it's only meant for extending in your own classes. If you want a standalone emitter, use `NanoEmitter` instead.
   */
  constructor(options = {}) {
    this.emitterOptions = {
      ...options
    };
  }
  //#region emitEvent
  /**
   * Emits an event on this instance.  
   * You should use this over `this.events.emit()` in subclasses as it updates the catch-up memory for any event listed in `catchUpEvents`, so that listeners attached after emitting can still receive the latest value.
   */
  emitEvent(event, ...args) {
    var _a;
    if ((_a = this.emitterOptions.catchUpEvents) == null ? void 0 : _a.includes(event))
      this.catchUpMemory.set(event, args);
    this.events.emit(event, ...args);
  }
  //#region on
  /**
   * Subscribes to an event and calls the callback when it's emitted.  
   * If the event has already been emitted and is listed in `catchUpEvents`, the callback will be called immediately with the latest emitted arguments (catch-up behaviour).
   * @param event The event to subscribe to. Use `as "_"` in case your event names aren't thoroughly typed (like when using a template literal, e.g. \`event-${val}\` as "_")
   * @returns Returns a function that can be called to unsubscribe the event listener
   * @example ```ts
   * const emitter = new PicoEmitter<{
   *   foo: (bar: string) => void;
   * }>({
   *   publicEmit: true,
   * });
   * 
   * let i = 0;
   * const unsub = emitter.on("foo", (bar) => {
   *   // unsubscribe after 10 events:
   *   if(++i === 10) unsub();
   *   console.log(bar);
   * });
   * 
   * emitter.emit("foo", "bar");
   * ```
   */
  on(event, cb) {
    let unsub;
    const unsubProxy = () => {
      if (!unsub)
        return;
      unsub();
      this.eventUnsubscribes = this.eventUnsubscribes.filter((u) => u !== unsub);
    };
    unsub = this.events.on(event, cb);
    this.eventUnsubscribes.push(unsub);
    const memory = this.catchUpMemory.get(event);
    if (memory)
      cb(...memory);
    return unsubProxy;
  }
  //#region once
  /**
   * Subscribes to an event and calls the callback or resolves the Promise only once when it's emitted.  
   * If the event has already been emitted and is listed in `catchUpEvents`, the callback will be called immediately with the latest emitted arguments (catch-up behaviour).
   * @param event The event to subscribe to. Use `as "_"` in case your event names aren't thoroughly typed (like when using a template literal, e.g. \`event-${val}\` as "_")
   * @param cb The callback to call when the event is emitted - if provided or not, the returned Promise will resolve with the event arguments
   * @returns Returns a Promise that resolves with the event arguments when the event is emitted
   * @example ```ts
   * const emitter = new PicoEmitter<{
   *   foo: (bar: string) => void;
   * }>();
   * 
   * // Promise syntax:
   * const [bar] = await emitter.once("foo");
   * console.log(bar);
   * 
   * // Callback syntax:
   * emitter.once("foo", (bar) => console.log(bar));
   * ```
   */
  once(event, cb) {
    const memory = this.catchUpMemory.get(event);
    if (memory) {
      const args = memory;
      cb == null ? void 0 : cb(...args);
      return Promise.resolve(args);
    }
    return new Promise((resolve) => {
      let unsub;
      const onceProxy = ((...args) => {
        cb == null ? void 0 : cb(...args);
        unsub == null ? void 0 : unsub();
        resolve(args);
      });
      unsub = this.events.on(event, onceProxy);
      this.eventUnsubscribes.push(unsub);
    });
  }
  //#region onMulti
  /**
   * Allows subscribing to multiple events and calling the callback only when one of, all of, or a subset of the events are emitted, either continuously or only once.  
   * If any of the events have already been emitted and are listed in `catchUpEvents`, the callback will be called immediately if the criteria are met, with the latest emitted arguments (catch-up behaviour).
   * @param options An object or array of objects with the following properties:  
   * `callback` (required) is the function that will be called when the conditions are met.  
   *   
   * Set `once` to true to call the callback only once for the first event (or set of events) that match the criteria, then stop listening.  
   * If `signal` is provided, the subscription will be canceled when the given signal is aborted.  
   *   
   * If `oneOf` is used, the callback will be called when any of the matching events are emitted.  
   * If `allOf` is used, the callback will be called after all of the matching events are emitted at least once, then any time any of them are emitted.  
   * If both `oneOf` and `allOf` are used together, the callback will be called when any of the `oneOf` events are emitted AND all of the `allOf` events have been emitted at least once.  
   * At least one of `oneOf` or `allOf` must be provided.  
   *   
   * @returns Returns a function that can be called to unsubscribe all listeners created by this call. Alternatively, pass an `AbortSignal` to all options objects to achieve the same effect or for finer control.
   */
  onMulti(options) {
    const allUnsubs = [];
    const unsubAll = () => {
      for (const unsub of allUnsubs)
        unsub();
      allUnsubs.splice(0, allUnsubs.length);
      this.eventUnsubscribes = this.eventUnsubscribes.filter((u) => !allUnsubs.includes(u));
    };
    for (const opts of Array.isArray(options) ? options : [options]) {
      const optsWithDefaults = {
        allOf: [],
        oneOf: [],
        once: false,
        ...opts
      };
      const {
        oneOf,
        allOf,
        once,
        signal,
        callback
      } = optsWithDefaults;
      if (signal == null ? void 0 : signal.aborted)
        return unsubAll;
      if (oneOf.length === 0 && allOf.length === 0)
        throw new TypeError("PicoEmitter.onMulti(): Either `oneOf` or `allOf` or both must be provided in the options");
      const curEvtUnsubs = [];
      const checkUnsubAllEvt = (force = false) => {
        if (!(signal == null ? void 0 : signal.aborted) && !force)
          return;
        for (const unsub of curEvtUnsubs)
          unsub();
        curEvtUnsubs.splice(0, curEvtUnsubs.length);
        this.eventUnsubscribes = this.eventUnsubscribes.filter((u) => !curEvtUnsubs.includes(u));
      };
      const allOfEmitted = /* @__PURE__ */ new Set();
      const allOfConditionMet = () => allOf.length === 0 || allOfEmitted.size === allOf.length;
      for (const event of oneOf) {
        const unsub = this.events.on(event, ((...args) => {
          checkUnsubAllEvt();
          if (allOfConditionMet()) {
            callback(event, ...args);
            if (once)
              checkUnsubAllEvt(true);
          }
        }));
        curEvtUnsubs.push(unsub);
      }
      for (const event of allOf) {
        const unsub = this.events.on(event, ((...args) => {
          checkUnsubAllEvt();
          allOfEmitted.add(event);
          if (allOfConditionMet() && (oneOf.length === 0 || oneOf.includes(event))) {
            callback(event, ...args);
            if (once)
              checkUnsubAllEvt(true);
          }
        }));
        curEvtUnsubs.push(unsub);
      }
      allUnsubs.push(() => checkUnsubAllEvt(true));
    }
    return unsubAll;
  }
  //#region unsubscribeAll
  /** Unsubscribes all event listeners from this instance. Also clears the event catch-up memory. */
  unsubscribeAll() {
    for (const unsub of this.eventUnsubscribes)
      unsub();
    this.eventUnsubscribes = [];
    this.catchUpMemory.clear();
  }
};

// lib/NanoEmitter.ts
var NanoEmitter = class extends PicoEmitter {
  events = createNanoEvents();
  eventUnsubscribes = [];
  emitterOptions;
  /** Stores the last arguments for each event listed in `catchUpEvents` */
  catchUpMemory = /* @__PURE__ */ new Map();
  /** Creates a new instance of NanoEmitter - a lightweight event emitter with helper methods and a strongly typed event map */
  constructor(options = {}) {
    super(options);
    this.emitterOptions = {
      publicEmit: false,
      ...options
    };
  }
  //#region emit
  /**
   * Emits an event on this instance.  
   * - ⚠️ Needs `publicEmit` to be set to true in the NanoEmitter constructor or super() call!
   * @param event The event to emit
   * @param args The arguments to pass to the event listeners
   * @returns Returns true if `publicEmit` is true and the event was emitted successfully
   */
  emit(event, ...args) {
    if (this.emitterOptions.publicEmit) {
      this.emitEvent(event, ...args);
      return true;
    }
    return false;
  }
  //#region unsubscribeAll
  /** Unsubscribes all event listeners from this instance. Also clears the event catch-up memory. */
  unsubscribeAll() {
    super.unsubscribeAll();
  }
};

// lib/DataStore.ts
var dsFmtVer = 1;
var DataStore = class extends NanoEmitter {
  id;
  formatVersion;
  defaultData;
  encodeData;
  decodeData;
  compressionFormat = "deflate-raw";
  memoryCache;
  engine;
  keyPrefix;
  options;
  /**
   * Whether all first-init checks should be done.  
   * This includes migrating the internal DataStore format, migrating data from the UserUtils format, and anything similar.  
   * This is set to `true` by default. Create a subclass and set it to `false` before calling {@linkcode loadData()} if you want to explicitly skip these checks.
   */
  firstInit = true;
  /** In-memory cached copy of the data that is saved in persistent storage used for synchronous read access. */
  cachedData;
  migrations;
  migrateIds = [];
  //#region constructor
  /**
   * Creates an instance of DataStore to manage a sync & async database that is cached in memory and persistently saved across sessions.  
   * Supports migrating data from older versions to newer ones and populating the cache with default data if no persistent data is found.  
   *   
   * - ⚠️ Make sure to call {@linkcode loadData()} at least once after creating an instance, or the returned data will be the same as `options.defaultData`
   * 
   * @template TData The type of the data that is saved in persistent storage for the currently set format version (will be automatically inferred from `defaultData` if not provided) - **This has to be a JSON-compatible object!** (no undefined, circular references, etc.)
   * @param opts The options for this DataStore instance
   */
  constructor(opts) {
    super(opts.nanoEmitterOptions);
    this.id = opts.id;
    this.formatVersion = opts.formatVersion;
    this.defaultData = opts.defaultData;
    this.memoryCache = opts.memoryCache ?? true;
    this.cachedData = this.memoryCache ? opts.defaultData : {};
    this.migrations = opts.migrations;
    if (opts.migrateIds)
      this.migrateIds = Array.isArray(opts.migrateIds) ? opts.migrateIds : [opts.migrateIds];
    this.engine = typeof opts.engine === "function" ? opts.engine() : opts.engine;
    this.keyPrefix = opts.keyPrefix ?? "__ds-";
    this.options = opts;
    if ("encodeData" in opts && "decodeData" in opts && Array.isArray(opts.encodeData) && Array.isArray(opts.decodeData)) {
      this.encodeData = [opts.encodeData[0], opts.encodeData[1]];
      this.decodeData = [opts.decodeData[0], opts.decodeData[1]];
      this.compressionFormat = opts.encodeData[0] ?? null;
    } else if (opts.compressionFormat === null) {
      this.encodeData = void 0;
      this.decodeData = void 0;
      this.compressionFormat = null;
    } else {
      const fmt = typeof opts.compressionFormat === "string" ? opts.compressionFormat : "deflate-raw";
      this.compressionFormat = fmt;
      this.encodeData = [fmt, async (data) => await compress(data, fmt, "string")];
      this.decodeData = [fmt, async (data) => await decompress(data, fmt, "string")];
    }
    this.engine.setDataStoreOptions({
      id: this.id,
      encodeData: this.encodeData,
      decodeData: this.decodeData
    });
  }
  //#region loadData
  /**
   * Loads the data saved in persistent storage into the in-memory cache and also returns a copy of it.  
   * Automatically populates persistent storage with default data if it doesn't contain any data yet.  
   * Also runs all necessary migration functions if the data format has changed since the last time the data was saved.
   */
  async loadData() {
    try {
      if (this.firstInit) {
        this.firstInit = false;
        const dsVer = Number(await this.engine.getValue("__ds_fmt_ver", 0));
        const oldData = await this.engine.getValue(`_uucfg-${this.id}`, null);
        if (oldData) {
          const oldVer = Number(await this.engine.getValue(`_uucfgver-${this.id}`, NaN));
          const oldEnc = await this.engine.getValue(`_uucfgenc-${this.id}`, null);
          const promises = [];
          const migrateFmt = (oldKey, newKey, value) => {
            promises.push(this.engine.setValue(newKey, value));
            promises.push(this.engine.deleteValue(oldKey));
          };
          migrateFmt(`_uucfg-${this.id}`, `${this.keyPrefix}${this.id}-dat`, oldData);
          if (!isNaN(oldVer))
            migrateFmt(`_uucfgver-${this.id}`, `${this.keyPrefix}${this.id}-ver`, oldVer);
          if (typeof oldEnc === "boolean" || oldEnc === "true" || oldEnc === "false" || typeof oldEnc === "number" || oldEnc === "0" || oldEnc === "1")
            migrateFmt(`_uucfgenc-${this.id}`, `${this.keyPrefix}${this.id}-enf`, [0, "0", true, "true"].includes(oldEnc) ? this.compressionFormat ?? null : null);
          else {
            promises.push(this.engine.setValue(`${this.keyPrefix}${this.id}-enf`, this.compressionFormat));
            promises.push(this.engine.deleteValue(`_uucfgenc-${this.id}`));
          }
          await Promise.allSettled(promises);
        }
        if (isNaN(dsVer) || dsVer < dsFmtVer)
          await this.engine.setValue("__ds_fmt_ver", dsFmtVer);
      }
      if (this.migrateIds.length > 0) {
        await this.migrateId(this.migrateIds);
        this.migrateIds = [];
      }
      const storedDataRaw = await this.engine.getValue(`${this.keyPrefix}${this.id}-dat`, null);
      const storedFmtVer = Number(await this.engine.getValue(`${this.keyPrefix}${this.id}-ver`, NaN));
      if (typeof storedDataRaw !== "string" && typeof storedDataRaw !== "object" || storedDataRaw === null || isNaN(storedFmtVer)) {
        await this.saveDefaultData(false);
        const data = this.engine.deepCopy(this.defaultData);
        this.emitEvent("loadData", data);
        return data;
      }
      const storedData = storedDataRaw ?? JSON.stringify(this.defaultData);
      const encodingFmt = String(await this.engine.getValue(`${this.keyPrefix}${this.id}-enf`, null));
      const isEncoded = encodingFmt !== "null" && encodingFmt !== "false" && encodingFmt !== "0" && encodingFmt !== "" && encodingFmt !== null;
      let parsed = typeof storedData === "string" ? await this.engine.deserializeData(storedData, isEncoded) : storedData;
      if (storedFmtVer < this.formatVersion && this.migrations)
        parsed = await this.runMigrations(parsed, storedFmtVer);
      const result = this.memoryCache ? this.cachedData = this.engine.deepCopy(parsed) : this.engine.deepCopy(parsed);
      this.emitEvent("loadData", result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.warn("Error while parsing JSON data, resetting it to the default value.", err);
      this.emitEvent("error", error);
      await this.saveDefaultData();
      return this.defaultData;
    }
  }
  //#region getData
  /**
   * Returns a copy of the data from the in-memory cache.  
   * Use {@linkcode loadData()} to get fresh data from persistent storage (usually not necessary since the cache should always exactly reflect persistent storage).  
   * ⚠️ Only available when `memoryCache` is `true` (default). When set to `false`, this produces a type and runtime error - use {@linkcode loadData()} instead.
   */
  getData() {
    if (!this.memoryCache)
      throw new DatedError("In-memory cache is disabled for this DataStore instance, so getData() can't be used. Please use loadData() instead.");
    return this.engine.deepCopy(this.cachedData);
  }
  //#region setData
  /** Saves the data synchronously to the in-memory cache and asynchronously to the persistent storage */
  setData(data) {
    const dataCopy = this.engine.deepCopy(data);
    if (this.memoryCache) {
      this.cachedData = data;
      this.emitEvent("updateDataSync", dataCopy);
    }
    return new Promise(async (resolve) => {
      const results = await Promise.allSettled([
        this.engine.setValue(`${this.keyPrefix}${this.id}-dat`, await this.engine.serializeData(data, this.encodingEnabled())),
        this.engine.setValue(`${this.keyPrefix}${this.id}-ver`, this.formatVersion),
        this.engine.setValue(`${this.keyPrefix}${this.id}-enf`, this.compressionFormat)
      ]);
      if (results.every((r) => r.status === "fulfilled"))
        this.emitEvent("updateData", dataCopy);
      else {
        const error = new Error("Error while saving data to persistent storage: " + results.map((r) => r.status === "rejected" ? r.reason : null).filter(Boolean).join("; "));
        console.error(error);
        this.emitEvent("error", error);
      }
      resolve();
    });
  }
  //#region saveDefaultData
  /**
   * Saves the default data passed in the constructor synchronously to the in-memory cache and asynchronously to persistent storage.
   * @param emitEvent Whether to emit the `setDefaultData` event - set to `false` to prevent event emission (used internally during initial population in {@linkcode loadData()})
   */
  async saveDefaultData(emitEvent = true) {
    if (this.memoryCache)
      this.cachedData = this.defaultData;
    const results = await Promise.allSettled([
      this.engine.setValue(`${this.keyPrefix}${this.id}-dat`, await this.engine.serializeData(this.defaultData, this.encodingEnabled())),
      this.engine.setValue(`${this.keyPrefix}${this.id}-ver`, this.formatVersion),
      this.engine.setValue(`${this.keyPrefix}${this.id}-enf`, this.compressionFormat)
    ]);
    if (results.every((r) => r.status === "fulfilled"))
      emitEvent && this.emitEvent("setDefaultData", this.defaultData);
    else {
      const error = new Error("Error while saving default data to persistent storage: " + results.map((r) => r.status === "rejected" ? r.reason : null).filter(Boolean).join("; "));
      console.error(error);
      this.emitEvent("error", error);
    }
  }
  //#region deleteData
  /**
   * Call this method to clear all persistently stored data associated with this DataStore instance, including the storage container (if supported by the DataStoreEngine).  
   * The in-memory cache will be left untouched, so you may still access the data with {@linkcode getData()}  
   * Calling {@linkcode loadData()} or {@linkcode setData()} after this method was called will recreate persistent storage with the cached or default data.
   */
  async deleteData() {
    var _a, _b;
    await Promise.allSettled([
      this.engine.deleteValue(`${this.keyPrefix}${this.id}-dat`),
      this.engine.deleteValue(`${this.keyPrefix}${this.id}-ver`),
      this.engine.deleteValue(`${this.keyPrefix}${this.id}-enf`)
    ]);
    await ((_b = (_a = this.engine).deleteStorage) == null ? void 0 : _b.call(_a));
    this.emitEvent("deleteData");
  }
  //#region encodingEnabled
  /** Returns whether encoding and decoding are enabled for this DataStore instance */
  encodingEnabled() {
    return Boolean(this.encodeData && this.decodeData) && this.compressionFormat !== null || Boolean(this.compressionFormat);
  }
  //#region runMigrations
  /**
   * Runs all necessary migration functions consecutively and saves the result to the in-memory cache and persistent storage and also returns it.  
   * This method is automatically called by {@linkcode loadData()} if the data format has changed since the last time the data was saved.  
   * Though calling this method manually is not necessary, it can be useful if you want to run migrations for special occasions like a user importing potentially outdated data that has been previously exported.  
   *   
   * If one of the migrations fails, the data will be reset to the default value if `resetOnError` is set to `true` (default). Otherwise, an error will be thrown and no data will be saved.
   */
  async runMigrations(oldData, oldFmtVer, resetOnError = true) {
    if (!this.migrations)
      return oldData;
    let newData = oldData;
    const sortedMigrations = Object.entries(this.migrations).sort(([a], [b]) => Number(a) - Number(b));
    let lastFmtVer = oldFmtVer;
    for (let i = 0; i < sortedMigrations.length; i++) {
      const [fmtVer, migrationFunc] = sortedMigrations[i];
      const ver = Number(fmtVer);
      if (oldFmtVer < this.formatVersion && oldFmtVer < ver) {
        try {
          const migRes = migrationFunc(newData);
          newData = migRes instanceof Promise ? await migRes : migRes;
          lastFmtVer = oldFmtVer = ver;
          const isFinal = ver >= this.formatVersion || i === sortedMigrations.length - 1;
          this.emitEvent("migrateData", ver, newData, isFinal);
        } catch (err) {
          const migError = new MigrationError(`Error while running migration function for format version '${fmtVer}'`, { cause: err });
          this.emitEvent("migrationError", ver, migError);
          this.emitEvent("error", migError);
          if (!resetOnError)
            throw migError;
          await this.saveDefaultData();
          return this.engine.deepCopy(this.defaultData);
        }
      }
    }
    await Promise.allSettled([
      this.engine.setValue(`${this.keyPrefix}${this.id}-dat`, await this.engine.serializeData(newData, this.encodingEnabled())),
      this.engine.setValue(`${this.keyPrefix}${this.id}-ver`, lastFmtVer),
      this.engine.setValue(`${this.keyPrefix}${this.id}-enf`, this.compressionFormat)
    ]);
    const result = this.memoryCache ? this.cachedData = this.engine.deepCopy(newData) : this.engine.deepCopy(newData);
    this.emitEvent("updateData", result);
    return result;
  }
  //#region migrateId
  /**
   * Tries to migrate the currently saved persistent data from one or more old IDs to the ID set in the constructor.  
   * If no data exist for the old ID(s), nothing will be done, but some time may still pass trying to fetch the non-existent data.
   */
  async migrateId(oldIds) {
    const ids = Array.isArray(oldIds) ? oldIds : [oldIds];
    await Promise.all(ids.map(async (id) => {
      const [data, fmtVer, isEncoded] = await (async () => {
        const [d, f, e] = await Promise.all([
          this.engine.getValue(`${this.keyPrefix}${id}-dat`, JSON.stringify(this.defaultData)),
          this.engine.getValue(`${this.keyPrefix}${id}-ver`, NaN),
          this.engine.getValue(`${this.keyPrefix}${id}-enf`, null)
        ]);
        return [d, Number(f), Boolean(e) && String(e) !== "null"];
      })();
      if (data === void 0 || isNaN(fmtVer))
        return;
      const parsed = await this.engine.deserializeData(data, isEncoded);
      await Promise.allSettled([
        this.engine.setValue(`${this.keyPrefix}${this.id}-dat`, await this.engine.serializeData(parsed, this.encodingEnabled())),
        this.engine.setValue(`${this.keyPrefix}${this.id}-ver`, fmtVer),
        this.engine.setValue(`${this.keyPrefix}${this.id}-enf`, this.compressionFormat),
        this.engine.deleteValue(`${this.keyPrefix}${id}-dat`),
        this.engine.deleteValue(`${this.keyPrefix}${id}-ver`),
        this.engine.deleteValue(`${this.keyPrefix}${id}-enf`)
      ]);
      this.emitEvent("migrateId", id, this.id);
    }));
  }
};

// lib/DataStoreEngine.ts
var DataStoreEngine = class {
  dataStoreOptions;
  // setDataStoreOptions() is called from inside the DataStore constructor to set this value
  constructor(options) {
    if (options)
      this.dataStoreOptions = options;
  }
  /** Called by DataStore on creation, to pass its options. Only call this if you are using this instance standalone! */
  setDataStoreOptions(dataStoreOptions) {
    this.dataStoreOptions = dataStoreOptions;
  }
  //#region serialization api
  /** Serializes the given object to a string, optionally encoded with `options.encodeData` if {@linkcode useEncoding} is not set to false and the `encodeData` and `decodeData` options are set */
  async serializeData(data, useEncoding) {
    var _a, _b, _c, _d, _e;
    this.ensureDataStoreOptions();
    const stringData = JSON.stringify(data);
    if (!useEncoding || !((_a = this.dataStoreOptions) == null ? void 0 : _a.encodeData) || !((_b = this.dataStoreOptions) == null ? void 0 : _b.decodeData))
      return stringData;
    const encRes = (_e = (_d = (_c = this.dataStoreOptions) == null ? void 0 : _c.encodeData) == null ? void 0 : _d[1]) == null ? void 0 : _e.call(_d, stringData);
    if (encRes instanceof Promise)
      return await encRes;
    return encRes;
  }
  /** Deserializes the given string to a JSON object, optionally decoded with `options.decodeData` if {@linkcode useEncoding} is set to true */
  async deserializeData(data, useEncoding) {
    var _a, _b, _c;
    this.ensureDataStoreOptions();
    let decRes = ((_a = this.dataStoreOptions) == null ? void 0 : _a.decodeData) && useEncoding ? (_c = (_b = this.dataStoreOptions.decodeData) == null ? void 0 : _b[1]) == null ? void 0 : _c.call(_b, data) : void 0;
    if (decRes instanceof Promise)
      decRes = await decRes;
    return JSON.parse(decRes ?? data);
  }
  //#region misc api
  /** Throws an error if the {@linkcode DataStoreOptions} are not set or invalid. Call in every method where {@linkcode DataStoreEngineDSOptions} needs to be present. */
  ensureDataStoreOptions() {
    if (!this.dataStoreOptions)
      throw new DatedError("DataStoreEngine must be initialized with DataStore options before use. If you are using this instance standalone, set them in the constructor or call `setDataStoreOptions()` with the DataStore options.");
    if (!this.dataStoreOptions.id)
      throw new DatedError("DataStoreEngine must be initialized with a valid DataStore ID");
  }
  /**
   * Copies a JSON-compatible object and loses all its internal references in the process.  
   * Uses [`structuredClone()`](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone) if available, otherwise falls back to `JSON.parse(JSON.stringify(obj))`.
   */
  deepCopy(obj) {
    try {
      if ("structuredClone" in globalThis)
        return structuredClone(obj);
    } catch {
    }
    return JSON.parse(JSON.stringify(obj));
  }
};

// lib/engines/BrowserStorageEngine.ts
var BrowserStorageEngine = class extends DataStoreEngine {
  options;
  /**
   * Creates an instance of `BrowserStorageEngine`.  
   *   
   * - ⚠️ Requires a DOM environment  
   * - ⚠️ Don't reuse engine instances, always create a new one for each {@linkcode DataStore} instance
   */
  constructor(options) {
    super(options == null ? void 0 : options.dataStoreOptions);
    this.options = {
      type: "localStorage",
      ...options
    };
  }
  //#region storage api
  /** Fetches a value from persistent storage */
  async getValue(name, defaultValue) {
    const val = this.options.type === "localStorage" ? globalThis.localStorage.getItem(name) : globalThis.sessionStorage.getItem(name);
    return typeof val === "undefined" ? defaultValue : val;
  }
  /** Sets a value in persistent storage */
  async setValue(name, value) {
    if (this.options.type === "localStorage")
      globalThis.localStorage.setItem(name, String(value));
    else
      globalThis.sessionStorage.setItem(name, String(value));
  }
  /** Deletes a value from persistent storage */
  async deleteValue(name) {
    if (this.options.type === "localStorage")
      globalThis.localStorage.removeItem(name);
    else
      globalThis.sessionStorage.removeItem(name);
  }
};

// lib/engines/FileStorageEngine.ts
var fs;
var FileStorageEngine = class extends DataStoreEngine {
  options;
  fileAccessQueue = Promise.resolve();
  /**
   * Creates an instance of `FileStorageEngine`.  
   *   
   * - ⚠️ Requires Node.js or Deno with Node compatibility (v1.31+)  
   * - ⚠️ Don't reuse engine instances, always create a new one for each {@linkcode DataStore} instance
   */
  constructor(options) {
    super(options == null ? void 0 : options.dataStoreOptions);
    this.options = {
      filePath: (id) => `.ds-${id}`,
      ...options
    };
  }
  //#region json file
  /** Reads the file contents */
  async readFile() {
    var _a, _b, _c, _d;
    this.ensureDataStoreOptions();
    try {
      if (!fs)
        fs = (_a = await import("fs/promises")) == null ? void 0 : _a.default;
      if (!fs)
        throw new ScriptContextError("FileStorageEngine requires Node.js or Deno with Node compatibility (v1.31+)", { cause: new DatedError("'node:fs/promises' module not available") });
      const path = typeof this.options.filePath === "string" ? this.options.filePath : this.options.filePath(this.dataStoreOptions.id, this.dataStoreOptions);
      const data = await fs.readFile(path, "utf-8");
      return data ? JSON.parse(await ((_d = (_c = (_b = this.dataStoreOptions) == null ? void 0 : _b.decodeData) == null ? void 0 : _c[1]) == null ? void 0 : _d.call(_c, data)) ?? data) : void 0;
    } catch {
      return void 0;
    }
  }
  /** Overwrites the file contents */
  async writeFile(data) {
    var _a, _b, _c, _d;
    this.ensureDataStoreOptions();
    try {
      if (!fs)
        fs = (_a = await import("fs/promises")) == null ? void 0 : _a.default;
      if (!fs)
        throw new ScriptContextError("FileStorageEngine requires Node.js or Deno with Node compatibility (v1.31+)", { cause: new DatedError("'node:fs/promises' module not available") });
      const path = typeof this.options.filePath === "string" ? this.options.filePath : this.options.filePath(this.dataStoreOptions.id, this.dataStoreOptions);
      await fs.mkdir(path.slice(0, path.lastIndexOf(path.includes("/") ? "/" : "\\")), { recursive: true });
      await fs.writeFile(path, await ((_d = (_c = (_b = this.dataStoreOptions) == null ? void 0 : _b.encodeData) == null ? void 0 : _c[1]) == null ? void 0 : _d.call(_c, JSON.stringify(data))) ?? JSON.stringify(data, void 0, 2), "utf-8");
    } catch (err) {
      console.error("Error writing file:", err);
    }
  }
  //#region storage api
  /** Fetches a value from persistent storage */
  async getValue(name, defaultValue) {
    const data = await this.readFile();
    if (!data)
      return defaultValue;
    const value = data == null ? void 0 : data[name];
    if (typeof value === "undefined")
      return defaultValue;
    if (typeof defaultValue === "string") {
      if (typeof value === "object" && value !== null)
        return JSON.stringify(value);
      if (typeof value === "string")
        return value;
      return String(value);
    }
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return parsed;
      } catch {
        return defaultValue;
      }
    }
    return value;
  }
  /** Sets a value in persistent storage */
  async setValue(name, value) {
    this.fileAccessQueue = this.fileAccessQueue.then(async () => {
      let data = await this.readFile();
      if (!data)
        data = {};
      let storeVal = value;
      if (typeof value === "string") {
        try {
          if (value.startsWith("{") || value.startsWith("[")) {
            const parsed = JSON.parse(value);
            if (typeof parsed === "object" && parsed !== null)
              storeVal = parsed;
          }
        } catch {
        }
      }
      data[name] = storeVal;
      await this.writeFile(data);
    }).catch((err) => {
      console.error("Error in setValue:", err);
      throw err;
    });
    await this.fileAccessQueue.catch(() => {
    });
  }
  /** Deletes a value from persistent storage */
  async deleteValue(name) {
    this.fileAccessQueue = this.fileAccessQueue.then(async () => {
      const data = await this.readFile();
      if (!data)
        return;
      delete data[name];
      await this.writeFile(data);
    }).catch((err) => {
      console.error("Error in deleteValue:", err);
      throw err;
    });
    await this.fileAccessQueue.catch(() => {
    });
  }
  /** Deletes the file that contains the data of this DataStore. */
  async deleteStorage() {
    var _a;
    this.ensureDataStoreOptions();
    try {
      if (!fs)
        fs = (_a = await import("fs/promises")) == null ? void 0 : _a.default;
      if (!fs)
        throw new ScriptContextError("FileStorageEngine requires Node.js or Deno with Node compatibility (v1.31+)", { cause: new DatedError("'node:fs/promises' module not available") });
      const path = typeof this.options.filePath === "string" ? this.options.filePath : this.options.filePath(this.dataStoreOptions.id, this.dataStoreOptions);
      return await fs.unlink(path);
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  }
};

// lib/engines/IndexedDBStorageEngine.ts
var IndexedDBStorageEngine = class _IndexedDBStorageEngine extends DataStoreEngine {
  options;
  /** Name of the IndexedDB object store that holds the key-value pairs */
  static storeName = "keyval";
  /** Cached handle to the opened database, populated lazily on the first call to {@linkcode getValue}, {@linkcode setValue} or {@linkcode deleteValue} */
  db;
  /** Resolves once the database has finished opening, so concurrent calls don't open it more than once */
  dbOpenPromise;
  /**
   * Creates an instance of `IndexedDBStorageEngine`, a {@linkcode DataStore} storage engine that uses the [IndexedDB API.](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)  
   * This allows even non-JSON-serializable data to be stored, like a [File](https://developer.mozilla.org/en-US/docs/Web/API/File) or [Blob.](https://developer.mozilla.org/en-US/docs/Web/API/Blob)  
   *   
   * - ⚠️ Requires a DOM environment with access to the [IndexedDB API.](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)  
   * - ⚠️ Don't reuse engine instances, always create a new one for each {@linkcode DataStore} instance.
   */
  constructor(options) {
    super(options == null ? void 0 : options.dataStoreOptions);
    this.options = {
      ...options
    };
  }
  //#region storage api
  /** Fetches a value from persistent storage. */
  async getValue(name, defaultValue) {
    const db = await this.openDb();
    const val = await new Promise((resolve, reject) => {
      const req = db.transaction(_IndexedDBStorageEngine.storeName, "readonly").objectStore(_IndexedDBStorageEngine.storeName).get(name);
      req.addEventListener("success", () => resolve(req.result));
      req.addEventListener("error", () => reject(req.error));
    });
    return typeof val === "undefined" ? defaultValue : val;
  }
  /** Sets a value in persistent storage. */
  async setValue(name, value) {
    const db = await this.openDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(_IndexedDBStorageEngine.storeName, "readwrite");
      tx.objectStore(_IndexedDBStorageEngine.storeName).put(value, name);
      tx.addEventListener("complete", () => resolve());
      tx.addEventListener("error", () => reject(tx.error));
      tx.addEventListener("abort", () => reject(tx.error));
    });
  }
  /** Deletes a value from persistent storage. */
  async deleteValue(name) {
    const db = await this.openDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(_IndexedDBStorageEngine.storeName, "readwrite");
      tx.objectStore(_IndexedDBStorageEngine.storeName).delete(name);
      tx.addEventListener("complete", () => resolve());
      tx.addEventListener("error", () => reject(tx.error));
      tx.addEventListener("abort", () => reject(tx.error));
    });
  }
  //#region indexeddb
  /** Lazily opens the {@linkcode IDBDatabase} for this DataStore's ID, or returns the cached instance from a previous call. */
  openDb() {
    this.ensureDataStoreOptions();
    if (this.db)
      return Promise.resolve(this.db);
    if (this.dbOpenPromise)
      return this.dbOpenPromise;
    if (typeof indexedDB === "undefined")
      throw new ScriptContextError("IndexedDBStorageEngine requires a DOM environment with access to the IndexedDB API", { cause: new DatedError("'indexedDB' is not available in the global scope") });
    return this.dbOpenPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(`${this.options.dbPrefix ?? "__ds-"}${this.dataStoreOptions.id}`);
      req.addEventListener("upgradeneeded", () => {
        req.result.createObjectStore(_IndexedDBStorageEngine.storeName);
      });
      req.addEventListener("success", () => {
        this.db = req.result;
        resolve(req.result);
      });
      req.addEventListener("error", () => reject(req.error));
    });
  }
};

// lib/DataStoreSerializer.ts
var DataStoreSerializer = class _DataStoreSerializer {
  stores;
  // eslint-disable-line @typescript-eslint/no-explicit-any
  options;
  constructor(stores, options = {}) {
    if (!crypto || !crypto.subtle)
      throw new ScriptContextError("DataStoreSerializer has to run in a secure context (HTTPS) or in another environment that implements the subtleCrypto API!");
    this.stores = stores;
    this.options = {
      addChecksum: true,
      ensureIntegrity: true,
      remapIds: {},
      stringifyData: true,
      ...options
    };
  }
  /**
   * Calculates the checksum of a string or {@linkcode DataStoreData} object. Uses {@linkcode computeHash()} with SHA-256 and digests as a hex string by default.  
   * Override this in a subclass if a custom checksum method is needed.
   */
  async calcChecksum(input) {
    try {
      return computeHash(typeof input === "string" ? input : JSON.stringify(input), "SHA-256");
    } catch (err) {
      throw new Error(`Failed to calculate checksum: ${err.message}`, { cause: err });
    }
  }
  /**
   * Serializes only a subset of the data stores into a string.  
   * @param stores An array of store IDs or functions that take a store ID and return a boolean
   * @param useEncoding Whether to encode the data using each DataStore's `encodeData()` method
   * @param stringified Whether to return the result as a string or as an array of `SerializedDataStore` objects
   */
  async serializePartial(stores, useEncoding = true, stringified = true) {
    var _a;
    const serData = [];
    const filteredStores = this.stores.filter((s) => typeof stores === "function" ? stores(s.id) : stores.includes(s.id));
    for (const storeInst of filteredStores) {
      const encoded = Boolean(useEncoding && storeInst.encodingEnabled() && ((_a = storeInst.encodeData) == null ? void 0 : _a[1]));
      const rawData = storeInst.memoryCache ? storeInst.getData() : await storeInst.loadData();
      const data = encoded ? await storeInst.encodeData[1](JSON.stringify(rawData)) : this.options.stringifyData ? JSON.stringify(rawData) : rawData;
      serData.push({
        id: storeInst.id,
        data,
        formatVersion: storeInst.formatVersion,
        encoded,
        checksum: this.options.addChecksum ? await this.calcChecksum(data) : void 0
      });
    }
    return stringified ? JSON.stringify(serData) : serData;
  }
  /**
   * Serializes the data stores into a string.  
   * @param useEncoding Whether to encode the data using each DataStore's `encodeData()` method
   * @param stringified Whether to return the result as a string or as an array of `SerializedDataStore` objects
   */
  async serialize(useEncoding = true, stringified = true) {
    return this.serializePartial(this.stores.map((s) => s.id), useEncoding, stringified);
  }
  /**
   * Deserializes the data exported via {@linkcode serialize()} and imports only a subset into the DataStore instances.  
   * Also triggers the migration process if the data format has changed.
   */
  async deserializePartial(stores, data) {
    const deserStores = typeof data === "string" ? JSON.parse(data) : data;
    if (!Array.isArray(deserStores) || !deserStores.every(_DataStoreSerializer.isSerializedDataStoreObj))
      throw new TypeError("Invalid serialized data format! Expected an array of SerializedDataStore objects.");
    const resolveStoreId = (id) => {
      var _a;
      return ((_a = Object.entries(this.options.remapIds).find(([, v]) => v.includes(id))) == null ? void 0 : _a[0]) ?? id;
    };
    const matchesFilter = (id) => typeof stores === "function" ? stores(id) : stores.includes(id);
    for (const storeData of deserStores) {
      const effectiveId = resolveStoreId(storeData.id);
      if (!matchesFilter(effectiveId))
        continue;
      const storeInst = this.stores.find((s) => s.id === effectiveId);
      if (!storeInst)
        throw new DatedError(`Can't deserialize data because no DataStore instance with the ID "${effectiveId}" was found! Make sure to provide it in the DataStoreSerializer constructor.`);
      if (this.options.ensureIntegrity && typeof storeData.checksum === "string") {
        const checksum = await this.calcChecksum(storeData.data);
        if (checksum !== storeData.checksum)
          throw new ChecksumMismatchError(`Checksum mismatch for DataStore with ID "${storeData.id}"!
Expected: ${storeData.checksum}
Has: ${checksum}`);
      }
      const decodedData = storeData.encoded && storeInst.encodingEnabled() ? await storeInst.decodeData[1](typeof storeData.data === "string" ? storeData.data : JSON.stringify(storeData.data)) : storeData.data;
      if (storeData.formatVersion && !isNaN(Number(storeData.formatVersion)) && Number(storeData.formatVersion) < storeInst.formatVersion)
        await storeInst.runMigrations(typeof decodedData === "string" ? JSON.parse(decodedData) : decodedData, Number(storeData.formatVersion), false);
      else
        await storeInst.setData(typeof decodedData === "string" ? JSON.parse(decodedData) : decodedData);
    }
  }
  /**
   * Deserializes the data exported via {@linkcode serialize()} and imports the data into all matching DataStore instances.  
   * Also triggers the migration process if the data format has changed.
   */
  async deserialize(data) {
    return this.deserializePartial(this.stores.map((s) => s.id), data);
  }
  /**
   * Loads the persistent data of the DataStore instances into the in-memory cache.  
   * Also triggers the migration process if the data format has changed.
   * @param stores An array of store IDs or a function that takes the store IDs and returns a boolean - if omitted, all stores will be loaded
   * @returns Returns a PromiseSettledResult array with the results of each DataStore instance in the format `{ id: string, data: object }`
   */
  async loadStoresData(stores) {
    return Promise.allSettled(
      this.getStoresFiltered(stores).map(async (store) => ({
        id: store.id,
        data: await store.loadData()
      }))
    );
  }
  /**
   * Resets the persistent and in-memory data of the DataStore instances to their default values.
   * @param stores An array of store IDs or a function that takes the store IDs and returns a boolean - if omitted, all stores will be affected
   */
  async resetStoresData(stores) {
    return Promise.allSettled(
      this.getStoresFiltered(stores).map((store) => store.saveDefaultData())
    );
  }
  /**
   * Deletes the persistent data of the DataStore instances.  
   * Leaves the in-memory data untouched.  
   * @param stores An array of store IDs or a function that takes the store IDs and returns a boolean - if omitted, all stores will be affected
   */
  async deleteStoresData(stores) {
    return Promise.allSettled(
      this.getStoresFiltered(stores).map((store) => store.deleteData())
    );
  }
  /** Checks if a given value is an array of SerializedDataStore objects */
  static isSerializedDataStoreObjArray(obj) {
    return Array.isArray(obj) && obj.every((o) => typeof o === "object" && o !== null && "id" in o && "data" in o && "formatVersion" in o && "encoded" in o);
  }
  /** Checks if a given value is a SerializedDataStore object */
  static isSerializedDataStoreObj(obj) {
    return typeof obj === "object" && obj !== null && "id" in obj && "data" in obj && "formatVersion" in obj && "encoded" in obj;
  }
  /** Returns the DataStore instances whose IDs match the provided array or function */
  getStoresFiltered(stores) {
    return this.stores.filter((s) => typeof stores === "undefined" ? true : Array.isArray(stores) ? stores.includes(s.id) : stores(s.id));
  }
};

// lib/Debouncer.ts
var Debouncer = class extends NanoEmitter {
  /**
   * Creates a new debouncer with the specified timeout and edge type.
   * @param timeout Timeout in milliseconds between letting through calls - defaults to 200
   * @param type The edge type to use for the debouncer - see {@linkcode DebouncerType} for details or [the documentation for an explanation and diagram](https://github.com/Sv443-Network/UserUtils/blob/main/docs.md#debouncer) - defaults to "immediate"
   */
  constructor(timeout = 200, type = "immediate", nanoEmitterOptions) {
    super(nanoEmitterOptions);
    this.timeout = timeout;
    this.type = type;
  }
  timeout;
  type;
  /** All registered listener functions and the time they were attached */
  listeners = [];
  /** The currently active timeout */
  activeTimeout;
  /** The latest queued call */
  queuedCall;
  //#region listeners
  /** Adds a listener function that will be called on timeout */
  addListener(fn) {
    this.listeners.push(fn);
  }
  /** Removes the listener with the specified function reference */
  removeListener(fn) {
    const idx = this.listeners.findIndex((l) => l === fn);
    idx !== -1 && this.listeners.splice(idx, 1);
  }
  /** Removes all listeners */
  removeAllListeners() {
    this.listeners = [];
  }
  /** Returns all registered listeners */
  getListeners() {
    return this.listeners;
  }
  //#region timeout
  /** Sets the timeout for the debouncer */
  setTimeout(timeout) {
    this.emitEvent("change", this.timeout = timeout, this.type);
  }
  /** Returns the current timeout */
  getTimeout() {
    return this.timeout;
  }
  /** Whether the timeout is currently active, meaning any latest call to the {@linkcode call()} method will be queued */
  isTimeoutActive() {
    return typeof this.activeTimeout !== "undefined";
  }
  //#region type
  /** Sets the edge type for the debouncer */
  setType(type) {
    this.emitEvent("change", this.timeout, this.type = type);
  }
  /** Returns the current edge type */
  getType() {
    return this.type;
  }
  //#region call
  /** Use this to call the debouncer with the specified arguments that will be passed to all listener functions registered with {@linkcode addListener()} */
  call(...args) {
    const cl = (...a) => {
      this.queuedCall = void 0;
      this.emitEvent("call", ...a);
      this.listeners.forEach((l) => l.call(this, ...a));
    };
    const setRepeatTimeout = () => {
      this.activeTimeout = setTimeout(() => {
        if (this.queuedCall) {
          this.queuedCall();
          setRepeatTimeout();
        } else
          this.activeTimeout = void 0;
      }, this.timeout);
    };
    switch (this.type) {
      case "immediate":
        if (typeof this.activeTimeout === "undefined") {
          cl(...args);
          setRepeatTimeout();
        } else
          this.queuedCall = () => cl(...args);
        break;
      case "idle":
        if (this.activeTimeout)
          clearTimeout(this.activeTimeout);
        this.activeTimeout = setTimeout(() => {
          cl(...args);
          this.activeTimeout = void 0;
        }, this.timeout);
        break;
      default:
        throw new TypeError(`Invalid debouncer type: ${this.type}`);
    }
  }
};
function debounce(fn, timeout = 200, type = "immediate", nanoEmitterOptions) {
  const debouncer = new Debouncer(timeout, type, nanoEmitterOptions);
  debouncer.addListener(fn);
  const func = ((...args) => debouncer.call(...args));
  func.debouncer = debouncer;
  return func;
}



if (typeof module.exports == "object" && typeof exports == "object") {
    var __cp = (to, from, except, desc) => {
      if ((from && typeof from === "object") || typeof from === "function") {
        for (let key of Object.getOwnPropertyNames(from)) {
          if (!Object.prototype.hasOwnProperty.call(to, key) && key !== except)
          Object.defineProperty(to, key, {
            get: () => from[key],
            enumerable: !(desc = Object.getOwnPropertyDescriptor(from, key)) || desc.enumerable,
          });
        }
      }
      return to;
    };
    module.exports = __cp(module.exports, exports);
  }
  return module.exports;
  }))




//# sourceMappingURL=CoreUtils.umd.js.map
