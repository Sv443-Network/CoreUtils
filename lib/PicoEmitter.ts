/**
 * @module PicoEmitter
 * This module contains the PicoEmitter class, which is an even tinier event emitter powered by [nanoevents](https://www.npmjs.com/package/nanoevents) - [see the documentation for more info](https://github.com/Sv443-Network/UserUtils/blob/main/docs.md#picoemitter)  
 * Contrary to `PicoEmitter`, it's purely meant for bootstrapping event-emitting classes in OOP and doesn't have much in the way of helper methods, just pure internal emitting and public subscribing.
 */

import { createNanoEvents, type DefaultEvents, type Emitter, type EventsMap, type Unsubscribe } from "nanoevents";
import type { Prettify } from "./types.ts";

//#region types

export type PicoEmitterOptions = {
  /**
   * When provided, the emitter will remember the last arguments of each listed event.
   * Any listener attached via `on()` or `once()` after the event has already fired will
   * be immediately called / resolved with the cached arguments (catch-up behaviour).
   * Only works for emissions that go through the public `emit()` or the protected `emitEvent()` method.
   */
  catchUpEvents?: PropertyKey[];
};

type PicoEmitterOnMultiTriggerOptions<TEvtMap extends EventsMap, TKey extends keyof TEvtMap = keyof TEvtMap> = {
  /** Calls the callback when one of the given events is emitted. Either one of or both of `oneOf` and `allOf` need to be set. If both are set, they behave like an "AND" condition. */
  oneOf?: TKey[];
  /** Calls the callback when all of the given events are emitted. Either one of or both of `oneOf` and `allOf` need to be set. If both are set, they behave like an "AND" condition. */
  allOf?: TKey[];
};

/** Options for the {@linkcode PicoEmitter.onMulti()} method */
export type PicoEmitterOnMultiOptions<TEvtMap extends EventsMap, TKey extends keyof TEvtMap = keyof TEvtMap> = Prettify<
  & {
    /** If true, the callback will be called only once for the first event (or set of events) that match the criteria */
    once?: boolean;
    /** If provided, can be used to cancel the subscription if the signal is aborted */
    signal?: AbortSignal;
    /** The callback to call when the event with the given name is emitted */
    callback: (event: TKey, ...args: Parameters<TEvtMap[TKey]>) => void;
  }
  & PicoEmitterOnMultiTriggerOptions<TEvtMap, TKey>
  & (
    | Pick<Required<PicoEmitterOnMultiTriggerOptions<TEvtMap, TKey>>, "oneOf">
    | Pick<Required<PicoEmitterOnMultiTriggerOptions<TEvtMap, TKey>>, "allOf">
  )
>;

//#region PicoEmitter

/**
 * Abstract class that can be extended to bootstrap a class with a lightweight event emitter, with some protected helper methods and a strongly typed event map.  
 * For a more feature-rich emitter that can also be used in a non-OOP context, see `NanoEmitter` which extends from this class.  
 *   
 * ⚠️ Prefer using `this.emitEvent()` over `this.events.emit()` — it updates the catch-up memory for any events listed in `catchUpEvents`.
 */
export abstract class PicoEmitter<TEvtMap extends EventsMap = DefaultEvents> {
  /**
   * The nanoevents emitter instance used internally.  
   * ⚠️ You should use the protected method `emitEvent()` instead of emitting directly through this, as it updates the catch-up memory for any events listed in `catchUpEvents`. Only use `this.events.emit()` if you're not using `catchUpEvents` or are doing manual memory management.
   */
  protected readonly events: Emitter<TEvtMap> = createNanoEvents<TEvtMap>();
  protected eventUnsubscribes: Unsubscribe[] = [];
  protected emitterOptions: PicoEmitterOptions;
  /** Stores the latest arguments for each emitted event that's listed in `catchUpEvents`. */
  protected catchUpMemory: Map<PropertyKey, unknown[]> = new Map<PropertyKey, unknown[]>();

  /**
   * ⚠️ You cannot instantiate `PicoEmitter` directly, it's only meant for extending in your own classes. If you want a standalone emitter, use `NanoEmitter` instead.
   */
  constructor(options: Partial<PicoEmitterOptions> = {}) {
    this.emitterOptions = {
      ...options,
    };
  }

  //#region emitEvent

