/**
 * Imports
 */

const {with_replaced, between} = require('./base')

/**
 * Utilities for interfacing with node callstacks
 */

function callsite_within (cs, file, start, end) {
    return (
        (cs.getFileName() === file)
        && between(cs.getLineNumber(), start, end)
    )
}

function caller (n = 1) {
    const stack = get_stack()
    const cs = get_stack()[n]
    return cs.getFunction()
}

function current_file () {
    const cs = get_call_stack()
    return cs[1].file
}

function get_error_stack () {
    const err = new Error()
    Error.captureStackTrace(err, arguments.callee)
    return err.stack
}

function get_stack () {
    // Remove get_error_stack, with_replaced, and get_stack
    const stack = with_replaced(
        Error,
        {
            stackTraceLimit: Infinity,
            prepareStackTrace: (obj, stack) => stack
        },
        get_error_stack
    )

    const idx = stack.findIndex(cs => (
        cs.getFunctionName() === 'get_stack'
        && cs.getFileName() === __filename
    ))

    return stack.slice(idx + 1)
}

/**
 * Exports
 */

module.exports = {
    callsite_within,
    caller,
    current_file,
    get_error_stack,
    get_stack
}
