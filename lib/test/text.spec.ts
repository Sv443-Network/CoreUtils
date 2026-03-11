import { describe, expect, it } from "vitest";
import { autoPlural, capitalize, createProgressBar, createTable, defaultTableLineCharset, insertValues, joinArrayReadable, secsToTimeStr, truncStr } from "../text.ts";

//#region autoPlural
describe("misc/autoPlural", () => {
  it("Autodetects the correct types", () => {
    expect(autoPlural("apple", -1)).toBe("apples");
    expect(autoPlural("apple", 0)).toBe("apples");
    expect(autoPlural("apple", 1)).toBe("apple");
    expect(autoPlural("apple", 2)).toBe("apples");

    expect(autoPlural("cherry", -1)).toBe("cherries");
    expect(autoPlural("cherry", 0)).toBe("cherries");
    expect(autoPlural("cherry", 1)).toBe("cherry");
    expect(autoPlural("cherry", 2)).toBe("cherries");

    const cont = document.createElement("div");
    for(let i = 0; i < 3; i++) {
      const span = document.createElement("span");
      cont.append(span);
    }

    expect(autoPlural("cherry", [1])).toBe("cherry");
    expect(autoPlural("cherry", cont.querySelectorAll("span"))).toBe("cherries");
    expect(autoPlural("cherry", { count: 3 })).toBe("cherries");
  });

  it("Handles edge cases", () => {
    expect(autoPlural("apple", 2, "-ies")).toBe("applies");
    expect(autoPlural("cherry", 2, "-s")).toBe("cherrys");
    //@ts-expect-error
    expect(autoPlural("cherry", 2, Symbol(1))).toBe("cherries");
  });
});

//#region capitalize
describe("misc/capitalize", () => {
  it("Capitalizes the first letter of a string", () => {
    expect(capitalize("hello")).toBe("Hello");
    expect(capitalize("")).toBe("");
    try {
      //@ts-expect-error
      expect(capitalize(123)).toBe("123");
    }
    catch(e) {
      expect(e).toBeInstanceOf(TypeError);
    }
  });
});

//#region createProgressBar
describe("misc/createProgressBar", () => {
  it("Creates a progress bar with correct characters", () => {
    expect(createProgressBar(100, 10)).toBe("██████████");
    expect(createProgressBar(75, 10)).toBe("███████▓──");
    expect(createProgressBar(50, 10)).toBe("█████▓────");
    expect(createProgressBar(25, 10)).toBe("██▓───────");
    expect(createProgressBar(0, 10)).toBe("──────────");

    expect(createProgressBar(75, 5, {
      100: "a",
      75: "b",
      50: "c",
      25: "d",
      0: "e",
    })).toBe("aaabe");
  });

  it("Throws errors for invalid inputs", () => {
    expect(() => createProgressBar(101, 10)).toThrow(RangeError);
    expect(() => createProgressBar(-1, 10)).toThrow(RangeError);
    expect(() => createProgressBar(50, -1)).toThrow(RangeError);
  });
});

//#region insertValues
describe("misc/insertValues", () => {
  it("Stringifies and inserts values correctly", () => {
    expect(insertValues("a:%1,b:%2,c:%3", "A", "B", "C")).toBe("a:A,b:B,c:C");
    expect(insertValues("a:%1,b:%2,c:%3", "A", 2, true)).toBe("a:A,b:2,c:true");
    expect(insertValues("a:%1,b:%2,c:%3", { toString: () => "[A]" }, {})).toBe("a:[A],b:[object Object],c:%3");
  });
});

//#region joinArrayReadable
describe("misc/joinArrayReadable", () => {
  it("Joins an array into a readable string", () => {
    expect(joinArrayReadable(["a", "b", "c"])).toBe("a, b and c");
    expect(joinArrayReadable(["a", "b", "c"], "; ", " or ")).toBe("a; b or c");
    expect(joinArrayReadable([])).toBe("");
    expect(joinArrayReadable(["a"])).toBe("a");
    expect(joinArrayReadable(["a", "b"])).toBe("a and b");
    expect(joinArrayReadable(["a", "b", "c", "d", "e"])).toBe("a, b, c, d and e");
  });

  it("Handles non-string values", () => {
    expect(joinArrayReadable([1, 2, 3])).toBe("1, 2 and 3");
    expect(joinArrayReadable([true, false])).toBe("true and false");
    expect(joinArrayReadable([null, undefined])).toBe(" and ");
    expect(joinArrayReadable([{ a: 1 }, { b: 2 }])).toBe("[object Object] and [object Object]");
  });
});

