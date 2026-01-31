import { describe, expect, it } from "vitest";
import { NanoEmitter } from "./NanoEmitter.ts";

describe("NanoEmitter base functionality", () => {
  //#region base - FP

  it("Functional", async () => {
    const evts = new NanoEmitter<{
      val: (v1: number, v2: number) => void;
    }>({
      publicEmit: true,
    });

    setTimeout(() => evts.emit("val", 5, 5), 1);
    const [v1, v2] = await evts.once("val");
    expect(v1 + v2).toBe(10);

    let v3 = 0, v4 = 0;
    const unsub = evts.on("val", (v1, v2) => {
      v3 = v1;
      v4 = v2;
    });
    evts.emit("val", 10, 10);
    expect(v3 + v4).toBe(20);

    unsub();
    evts.emit("val", 20, 20);
    expect(v3 + v4).toBe(20);

    evts.on("val", (v1, v2) => {
      v3 = v1;
      v4 = v2;
    });
    evts.emit("val", 30, 30);
    expect(v3 + v4).toBe(60);
    evts.unsubscribeAll();
    evts.emit("val", 40, 40);
    expect(v3 + v4).toBe(60);
  });

  //#region OOP

  it("Object oriented", async () => {
    class MyEmitter extends NanoEmitter<{
      val: (v1: number, v2: number) => void;
    }> {
      constructor() {
        super({ publicEmit: false });
      }

      run() {
        this.events.emit("val", 5, 5);
      }
    }

    const evts = new MyEmitter();

    setTimeout(() => evts.run(), 1);
    const [v1, v2] = await evts.once("val");
    expect(v1 + v2).toBe(10);

    expect(evts.emit("val", 0, 0)).toBe(false);
  });
});

describe("NanoEmitter onMulti", () => {
  //#region onMulti allOf
  it("allOf", () => {
    const evts = new NanoEmitter<{
      val1: (val: number) => void;
      val2: (val: number) => void;
    }>({
      publicEmit: true,
    });

    let cbVal = -1;

    evts.onMulti([
      {
        allOf: ["val1", "val2"],
        callback: (event, val) => {
          cbVal = val;
        },
      },
    ]);

    evts.emit("val1", 1);
    expect(cbVal).toBe(-1);

    evts.emit("val2", 2);
    expect(cbVal).toBe(2);

    evts.emit("val1", 3);
    expect(cbVal).toBe(3);
  });

  //#region onMulti oneOf
  it("oneOf", () => {
    const evts = new NanoEmitter<{
      val1: (val: number) => void;
      val2: (val: number) => void;
    }>({
      publicEmit: true,
    });

    let cbVal = -1;

    const unsub = evts.onMulti([
      {
        oneOf: ["val1", "val2"],
        callback: (event, val) => {
          cbVal = val;
        },
      },
    ]);

    evts.emit("val1", 1);
    expect(cbVal).toBe(1);

    evts.emit("val2", 2);
    expect(cbVal).toBe(2);

    unsub();

    evts.emit("val1", 3);
    expect(cbVal).toBe(2);
  });

  // #region onMulti oneOf once
  it("oneOf once", () => {
    const evts = new NanoEmitter<{
      val1: (val: number) => void;
      val2: (val: number) => void;
    }>({
      publicEmit: true,
    });

    let cbVal = -1;

    evts.onMulti({
      oneOf: ["val1", "val2"],
      once: true,
      callback: (event, val) => {
        cbVal = val;
      },
    });

    evts.emit("val1", 1);
    expect(cbVal).toBe(1);

    evts.emit("val2", 2);
    expect(cbVal).toBe(1);
  });

  // #region onMulti allOf once
  it("allOf once", () => {
    const evts = new NanoEmitter<{
      val1: (val: number) => void;
      val2: (val: number) => void;
    }>({
      publicEmit: true,
    });

    let cbVal = -1;

    evts.onMulti({
      allOf: ["val1", "val2"],
      once: true,
      callback: (event, val) => {
        cbVal = val;
      },
    });

    evts.emit("val1", 1);
    expect(cbVal).toBe(-1);

    evts.emit("val2", 2);
    expect(cbVal).toBe(2);

    evts.emit("val1", 3);
    expect(cbVal).toBe(2);
  });

  // #region onMulti oneOf + allOf
  it("allOf + oneOf", () => {
    const evts = new NanoEmitter<{
      val1: (val: number) => void;
      val2: (val: number) => void;
      val3: (val: number) => void;
    }>({
      publicEmit: true,
    });

    let cbVal = -1;

    evts.onMulti({
      oneOf: ["val1", "val2"],
      allOf: ["val2", "val3"],
      callback: (event, val) => {
        cbVal = val;
      },
    });

    evts.emit("val1", 1);
    expect(cbVal).toBe(1);

    evts.emit("val3", 3);
    expect(cbVal).toBe(1);

    evts.emit("val2", 2);
    expect(cbVal).toBe(2);

    evts.emit("val1", 1);
    expect(cbVal).toBe(1);
  });

  //#region onMulti edge cases
  it("Handles edge cases", () => {
    const evts = new NanoEmitter();
    expect(() => {
      // @ts-expect-error
      evts.onMulti({
        once: true,
        callback: () => void 0,
      });
    }).toThrow(TypeError);

    const ac = new AbortController();
    ac.abort();

    let cbVal = -1;

    evts.onMulti({
      signal: ac.signal,
      oneOf: ["val1", "val2"],
      callback: (event, val) => {
        cbVal = val;
      },
    });

    evts.emit("val1", 1);
    expect(cbVal).toBe(-1);
  })
});
