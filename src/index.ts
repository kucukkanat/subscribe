type EventHandler = (event?: any) => void;
type WildCardEventHandler = (type: string, event?: any) => void

/**
 * An array of all currently registered event handlers for a type
 */
type EventHandlerList = Array<EventHandler>;
type WildCardEventHandlerList = Array<WildCardEventHandler>;
/**
 * A map of event types and their corresponding event handlers.
 */
type EventHandlerMap = {
    '*'?: WildCardEventHandlerList,
    [type: string]: EventHandlerList,
};

/**
 * Emitter class that powers the subscribe packet
 */
export class Emitter<EventNames = string> {
    /**
     * Use the constructor to initiate the eventbus with handlers
     * @param {EventHandlerMap} listeners 
     */
    constructor(public listeners: EventHandlerMap = {}) {
        this.listeners = listeners
    }
    /**
         * Register an event handler for the given type.
         *
         * @param  {String} type	Type of event to listen for, or `"*"` for all events
         * @param  {Function} handler Function to call in response to given event
         */
    on(type: (string & EventNames) | "*", handler: EventHandler | WildCardEventHandler) {
        this.listeners[type] = this.listeners[type] || []
        this.listeners[type].push(handler);
    }

    /**
     * Invoke this listener only once
     * @param {string & EventNames} type  Type of event to emit, or `"*"` for all events
     * @param {EventHandler} handler 
     */
    once(type: string & EventNames, handler: EventHandler) {
        let _this = this
        this.on(type, function g(...args: any) {
            _this.off(type, g);
            handler.apply(_this, args);
        });
    }

    /**
     * Remove an event handler for the given type.
     *
     * @param  {String} type	Type of event to unregister `handler` from, or `"*"`
     * @param  {Function} handler Handler function to remove
     */
    off(type: string & EventNames, handler?: EventHandler | WildCardEventHandler) {
        if (this.listeners[type]) {
            if (!handler) {
                delete this.listeners[type]
            } else {
                this.listeners[type].splice(this.listeners[type].indexOf(handler) >>> 0, 1);
            }
        }
    }

    /**
     * Invoke this.listeners handlers for the given type.
     * If present, `"*"` handlers are invoked after type-matched handlers.
     *
     * Note: Manually firing "*" handlers is not supported.
     *
     * @param {String} type  The event type to invoke
     * @param {Any} [evt]  Any value (object is recommended and powerful), passed to each handler
     */
    emit(type: string & EventNames, evt?: any) {
        (this.listeners[type] || []).slice().map((handler) => { handler(evt); });
        (this.listeners['*'] || []).slice().map((handler) => { handler(type, evt); });
    }
}

if (typeof window !== "undefined") {
    (window as any).__Emitter__ = { Emitter }
}

