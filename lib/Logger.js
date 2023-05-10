/**
 * Imports
 */

const Emitter = require('./Emitter')

/**
 * Logger
 */

class Logger extends Emitter {
    static get start_line () {
        return this._start_line || current_line()
    }

    static valid_types = new Set(['log', 'info', 'error', 'warn', 'except'])

    constructor (name = '') {
        super()
        this.name = name || this.class_name()
        this.prefix = `[${this.name}]`
    }

    cls () {
        return this.constructor
    }

    class_name () {
        return this.constructor.name
    }

    validate_type (type) {
        if (!valid_types.has(type) || (typeof console[type] !== 'function' && type !== 'except')) {
            throw this.except(`Invalid type '${type}' passed to an instance of ${this.class_name()}`)
        }
    }

    msg (...args) {
        return `${this.prefix} ${this.cls().msg(...args)}`
    }

    _log_internal (type, ...msgs) {
        const cls = this.cls()
        const fn_name = cls.caller_name()
        this.emit(type, this.class_name(), fn_name, ...msgs)
        const msg = msgs.map(msg => msg.toString())
        return `${this.prefix} ${fn_name}: ${msg}`
    }

    log (...args) {
        const msg = this._log_internal('log', ...args)
        console.log(msg)
    }

    error (...args) {
        const msg = this._log_internal('error', ...args)
        console.error(msg)
    }

    except (...args) {
        const msg = this._log_internal('except', ...args)
        return new Error(msg)
    }

    static caller_name () {
        return this.stack_above()[0].getFunctionName()
    }

    static stack_above () {
        const stack = get_stack()
        while (stack.length && this.contains_callsite(stack[0])) {
            stack.shift()
        }

        if (stack.length === 0) {
            throw new Error('[Logger] stack_above found no call stack')
        }

        return stack
    }

    static contains_callsite (cs) {
        return callsite_within(cs, __filename, this.start_line, this.end_line)
    }

    static get end_line () {
        return this._end_line || current_line()
    }
}

/**
 * Exports
 */

module.exports = Logger
