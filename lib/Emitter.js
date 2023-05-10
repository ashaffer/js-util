/**
 * Simple event emitter class
 */

class Emitter {
    constructor () {
        this._events = {}
    }

    on (event, handler) {
        this._events[event] = this._events[event] || []
        this._events[event].push(handler)
        return () => this.off(event, handler)
    }

    once (event, handler) {
        const off = this.on(event, (...args) => {
            handler(...args)
            off()
        })

        return off
    }

    off (event, handler) {
        this._events[event] = handler
            ? this._events[handler].filter(h => h !== handler)
            : []
    }

    emit (name, ...args) {
        const fns = this._events[name] || []
        for (const fn of fns) {
            fn(name, ...args)
        }
    }
}

/**
 * Exports
 */

module.exports = Emitter
