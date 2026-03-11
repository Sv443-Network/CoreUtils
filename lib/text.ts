import { clamp } from "./math.ts";
import type { ListLike, Prettify, Stringifiable } from "./types.ts";

//#region autoPlural()

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
  }
}

//#region capitalize()

/** Capitalizes the first letter of a string */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

//#region createProgressBar()

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

//#region insertValues()

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

//#region joinArrayReadable()

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

//#region secsToTimeStr()

/** Converts seconds into the timestamp format `(hh:)mm:ss`, with intelligent zero-padding */
export function secsToTimeStr(seconds: number): string {
  const isNegative = seconds < 0;
  const s = Math.abs(seconds);

  if(isNaN(s) || !isFinite(s))
    throw new TypeError("The seconds argument must be a valid number");

  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = Math.floor(s % 60);

  return (isNegative ? "-" : "") + [
    hrs ? hrs + ":" : "",
    String(mins).padStart(mins > 0 || hrs > 0 ? 2 : 1, "0"),
    ":",
    String(secs).padStart(secs > 0 || mins > 0 || hrs > 0 || seconds === 0 ? 2 : 1, "0")
  ].join("");
}

//#region truncStr()

/** Truncates a string if it exceeds `length` and inserts `endStr` at the end (empty string to disable), so that the final string doesn't exceed the given length */
export function truncStr(input: Stringifiable, length: number, endStr = "..."): string {
  const str = input?.toString() ?? String(input);
  const finalStr = str.length > length ? str.substring(0, length - endStr.length) + endStr : str;
  return finalStr.length > length ? finalStr.substring(0, length) : finalStr;
}

//#region createTable()

/**
 * Border styles for the `lineStyle` option of the {@linkcode createTable} function.
 * 
 * | Style | Example |
 * | :-- | :-- |
 * | `single` | `┌──────┬──────┐` |
 * | `double` | `╔══════╦══════╗` |
 * | `none` |  |
 */
export type TableLineStyle = "single" | "double" | "none";

/**
 * How to align cell content in a column for the `columnAlign` option of the {@linkcode createTable} function.
 * 
 * | Alignment | Example | Description |
 * | :-- | :-- | :-- |
 * | `left` | `│.Text....│` | Hugs the left border, with padding determined by `minPadding`. |
 * | `centerLeft` | `│..Text...│` | In the center, but if the padding is uneven, favors the left side. |
 * | `centerRight` | `│...Text..│` | In the center, but if the padding is uneven, favors the right side. |
 * | `right` | `│....Text.│` | Hugs the right border, with padding determined by `minPadding`. |
 */
export type TableColumnAlign = "left" | "centerLeft" | "centerRight" | "right";

/** Options for the {@linkcode createTable} function. */
export type TableOptions = {
  /** Alignment for each column, either a single value to apply to all columns or an array of values for each column. Defaults to `left`. */
  columnAlign?: TableColumnAlign | TableColumnAlign[];
  /** If set, cell content that exceeds this width will be truncated with the value of `truncEndStr` (defaults to `…`) so that the final cell content doesn't exceed this width. */
  truncateAbove?: number;
  /** The string to append to truncated cell content if `truncateAbove` is set. Defaults to `…`. */
  truncEndStr?: string;
  /** Minimum padding to add to the left and right of cell content, regardless of alignment settings. Defaults to 1, set to 0 to disable. */
  minPadding?: number;
  /** Which kind of line characters to use for the border of the table. Defaults to `single` (`┌──────┬──────┐`). */
  lineStyle?: TableLineStyle;
  /** Can be used to change the characters used for the lines dividing cells in the table. If not set, {@linkcode defaultTableLineCharset} will be used. */
  lineCharset?: TableLineCharset;
  /**
   * Can be used to add custom values like ANSI color codes to the lines dividing cells.  
   * Function gets passed the row index (i) and column index (j) of the character being rendered.  
   * Note that each row renders three rows of characters, so the row index (i) is not the same as the index of the row in the input array, but can be used to determine it with `Math.floor(i / 3)`.  
   * The first value of the returned tuple will be added before the line character and the second value will be added after.  
   * Return an empty array to not apply any custom styling.
   */
  applyLineStyle?: (i: number, j: number) => [before?: string, after?: string] | void;
  /**
   * Can be used to add custom values like ANSI color codes to the cell content.  
   * Function gets passed the row index (i) and column index (j) of the cell being rendered.  
   * Note: cell width is calculated before applying this style, so characters with non-zero width will mess up the alignment and border placement.  
   * The first value of the returned tuple will be added before the cell content and the second value will be added after.  
   * Return an empty array to not apply any custom styling.
   */
  applyCellStyle?: (i: number, j: number) => [before?: string, after?: string] | void;
};

/** Characters to use for the lines dividing cells in the table generated by {@linkcode createTable}, based on the `lineStyle` option. */
export type TableLineStyleChars = Record<
  | "horizontal"
  | "vertical"
  | `${"top"|"bottom"}${"Left"|"Right"}`
  | `${"left"|"right"|"top"|"bottom"}T`
  | "cross",
  string
>;

/** The characters to use for the lines dividing cells in the table generated by {@linkcode createTable}, based on the `lineStyle` option. */
export type TableLineCharset = Record<TableLineStyle, TableLineStyleChars>;

/** The default characters to use for the lines dividing cells in the table generated by {@linkcode createTable}, based on the `lineStyle` option. */
export const defaultTableLineCharset: TableLineCharset = {
  single: {
    horizontal: "─",
    vertical: "│",
    topLeft: "┌",
    topRight: "┐",
    bottomLeft: "└",
    bottomRight: "┘",
    leftT: "├",
    rightT: "┤",
    topT: "┬",
    bottomT: "┴",
    cross: "┼",
  },
  double: {
    horizontal: "═",
    vertical: "║",
    topLeft: "╔",
    topRight: "╗",
    bottomLeft: "╚",
    bottomRight: "╝",
    leftT: "╠",
    rightT: "╣",
    topT: "╦",
    bottomT: "╩",
    cross: "╬",
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
    cross: " ",
  },
} as const;

