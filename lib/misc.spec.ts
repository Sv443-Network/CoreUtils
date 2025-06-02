import { describe, expect, it } from "vitest";
import { consumeGen, consumeStringGen, fetchAdvanced, getListLength, pauseFor, pureObj, scheduleExit, setImmediateInterval, setImmediateTimeoutLoop } from "./misc.js";
import { vi } from "vitest";

//#region pauseFor
describe("misc/pauseFor", () => {
  it("Pauses for the correct time and can be aborted", async () => {
    const startTs = Date.now();
    await pauseFor(100);

    expect(Date.now() - startTs).toBeGreaterThanOrEqual(80);

    const ac = new AbortController();
    const startTs2 = Date.now();

    setTimeout(() => ac.abort(), 20);
    await pauseFor(100, ac.signal);

    expect(Date.now() - startTs2).toBeLessThan(100);
  });
});

//#region fetchAdvanced
describe("misc/fetchAdvanced", () => {
  it("Fetches a resource correctly", async () => {
    try {
      const res = await fetchAdvanced("https://jsonplaceholder.typicode.com/todos/1");
      const json = await res.json();

      expect(json?.id).toBe(1);
    }
    catch(e) {
      expect(e).toBeUndefined();
    }
  });

  it("Throws error on invalid resource", async () => {
    try {
      const res = await fetchAdvanced("invalid-url");
    }
    catch(e) {
      expect(e).toBeInstanceOf(Error);
    }
  });
});

//#region consumeGen
describe("misc/consumeGen", () => {
  it("Consumes a ValueGen properly", async () => {
    expect(await consumeGen(() => 1)).toBe(1);
    expect(await consumeGen(() => Promise.resolve(1))).toBe(1);
    expect(await consumeGen(1)).toBe(1);

    expect(await consumeGen(() => true)).toBe(true);
    expect(await consumeGen(async () => false)).toBe(false);

    // @ts-expect-error
    expect(await consumeGen()).toThrow(TypeError);
  });
});

//#region consumeStringGen
describe("misc/consumeStringGen", () => {
  it("Consumes a StringGen properly", async () => {
    expect(await consumeStringGen("a")).toBe("a");
    expect(await consumeStringGen(() => "b")).toBe("b");
    expect(await consumeStringGen(() => Promise.resolve("c"))).toBe("c");
    expect(await consumeStringGen({ toString: () => "d" })).toBe("d");
  });
});

//#region getListLength
describe("misc/getListLength", () => {
  it("Resolves all types of ListWithLength", () => {
    const cont = document.createElement("div");
    for(let i = 0; i < 3; i++) {
      const span = document.createElement("span");
      cont.append(span);
    }
    expect(getListLength(cont.querySelectorAll("span"))).toBe(3);
    expect(getListLength([1, 2, 3])).toBe(3);
    expect(getListLength({ length: 3 })).toBe(3);
    expect(getListLength({ size: 3 })).toBe(3);
    expect(getListLength({ count: 3 })).toBe(3);

    // @ts-expect-error
    expect(getListLength({}, true)).toBe(0);
    // @ts-expect-error
    expect(getListLength({}, false)).toBe(NaN);
  });
});

//#region pureObj
describe("misc/pureObj", () => {
  it("Removes the prototype chain of a passed object", () => {
    const obj = { a: 1, b: 2 };
    const pure = pureObj(obj);

    // @ts-expect-error
    expect(obj.__proto__).toBeDefined();
    // @ts-expect-error
    expect(pure.__proto__).toBeUndefined();

    expect(pure.a).toBe(1);
    expect(pure.b).toBe(2);
  });
});

//#region setImmediateInterval
describe("misc/setImmediateInterval", () => {
  it("Calls the callback immediately and then at the specified interval", async () => {
    const controller = new AbortController();

    let startTs = Date.now();
    const times: number[] = [];

    setImmediateInterval(() => {
      times.push(Date.now() - startTs);
    }, 30, controller.signal);

    await new Promise(resolve => setTimeout(resolve, 200)); // wait for 200 ms
    controller.abort();

    const len = times.length;
    expect(len).toBeLessThanOrEqual(7);
    expect(len).toBeGreaterThanOrEqual(6);
    expect(times.every(t => t <= 200 && t >= 0)).toBe(true);

    await new Promise(resolve => setTimeout(resolve, 100)); // wait for another 100 ms to ensure no more calls
    expect(times.length).toEqual(len);
  });
});

//#region setImmediateTimeoutLoop
describe("misc/setImmediateTimeoutLoop", () => {
  it("Calls the callback immediately and then with the specified timeout", async () => {
    const controller = new AbortController();

    let startTs = Date.now();
    const times: number[] = [];

    setImmediateTimeoutLoop(async () => {
      await pauseFor(80, controller.signal);
      times.push(Date.now() - startTs);
    }, 30, controller.signal);

    await new Promise(resolve => setTimeout(resolve, 200));
    controller.abort();

    expect(times.length).toBeLessThanOrEqual(3);
    expect(times.length).toBeGreaterThanOrEqual(1);
    expect(times.every(t => t <= 200 && t >= 0)).toBe(true);
  });
});

//#region scheduleExit
describe("misc/scheduleExit", () => {
  it("Schedules an exit with the specified code", async () => {
    const exitSpy = vi.spyOn(process, "exit").mockImplementation((code?: string | number | null) => void code as never);

    scheduleExit(0);
    await pauseFor(1);
    expect(exitSpy).toHaveBeenCalledWith(0);

    scheduleExit(1);
    await pauseFor(1);
    expect(exitSpy).toHaveBeenCalledWith(1);

    exitSpy.mockRestore();
  });
});