//#region secsToTimeStr
describe("misc/secsToTimeStr", () => {
  it("Converts seconds to a time string", () => {
    expect(secsToTimeStr(0)).toBe("0:00");
    expect(secsToTimeStr(5)).toBe("0:05");
    expect(secsToTimeStr(60)).toBe("01:00");
    expect(secsToTimeStr(3661)).toBe("1:01:01");
    expect(secsToTimeStr(86399)).toBe("23:59:59");
    expect(secsToTimeStr(-1)).toBe("-0:01");
    expect(secsToTimeStr(-3600)).toBe("-1:00:00");

    expect(() => secsToTimeStr(Infinity)).toThrow(TypeError);
    expect(() => secsToTimeStr(-Infinity)).toThrow(TypeError);
    expect(() => secsToTimeStr(NaN)).toThrow(TypeError);
  });
});

//#region truncStr
describe("misc/truncStr", () => {
  it("Truncates strings correctly", () => {
    expect(truncStr("Hello, world!", 5)).toBe("He...");
    expect(truncStr("Hello, world!", 5, "…")).toBe("Hell…");
    expect(truncStr("Hello, world!", 20)).toBe("Hello, world!");
    expect(truncStr(1234, 4)).toBe("1234");
    expect(truncStr(12345, 4)).toBe("1...");
    expect(truncStr("Hello, world!", 1)).toBe(".");
    expect(truncStr("Hello, world!", 0)).toBe("");
  });
});