/**
 * Creates an ASCII table string from the given rows and options.  
 * Supports ANSI color codes in cell content: they are ignored for width calculation, included in the final output, and handled correctly during truncation (escape sequences are never split; any open color code is closed with a reset).
 * @param rows Array of tuples, where each tuple represents a row and its values. The first tuple is used to determine the column count.
 * @param options Object with options for customizing the table output, such as column alignment, truncation, padding and line styles.
 */
export function createTable<TRow extends [...Stringifiable[]]>(
  rows: TRow[],
  options?: TableOptions,
): string {
  const opts: Required<TableOptions> = {
    columnAlign: "left",
    truncateAbove: Infinity,
    truncEndStr: "…",
    minPadding: 1,
    lineStyle: "single",
    applyCellStyle: () => undefined,
    applyLineStyle: () => undefined,
    lineCharset: defaultTableLineCharset,
    ...(options ?? {}),
  };

  const defRange = (val: number | undefined, min: number, max: number): number =>
    clamp((typeof val !== "number" || isNaN(Number(val)) ? min : val), min, max);

  // normalize options:
  opts.truncateAbove = defRange(opts.truncateAbove, 0, Infinity);
  opts.minPadding = defRange(opts.minPadding, 0, Infinity);

  const lnCh = opts.lineCharset[opts.lineStyle];
  // eslint-disable-next-line no-control-regex
  const stripAnsi = (str: string): string => str.replace(/\u001b\[[0-9;]*m/g, "");

  const stringRows = rows.map(row => row.map(cell => String(cell)));
  const colCount = rows[0]?.length ?? 0;

  if(colCount === 0 || stringRows.length === 0)
    return "";

  if(isFinite(opts.truncateAbove)) {
    // Truncate by visible width while keeping ANSI sequences whole.
    // Walking char-by-char lets us skip over escape sequences without counting
    // them, then close any open color codes with a reset to prevent bleed.
    const truncAnsi = (str: string, maxVisible: number, endStr: string): string => {
      const limit = maxVisible - endStr.length;
      if(limit <= 0)
        return endStr.slice(0, maxVisible);

      let visible = 0;
      let result = "";
      let i = 0;
      let hasAnsi = false;

      while(i < str.length) {
        if(str[i] === "\u001b" && str[i + 1] === "[") {
          const seqEnd = str.indexOf("m", i + 2);
          if(seqEnd !== -1) {
            result += str.slice(i, seqEnd + 1);
            hasAnsi = true;
            i = seqEnd + 1;
            continue;
          }
        }
        if(visible === limit) {
          result += endStr;
          if(hasAnsi)
            result += "\u001b[0m";
          return result;
        }
        result += str[i];
        visible++;
        i++;
      }

      return result;
    };

    for(const row of stringRows)
      for(let j = 0; j < row.length; j++)
        if(stripAnsi(row[j] ?? "").length > opts.truncateAbove)
          row[j] = truncAnsi(row[j] ?? "", opts.truncateAbove, opts.truncEndStr);
  }

  const colWidths = Array.from({ length: colCount }, (_, j) =>
    Math.max(0, ...stringRows.map(row => stripAnsi(row[j] ?? "").length))
  );

  const applyLn = (i: number, j: number, ch: string): string => {
    const [before = "", after = ""] = opts.applyLineStyle(i, j) ?? [];
    return `${before}${ch}${after}`;
  };

  const buildBorderRow = (lineIdx: number, leftCh: string, midCh: string, rightCh: string): string => {
    let result = "";
    let j = 0;
    result += applyLn(lineIdx, j++, leftCh);
    for(let col = 0; col < colCount; col++) {
      const cellWidth = (colWidths[col] ?? 0) + opts.minPadding * 2;
      for(let ci = 0; ci < cellWidth; ci++)
        result += applyLn(lineIdx, j++, lnCh.horizontal);
      if(col < colCount - 1)
        result += applyLn(lineIdx, j++, midCh);
    }
    result += applyLn(lineIdx, j++, rightCh);
    return result;
  };

  const lines: string[] = [];

  for(let rowIdx = 0; rowIdx < stringRows.length; rowIdx++) {
    const row = stringRows[rowIdx] ?? [];
    const lineIdxBase = rowIdx * 3;

    if(opts.lineStyle !== "none") {
      lines.push(
        rowIdx === 0
          ? buildBorderRow(lineIdxBase, lnCh.topLeft, lnCh.topT, lnCh.topRight)
          : buildBorderRow(lineIdxBase, lnCh.leftT, lnCh.cross, lnCh.rightT)
      );
    }

    let contentLine = "";
    let j = 0;
    contentLine += applyLn(lineIdxBase + 1, j++, lnCh.vertical);

    for(let colIdx = 0; colIdx < colCount; colIdx++) {
      const cell = row[colIdx] ?? "";
      const visLen = stripAnsi(cell).length;
      const extra = (colWidths[colIdx] ?? 0) - visLen;
      const align = (Array.isArray(opts.columnAlign) ? opts.columnAlign[colIdx] : opts.columnAlign) ?? "left";

      let leftPad: number;
      let rightPad: number;

      switch(align) {
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

    if(opts.lineStyle !== "none" && rowIdx === stringRows.length - 1)
      lines.push(buildBorderRow(lineIdxBase + 2, lnCh.bottomLeft, lnCh.bottomT, lnCh.bottomRight));
  }

  return lines.join("\n");
}
