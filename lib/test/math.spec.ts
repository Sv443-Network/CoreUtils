import { describe, expect, it } from "vitest";
import { bitSetHas, clamp, digitCount, formatNumber, mapRange, overflowVal, randRange, roundFixed, valsWithin } from "../math.ts";

//#region clamp
describe("math/clamp", () => {
  it("Clamps a value between min and max", () => {
    expect(clamp(5, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
    expect(clamp(Number.MAX_SAFE_INTEGER, 0, Infinity)).toBe(Number.MAX_SAFE_INTEGER);
  });

  it("Handles edge cases", () => {
    expect(clamp(0, 1, 0)).toThrow(TypeError);
    // @ts-expect-error
    expect(clamp("1", 0, 1)).toThrow(TypeError);
  });
});

//#region mapRange
describe("math/mapRange", () => {
  it("Maps a value from one range to another", () => {
    expect(mapRange(2, 0, 5, 0, 10)).toBe(4);
    expect(mapRange(2, 5, 10, 0, 5)).toBe(-3);
    expect(mapRange(2, 0, 5, 0, 10)).toBe(4);
    expect(mapRange(3, 15, 100)).toBe(20);
  });

  it("Handles edge cases", () => {
    expect(mapRange(0, 0, NaN, 0, 0)).toBe(NaN);
    expect(mapRange(NaN, 0, 0)).toBe(NaN);
    expect(mapRange(0, 0, 0)).toBe(NaN);
    expect(mapRange(Infinity, 10, 1000)).toBe(Infinity);
    expect(mapRange(-Infinity, -Infinity, Infinity)).toBe(NaN);
  });
});

//#region overflowVal
describe("math/overflowVal", () => {
  it("Overflows a value to be within a range", () => {
    expect(overflowVal(5, 0, 10)).toBe(5);
    expect(overflowVal(15, 0, 10)).toBe(4);
    expect(overflowVal(-5, 0, 10)).toBe(6);
    expect(overflowVal(3, 2)).toBe(0);
  });

  it("Handles edge cases", () => {
    expect(overflowVal(NaN, 10)).toBeNaN();
    expect(overflowVal(5, 10, NaN)).toBeNaN();
    expect(overflowVal(Infinity, 10)).toBeNaN();
    expect(overflowVal(-Infinity, 10)).toBeNaN();
    expect(() => overflowVal(5, 10, 0)).toThrow(RangeError);
  });
});

//#region randRange
describe("math/randRange", () => {
  it("Returns a random number between min and max", () => {
    const nums: number[] = [];

    const startTsA = Date.now();
    for(let i = 0; i < 100_000; i++)
      nums.push(randRange(0, 10));
    const timeA = Date.now() - startTsA;

    const startTsB = Date.now();
    for(let i = 0; i < 100_000; i++)
      nums.push(randRange(10, true));
    const timeB = Date.now() - startTsB;

    expect(nums.every(n => n >= 0 && n <= 10)).toBe(true);

    // about a 5x speed difference
    expect(timeA).toBeLessThanOrEqual(75);
    expect(timeB).toBeGreaterThanOrEqual(150);

    expect(randRange(0, 0)).toBe(0);
    expect(randRange(0)).toBe(0);
  });

  it("Handles edge cases", () => {
    expect(randRange(NaN, 10)).toBeNaN();
    expect(randRange(0, NaN)).toBeNaN();
    try {
      randRange(Infinity, 10);
    }
    catch(e) {
      expect(e).toBeInstanceOf(TypeError);
    }
    try {
      //@ts-expect-error
      randRange(Symbol(1), Symbol(2));
    }
    catch(e) {
      expect(e).toBeInstanceOf(TypeError);
    }
  });
});

//#region digitCount
describe("math/digitCount", () => {
  it("Counts the number of digits in a number", () => {
    expect(digitCount(0)).toBe(1);
    expect(digitCount(1)).toBe(1);
    expect(digitCount(10)).toBe(2);
    expect(digitCount(100_000_000.000_001)).toBe(15);
    expect(digitCount(100_000_000.000_001, false)).toBe(9);
  });

  it("Handles edge cases", () => {
    expect(digitCount(NaN)).toBe(NaN);
    expect(digitCount(Infinity)).toBe(Infinity);
  });
});

//#region roundFixed
describe("math/roundFixed", () => {
  it("Rounds a number to a fixed amount of decimal places", () => {
    expect(roundFixed(1234.5678, -1)).toBe(1230);
    expect(roundFixed(1234.5678, 0)).toBe(1235);
    expect(roundFixed(1234.5678, 1)).toBe(1234.6);
    expect(roundFixed(1234.5678, 3)).toBe(1234.568);
    expect(roundFixed(1234.5678, 5)).toBe(1234.5678);
  });

  it("Handles edge cases", () => {
    expect(roundFixed(NaN, 0)).toBe(NaN);
    expect(roundFixed(1234.5678, NaN)).toBe(NaN);
    expect(roundFixed(1234.5678, Infinity)).toBe(NaN);
    expect(roundFixed(Infinity, 0)).toBe(Infinity);
  });
});

//#region bitSetHas
describe("math/bitSetHas", () => {
  it("Checks if a bit is set in a number", () => {
    expect(bitSetHas(0b1010, 0b1000)).toBe(true);
    expect(bitSetHas(0b1010, 0b0100)).toBe(false);
    expect(bitSetHas(0b1010, 0b0010)).toBe(true);
    expect(bitSetHas(0b1010, 0b0001)).toBe(false);

    expect(bitSetHas(BigInt(0b10), BigInt(0b10))).toBe(true);
    expect(bitSetHas(BigInt(0b10), BigInt(0b01))).toBe(false);
  });

  it("Handles edge cases", () => {
    expect(bitSetHas(0, 0)).toBe(true);
    expect(bitSetHas(1, 0)).toBe(true);
    expect(bitSetHas(0, 1)).toBe(false);
    expect(bitSetHas(1, 1)).toBe(true);
    expect(bitSetHas(NaN, NaN)).toBe(false);
  });
});

//#region formatNumber
describe("math/formatNumber", () => {
  it("Formats a number correctly", () => {
    expect(formatNumber(12345, "en-US", "short")).toBe("12.3K");
    expect(formatNumber(123456789, "en-US", "short")).toBe("123.5M");
    expect(formatNumber(123456789, "en-US", "long")).toBe("123,456,789");
    expect(formatNumber(123456789, "en-US", "long")).toBe("123,456,789");
    expect(formatNumber(123456789, "de-DE", "short")).toBe("123,5 Mio.");
    expect(formatNumber(123456789, "de-DE", "long")).toBe("123.456.789");
  });

  it("Handles edge cases", () => {
    expect(formatNumber(NaN, "en-US", "short")).toBe("NaN");
    expect(formatNumber(Infinity, "en-US", "short")).toBe("∞");
    expect(formatNumber(-Infinity, "en-US", "short")).toBe("-∞");
  });
});

//#region valsWithin
describe("math/valsWithin", () => {
  it("Checks if all values are within a range", () => {
    expect(valsWithin(1, 1.5)).toBe(true);
    expect(valsWithin(1, 1.6)).toBe(false);
    expect(valsWithin(1, 2, undefined, 1)).toBe(true);
    expect(valsWithin(1.45, 1, 1, 0.49)).toBe(false);
    expect(valsWithin(1.45, 1, 2, 0.49)).toBe(true);
  });

  it("Handles edge cases", () => {
    expect(valsWithin(NaN, 1)).toBe(false);
    expect(valsWithin(1, NaN)).toBe(false);
    expect(valsWithin(Infinity, 1)).toBe(false);
    expect(valsWithin(1, Infinity)).toBe(false);
    expect(valsWithin(-Infinity, -Infinity)).toBe(false);
  });
});