  /**
   * Emits an event on this instance.  
   * You should use this over `this.events.emit()` in subclasses as it updates the catch-up memory for any event listed in `catchUpEvents`, so that listeners attached after emitting can still receive the latest value.
   */
  protected emitEvent<TKey extends keyof TEvtMap>(event: TKey, ...args: Parameters<TEvtMap[TKey]>): void {
    if(this.emitterOptions.catchUpEvents?.includes(event as PropertyKey))
      this.catchUpMemory.set(event as PropertyKey, args);
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
  public on<TKey extends keyof TEvtMap>(event: TKey | "_", cb: TEvtMap[TKey]): () => void {
    // eslint-disable-next-line prefer-const
    let unsub: Unsubscribe | undefined;

    const unsubProxy = (): void => {
      if(!unsub)
        return;
      unsub();
      this.eventUnsubscribes = this.eventUnsubscribes.filter(u => u !== unsub);
    };

    unsub = this.events.on(event, cb);
    this.eventUnsubscribes.push(unsub);

    const memory = this.catchUpMemory.get(event as PropertyKey);
    if(memory)
      cb(...memory as Parameters<TEvtMap[TKey]>);

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
  public once<TKey extends keyof TEvtMap>(event: TKey | "_", cb?: TEvtMap[TKey]): Promise<Parameters<TEvtMap[TKey]>> {
    const memory = this.catchUpMemory.get(event as PropertyKey);
    if(memory) {
      const args = memory as Parameters<TEvtMap[TKey]>;
      cb?.(...args);
      return Promise.resolve(args);
    }

    return new Promise((resolve) => {
      // eslint-disable-next-line prefer-const
      let unsub: Unsubscribe | undefined;

      const onceProxy = ((...args: Parameters<TEvtMap[TKey]>) => {
        cb?.(...args);
        unsub?.();
        resolve(args);
      }) as TEvtMap[TKey];

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
  public onMulti<TEvt extends keyof TEvtMap>(options: PicoEmitterOnMultiOptions<TEvtMap> | Array<PicoEmitterOnMultiOptions<TEvtMap>>): Unsubscribe {
    const allUnsubs: Unsubscribe[] = [];

    const unsubAll = (): void => {
      for(const unsub of allUnsubs)
        unsub();
      allUnsubs.splice(0, allUnsubs.length);
      this.eventUnsubscribes = this.eventUnsubscribes.filter(u => !allUnsubs.includes(u));
    };

    for(const opts of Array.isArray(options) ? options : [options]) {
      // options defaults:

      const optsWithDefaults = {
        allOf: [],
        oneOf: [],
        once: false,
        ...opts,
      } as Prettify<
        Required<Pick<PicoEmitterOnMultiOptions<TEvtMap>, "allOf" | "oneOf">>
        & PicoEmitterOnMultiOptions<TEvtMap>
      >;

      const {
        oneOf,
        allOf,
        once,
        signal,
        callback,
      } = optsWithDefaults;

      if(signal?.aborted)
        return unsubAll;

      // if no events are provided, throw an error
      if(oneOf.length === 0 && allOf.length === 0)
        throw new TypeError("PicoEmitter.onMulti(): Either `oneOf` or `allOf` or both must be provided in the options");

      // unsubs:

      const curEvtUnsubs: Unsubscribe[] = [];

      const checkUnsubAllEvt = (force = false): void => {
        if(!signal?.aborted && !force)
          return;
        for(const unsub of curEvtUnsubs)
          unsub();
        curEvtUnsubs.splice(0, curEvtUnsubs.length);
        this.eventUnsubscribes = this.eventUnsubscribes.filter(u => !curEvtUnsubs.includes(u));
      };

      // track allOf state:
      const allOfEmitted: Set<TEvt> = new Set();
      const allOfConditionMet = (): boolean => allOf.length === 0 || allOfEmitted.size === allOf.length;

      // oneOf:

      for(const event of oneOf) {
        const unsub = this.events.on(event, ((...args: Parameters<TEvtMap[typeof event]>) => {
          checkUnsubAllEvt();
          // only call callback if allOf condition is met (or not applicable)
          if(allOfConditionMet()) {
            callback(event, ...args);
            if(once)
              checkUnsubAllEvt(true);
          }
        }) as TEvtMap[typeof event]);

        curEvtUnsubs.push(unsub);
      }

      // allOf:

      for(const event of allOf) {
        const unsub = this.events.on(event, ((...args: Parameters<TEvtMap[typeof event]>) => {
          checkUnsubAllEvt();
          allOfEmitted.add(event as TEvt);
          
          // only call callback if oneOf condition is met (or not applicable) AND allOf is complete
          if(allOfConditionMet() && (oneOf.length === 0 || oneOf.includes(event as TEvt))) {
            callback(event, ...args);
            if(once)
              checkUnsubAllEvt(true);
          }
        }) as TEvtMap[typeof event]);

        curEvtUnsubs.push(unsub);
      }

      allUnsubs.push(() => checkUnsubAllEvt(true));
    }

    return unsubAll;
  }

  //#region unsubscribeAll

  /** Unsubscribes all event listeners from this instance. Also clears the event catch-up memory. */
  protected unsubscribeAll(): void {
    for(const unsub of this.eventUnsubscribes)
      unsub();
    this.eventUnsubscribes = [];
    this.catchUpMemory.clear();
  }
}
