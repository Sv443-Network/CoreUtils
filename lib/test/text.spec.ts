import { describe, expect, it } from "vitest";
import { autoPlural, capitalize, createProgressBar, insertValues, joinArrayReadable, secsToTimeStr, truncStr } from "./text.ts";

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