//#region createTable
describe("text/createTable", () => {
  it("Creates a basic single-style table", () => {
    expect(createTable([
      ["Name", "Age"],
      ["Alice", "30"],
      ["Bob", "25"],
    ])).toBe(
      "┌───────┬─────┐\n" +
      "│ Name  │ Age │\n" +
      "├───────┼─────┤\n" +
      "│ Alice │ 30  │\n" +
      "├───────┼─────┤\n" +
      "│ Bob   │ 25  │\n" +
      "└───────┴─────┘"
    );
  });

  it("Creates a double-style table", () => {
    expect(createTable([
      ["a", "b"],
      ["c", "d"],
    ], { lineStyle: "double" })).toBe(
      "╔═══╦═══╗\n" +
      "║ a ║ b ║\n" +
      "╠═══╬═══╣\n" +
      "║ c ║ d ║\n" +
      "╚═══╩═══╝"
    );
  });

  it("Creates a table with no border lines", () => {
    const result = createTable([
      ["a", "b"],
      ["c", "d"],
    ], { lineStyle: "none" });
    const lines = result.split("\n");
    // Only content rows, no border rows
    expect(lines).toHaveLength(2);
    // No border characters
    expect(result).not.toMatch(/[┌┐└┘├┤┬┴┼─│]/);
    // Content is present
    expect(lines[0]).toContain("a");
    expect(lines[0]).toContain("b");
  });

  it("Creates a single-row table (no middle border)", () => {
    expect(createTable([["Hello", "World"]])).toBe(
      "┌───────┬───────┐\n" +
      "│ Hello │ World │\n" +
      "└───────┴───────┘"
    );
  });

  it("Applies right column alignment", () => {
    expect(createTable([
      ["a"],
      ["bb"],
      ["ccc"],
    ], { columnAlign: ["right"] })).toBe(
      "┌─────┐\n" +
      "│   a │\n" +
      "├─────┤\n" +
      "│  bb │\n" +
      "├─────┤\n" +
      "│ ccc │\n" +
      "└─────┘"
    );
  });

  it("Applies centerLeft column alignment", () => {
    expect(createTable([
      ["a"],
      ["bb"],
      ["ccc"],
    ], { columnAlign: ["centerLeft"] })).toBe(
      "┌─────┐\n" +
      "│  a  │\n" +
      "├─────┤\n" +
      "│ bb  │\n" +
      "├─────┤\n" +
      "│ ccc │\n" +
      "└─────┘"
    );
  });

  it("Applies centerRight column alignment", () => {
    expect(createTable([
      ["a"],
      ["bb"],
      ["ccc"],
    ], { columnAlign: ["centerRight"] })).toBe(
      "┌─────┐\n" +
      "│  a  │\n" +
      "├─────┤\n" +
      "│  bb │\n" +
      "├─────┤\n" +
      "│ ccc │\n" +
      "└─────┘"
    );
  });

  it("Truncates cell content with truncateAbove", () => {
    expect(createTable([
      ["Hello World", "Hi"],
    ], {
      truncateAbove: 5,
      truncEndStr: "---",
    })).toBe(
      "┌───────┬────┐\n" +
      "│ He--- │ Hi │\n" +
      "└───────┴────┘"
    );
  });

  it("Ignores ANSI codes for width calculation", () => {
    const red = "\x1b[31mRed\x1b[0m"; // visible length 3
    const result = createTable([[red, "Normal"]]);
    // The border for col 0 should be 5 dashes (colWidth=3 + 2*minPadding)
    expect(result.split("\n")[0]).toBe("┌─────┬────────┐");
    // The content includes the ANSI codes
    expect(result).toContain(`\x1b[31mRed\x1b[0m`);
  });

  it("Truncates ANSI-colored cells without splitting escape sequences", () => {
    // visible content is "Hello World" (11 chars); truncate to 7 visible → "Hello " + endStr + reset
    const colored = "\x1b[31mHello World\x1b[0m";
    const result = createTable([[colored]], { truncateAbove: 7 });
    const contentLine = result.split("\n")[1];
    expect(contentLine).toContain("\x1b[31mHello \u2026\x1b[0m");

    // ANSI code appearing mid-string should also be preserved
    const midCode = "Hello\x1b[31m World\x1b[0m"; // visible: "Hello World" = 11
    const result2 = createTable([[midCode]], { truncateAbove: 7 });
    const contentLine2 = result2.split("\n")[1];
    // 6 visible chars kept ("Hello "), then endStr + reset
    expect(contentLine2).toContain("Hello\x1b[31m \u2026\x1b[0m");
  });

  it("Applies applyCellStyle to each cell", () => {
    const calls: [number, number][] = [];
    const result = createTable([
      ["a", "b"],
      ["c", "d"],
    ], {
      applyCellStyle: (i, j) => {
        calls.push([i, j]);
        return ["[", "]"];
      },
    });
    expect(calls).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
    expect(result).toContain("[a]");
    expect(result).toContain("[b]");
    expect(result).toContain("[c]");
    expect(result).toContain("[d]");
  });

  it("Applies applyLineStyle to each line character", () => {
    const result = createTable([["x"]], {
      applyLineStyle: () => ["<", ">"],
    });
    // Every border character is wrapped
    expect(result).toContain("<┌>");
    expect(result).toContain("<─>");
    expect(result).toContain("<┐>");
    expect(result).toContain("<└>");
    expect(result).toContain("<┘>");
    // Cell content is unaffected
    expect(result).toContain("x");
  });

  it("Respects minPadding: 0", () => {
    expect(createTable([["a", "b"]], { minPadding: 0 })).toBe(
      "┌─┬─┐\n" +
      "│a│b│\n" +
      "└─┴─┘"
    );
  });

  it("Returns empty string for empty input", () => {
    expect(createTable([])).toBe("");
  });

  it("Handles numeric and mixed Stringifiable values", () => {
    const result = createTable([[1, true, null as unknown as string]]);
    expect(result).toContain("1");
    expect(result).toContain("true");
    expect(result).toContain("null");
  });

  it("Supports custom line characters", () => {
    const result = createTable([["x"]], {
      lineCharset: {
        ...defaultTableLineCharset,
        single: {
          ...defaultTableLineCharset.single,
          topLeft: "A",
          horizontal: "B",
        },
      },
    });
    expect(result).toContain("ABBB┐");
    expect(result).toContain("└BBB┘");
  });
});
