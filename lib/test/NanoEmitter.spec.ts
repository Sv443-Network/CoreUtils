import { describe, expect, it } from "vitest";
import { NanoEmitter } from "../NanoEmitter.ts";

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
  it("allOf + oneOf (AND condition)", () => {
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

    // val1 emitted, but allOf not complete yet (val2 and val3 not emitted)
    evts.emit("val1", 1);
    expect(cbVal).toBe(-1);

    // val2 emitted (part of oneOf), but allOf still not complete (val3 not emitted)
    evts.emit("val2", 2);
    expect(cbVal).toBe(-1);

    // val3 emitted, now allOf is complete, but val3 is not in oneOf
    evts.emit("val3", 3);
    expect(cbVal).toBe(-1);

    // val1 emitted (part of oneOf) AND allOf is complete -> callback fires
    evts.emit("val1", 10);
    expect(cbVal).toBe(10);

    // val2 emitted (part of oneOf AND allOf) -> callback fires
    evts.emit("val2", 20);
    expect(cbVal).toBe(20);

    // val3 emitted (only in allOf, not in oneOf) -> callback doesn't fire
    evts.emit("val3", 30);
    expect(cbVal).toBe(20);
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
  });
});

describe("NanoEmitter catch-up events", () => {
  //#region on catch-up
  it("on() fires immediately with cached args", () => {
    const evts = new NanoEmitter<{ foo: (val: number) => void }>({
      publicEmit: true,
      catchUpEvents: ["foo"],
    });

    evts.emit("foo", 42);

    let received = -1;
    evts.on("foo", (val) => { received = val; });

    expect(received).toBe(42);
  });

  it("on() uses only the last cached emission", () => {
    const evts = new NanoEmitter<{ foo: (val: number) => void }>({
      publicEmit: true,
      catchUpEvents: ["foo"],
    });

    evts.emit("foo", 10);
    evts.emit("foo", 20);

    let received = -1;
    evts.on("foo", (val) => { received = val; });

    expect(received).toBe(20);
  });

  it("on() still receives future emissions after catch-up", () => {
    const evts = new NanoEmitter<{ foo: (val: number) => void }>({
      publicEmit: true,
      catchUpEvents: ["foo"],
    });

    evts.emit("foo", 5);

    const received: number[] = [];
    evts.on("foo", (val) => received.push(val));

    evts.emit("foo", 10);

    expect(received).toEqual([5, 10]);
  });

  //#region once catch-up
  it("once() resolves immediately with cached args", async () => {
    const evts = new NanoEmitter<{ foo: (val: number) => void }>({
      publicEmit: true,
      catchUpEvents: ["foo"],
    });

    evts.emit("foo", 42);

    const [val] = await evts.once("foo");
    expect(val).toBe(42);
  });

  it("once() fires the callback immediately with cached args", async () => {
    const evts = new NanoEmitter<{ foo: (val: number) => void }>({
      publicEmit: true,
      catchUpEvents: ["foo"],
    });

    evts.emit("foo", 99);

    let cbVal = -1;
    await evts.once("foo", (val) => { cbVal = val; });
    expect(cbVal).toBe(99);
  });

  //#region non-tracked events
  it("does not catch up events not listed in catchUpEvents", () => {
    const evts = new NanoEmitter<{
      tracked: (val: number) => void;
      untracked: (val: number) => void;
    }>({
      publicEmit: true,
      catchUpEvents: ["tracked"],
    });

    evts.emit("tracked", 10);
    evts.emit("untracked", 20);

    let trackedVal = -1, untrackedVal = -1;
    evts.on("tracked", (val) => { trackedVal = val; });
    evts.on("untracked", (val) => { untrackedVal = val; });

    expect(trackedVal).toBe(10);
    expect(untrackedVal).toBe(-1);
  });

  it("does not fire catch-up if event has never been emitted", () => {
    const evts = new NanoEmitter<{ foo: (val: number) => void }>({
      publicEmit: true,
      catchUpEvents: ["foo"],
    });

    let received = -1;
    evts.on("foo", (val) => { received = val; });

    expect(received).toBe(-1);
  });

  //#region emitEvent catch-up
  it("emitEvent() in subclass updates catch-up memory", () => {
    class MyEmitter extends NanoEmitter<{ foo: (val: number) => void }> {
      constructor() {
        super({ catchUpEvents: ["foo"] });
      }
      fire(val: number): void {
        this.emitEvent("foo", val);
      }
    }

    const em = new MyEmitter();
    em.fire(55);

    let received = -1;
    em.on("foo", (val) => { received = val; });
    expect(received).toBe(55);
  });
});
