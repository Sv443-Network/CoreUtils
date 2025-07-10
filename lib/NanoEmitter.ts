/**
 * @module NanoEmitter
 * This module contains the NanoEmitter class, which is a tiny event emitter powered by [nanoevents](https://www.npmjs.com/package/nanoevents) - [see the documentation for more info](https://github.com/Sv443-Network/UserUtils/blob/main/docs.md#nanoemitter)
 */

import { createNanoEvents, type DefaultEvents, type Emitter, type EventsMap, type Unsubscribe } from "nanoevents";
import type { Prettify } from "./types.js";

//#region types

export interface NanoEmitterOptions {
  /** If set to true, allows emitting events through the public method emit() */
  publicEmit: boolean;
}

type NanoEmitterOnMultiTriggerOptions<TEvtMap extends EventsMap, TKey extends keyof TEvtMap = keyof TEvtMap> = {
  /** Calls the callback when one of the given events is emitted */
  oneOf?: TKey[];
  /** Calls the callback when all of the given events are emitted */
  allOf?: TKey[];
}

/** Options for the {@linkcode NanoEmitter.onMulti()} method */
export type NanoEmitterOnMultiOptions<TEvtMap extends EventsMap, TKey extends keyof TEvtMap = keyof TEvtMap> = Prettify<
  & {
    /** If true, the callback will be called only once for the first event (or set of events) that match the criteria */
    once?: boolean;
    /** If provided, can be used to abort the subscription if the signal is aborted */
    signal?: AbortSignal;
    /** The callback to call when the event with the given name is emitted */
    callback: (event: TKey, ...args: Parameters<TEvtMap[TKey]>) => void;
  }
  & NanoEmitterOnMultiTriggerOptions<TEvtMap, TKey>
  & (
    | Pick<Required<NanoEmitterOnMultiTriggerOptions<TEvtMap, TKey>>, "oneOf">
    | Pick<Required<NanoEmitterOnMultiTriggerOptions<TEvtMap, TKey>>, "allOf">
  )
>;

//#region NanoEmitter

/**
 * Class that can be extended or instantiated by itself to create a lightweight event emitter with helper methods and a strongly typed event map.  
 * If extended from, you can use `this.events.emit()` to emit events, even if the `emit()` method doesn't work because `publicEmit` is not set to true in the constructor.
 */
export class NanoEmitter<TEvtMap extends EventsMap = DefaultEvents> {
  protected readonly events: Emitter<TEvtMap> = createNanoEvents<TEvtMap>();
  protected eventUnsubscribes: Unsubscribe[] = [];
  protected emitterOptions: NanoEmitterOptions;

  /** Creates a new instance of NanoEmitter - a lightweight event emitter with helper methods and a strongly typed event map */
  constructor(options: Partial<NanoEmitterOptions> = {}) {
    this.emitterOptions = {
      publicEmit: false,
      ...options,
    };
  }

  //#region on

  /**
   * Subscribes to an event and calls the callback when it's emitted.  
   * @param event The event to subscribe to. Use `as "_"` in case your event names aren't thoroughly typed (like when using a template literal, e.g. \`event-${val}\` as "_")
   * @returns Returns a function that can be called to unsubscribe the event listener
   * @example ```ts
   * const emitter = new NanoEmitter<{
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
    return unsubProxy;
  }

  //#region once

  /**
   * Subscribes to an event and calls the callback or resolves the Promise only once when it's emitted.  
   * @param event The event to subscribe to. Use `as "_"` in case your event names aren't thoroughly typed (like when using a template literal, e.g. \`event-${val}\` as "_")
   * @param cb The callback to call when the event is emitted - if provided or not, the returned Promise will resolve with the event arguments
   * @returns Returns a Promise that resolves with the event arguments when the event is emitted
   * @example ```ts
   * const emitter = new NanoEmitter<{
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
   * @param options An object or array of objects with the following properties:  
   * `callback` (required) is the function that will be called when the conditions are met.  
   *   
   * Set `once` to true to call the callback only once for the first event (or set of events) that match the criteria, then stop listening.  
   * If `signal` is provided, the subscription will be aborted when the given signal is aborted.  
   *   
   * If `oneOf` is used, the callback will be called when any of the matching events are emitted.  
   * If `allOf` is used, the callback will be called after all of the matching events are emitted at least once, then any time any of them are emitted.  
   * You may use a combination of the above two options, but at least one of them must be provided.  
   *   
   * @returns Returns a function that can be called to unsubscribe all listeners created by this call. Alternatively, pass an `AbortSignal` to all options objects to achieve the same effect or for finer control.
   */
  public onMulti<TEvt extends keyof TEvtMap>(options: NanoEmitterOnMultiOptions<TEvtMap> | Array<NanoEmitterOnMultiOptions<TEvtMap>>): Unsubscribe {
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
        Required<Pick<NanoEmitterOnMultiOptions<TEvtMap>, "allOf" | "oneOf">>
        & NanoEmitterOnMultiOptions<TEvtMap>
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

      // oneOf:

      for(const event of oneOf) {
        const unsub = this.events.on(event, ((...args: Parameters<TEvtMap[typeof event]>) => {
          checkUnsubAllEvt();
          callback(event, ...args);
          if(once)
            checkUnsubAllEvt(true);
        }) as TEvtMap[typeof event]);

        curEvtUnsubs.push(unsub);
      }

      // allOf:

      const allOfEmitted: Set<TEvt> = new Set();

      const checkAllOf = (event: TEvt, ...args: Parameters<TEvtMap[TEvt]>): void => {
        checkUnsubAllEvt();
        allOfEmitted.add(event);
        if(allOfEmitted.size === allOf.length) {
          callback(event, ...args);
          if(once)
            checkUnsubAllEvt(true);
        }
      };

      for(const event of allOf) {
        const unsub = this.events.on(event, ((...args: Parameters<TEvtMap[typeof event]>) => {
          checkUnsubAllEvt();
          checkAllOf(event as TEvt, ...args);
        }) as TEvtMap[typeof event]);

        curEvtUnsubs.push(unsub);
      }

      // if no events are provided, throw an error
      if(oneOf.length === 0 && allOf.length === 0)
        throw new TypeError("NanoEmitter.onMulti(): Either `oneOf` or `allOf` or both must be provided in the options");

      allUnsubs.push(() => checkUnsubAllEvt(true));
    }

    return unsubAll;
  }

  //#region emit

  /**
   * Emits an event on this instance.  
   * - ⚠️ Needs `publicEmit` to be set to true in the NanoEmitter constructor or super() call!
   * @param event The event to emit
   * @param args The arguments to pass to the event listeners
   * @returns Returns true if `publicEmit` is true and the event was emitted successfully
   */
  public emit<TKey extends keyof TEvtMap>(event: TKey, ...args: Parameters<TEvtMap[TKey]>): boolean {
    if(this.emitterOptions.publicEmit) {
      this.events.emit(event, ...args);
      return true;
    }
    return false;
  }

  //#region unsubscribeAll

  /** Unsubscribes all event listeners from this instance */
  public unsubscribeAll(): void {
    for(const unsub of this.eventUnsubscribes)
      unsub();
    this.eventUnsubscribes = [];
  }
}
