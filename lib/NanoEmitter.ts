/**
 * @module NanoEmitter
 * This module contains the NanoEmitter class, which is a tiny event emitter powered by [nanoevents](https://www.npmjs.com/package/nanoevents) - [see the documentation for more info](https://github.com/Sv443-Network/UserUtils/blob/main/docs.md#nanoemitter)
 */

import { createNanoEvents, type DefaultEvents, type Emitter, type EventsMap, type Unsubscribe } from "nanoevents";
import type { Prettify } from "./types.ts";
import { PicoEmitter, type PicoEmitterOnMultiOptions, type PicoEmitterOptions } from "./PicoEmitter.ts";

//#region types

export type NanoEmitterOptions = Prettify<{
  /** If set to true, allows emitting events through the public method emit() */
  publicEmit: boolean;
} & PicoEmitterOptions>;

/** Options for the {@linkcode NanoEmitter.onMulti()} method */
export type NanoEmitterOnMultiOptions<TEvtMap extends EventsMap, TKey extends keyof TEvtMap = keyof TEvtMap> = PicoEmitterOnMultiOptions<TEvtMap, TKey>;

//#region NanoEmitter

/**
 * Class that can be extended or instantiated by itself to create a lightweight event emitter with helper methods and a strongly typed event map.  
 * If extended from, prefer using `this.emitEvent()` over `this.events.emit()` — it updates the catch-up memory for any events listed in `catchUpEvents`.
 */
export class NanoEmitter<TEvtMap extends EventsMap = DefaultEvents> extends PicoEmitter<TEvtMap> {
  protected readonly events: Emitter<TEvtMap> = createNanoEvents<TEvtMap>();
  protected eventUnsubscribes: Unsubscribe[] = [];
  protected emitterOptions: NanoEmitterOptions;
  /** Stores the last arguments for each event listed in `catchUpEvents` */
  protected catchUpMemory: Map<PropertyKey, unknown[]> = new Map<PropertyKey, unknown[]>();

  /** Creates a new instance of NanoEmitter - a lightweight event emitter with helper methods and a strongly typed event map */
  constructor(options: Partial<NanoEmitterOptions> = {}) {
    super(options);
    this.emitterOptions = {
      publicEmit: false,
      ...options,
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
  public emit<TKey extends keyof TEvtMap>(event: TKey, ...args: Parameters<TEvtMap[TKey]>): boolean {
    if(this.emitterOptions.publicEmit) {
      this.emitEvent(event, ...args);
      return true;
    }
    return false;
  }

  //#region unsubscribeAll

  /** Unsubscribes all event listeners from this instance. Also clears the event catch-up memory. */
  public unsubscribeAll(): void {
    super.unsubscribeAll();
  }
}
